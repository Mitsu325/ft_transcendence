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
import { jwtConstants } from 'src/configs/jwt';
import { twoFactorGenerator } from 'src/utils/twoFactor.util';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(username, password) {
        const user = await this.userService.findByEmailOrUsername(username);
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

    async verifyOTP(body: {
        userId: string;
        otp: string;
    }): Promise<{ verified: boolean }> {
        const user = await this.userService.findById(body.userId);

        const verified: boolean = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: body.otp,
        });
        return { verified };
    }

    async signUp(name, email, username, password) {
        const emailExists = await this.userService.findEmail(email);
        if (emailExists) {
            return { success: false, reason: 'email_exists' };
        }
        const usernameExists = await this.userService.findByUsername(username);
        if (usernameExists) {
            return { success: false, reason: 'username_exists' };
        }
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
            success: true,
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

    async getJwtUser(token: string) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
        });
        return payload.sub;
    }
}
