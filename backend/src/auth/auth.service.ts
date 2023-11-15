import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import authConfig from 'src/configs/auth.config';
import { UserService } from 'src/user/user.service';
import { comparePass, hashPassword } from 'src/utils/hash.util';
import { twoFactorGenerator } from 'src/utils/twoFactor.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(username, password) {
    const user = await this.userService.findUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const matchPass = await comparePass(password, user.password);
    if (!matchPass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(name, email, username, password) {
    const hashPass = await hashPassword(password);
    password = hashPass;
    username = username.replace(/\s/g, '');
    const userWithLogin = await this.userService.findByUsername(username);
    if (userWithLogin) {
      username = uuidv4();
    }

    const twoFactorSecret = await twoFactorGenerator();

    const user = await this.userService.create({
      name,
      email,
      username,
      password,
      twoFactorSecret,
    });
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestAccessToken(code: string): Promise<any> {
    try {
      const data = new URLSearchParams();
      data.append('grant_type', 'authorization_code');
      data.append('client_id', authConfig.clientId);
      data.append('client_secret', authConfig.clientSecret);
      data.append('code', code);
      data.append('redirect_uri', authConfig.redirectUri);

      const response = await axios.post(authConfig.tokenUrl, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async requestResourceOwner(token: string): Promise<any> {
    try {
      const response = await axios.get(authConfig.getResourceOwnerUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signInWith42(code: string) {
    try {
      const token = await this.requestAccessToken(code);
      const resourceOwner = await this.requestResourceOwner(
        token.access_token,
      );

      if (!resourceOwner.email || !token.access_token) {
        throw new HttpException(
          'Login using oauth 42 was not allowed',
          HttpStatus.FORBIDDEN,
        );
      }

      let user = await this.userService.findEmail(resourceOwner.email);

      if (!user) {
        let username = resourceOwner.login.replace(/\s/g, '');
        const userWithLogin = await this.userService.findByUsername(
          resourceOwner.login,
        );
        if (userWithLogin) {
          username = uuidv4();
        }

        user = await this.userService.createFromOAuth({
          name: resourceOwner.usual_full_name,
          email: resourceOwner.email,
          username,
          avatar: resourceOwner?.image?.link ?? '',
        });
      }
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      const errorMessage = error.response?.status
        ? `Error getting data: ${error.message}`
        : error.request
          ? 'Unable to get response from server'
          : 'Error configuring the request';
      const status =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, status);
    }
  }
}
