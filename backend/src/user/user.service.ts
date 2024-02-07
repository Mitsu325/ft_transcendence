import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateFromOAuthDto } from './dto/create-from-oauth.dto';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { twoFactorGenerator } from 'src/utils/twoFactor.util';
// import { AuthService } from 'src/auth/auth.service';

interface UserStatus {
  id: string;
  status: string;
}

export interface UpdateStatusResponse {
  [userId: string]: { status: string; }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly uploadFileService: UploadFileService,
    // private readonly authService: AuthService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async createFromOAuth(createUserOAuthDto: CreateFromOAuthDto) {
    try {
      const user = this.usersRepository.create(createUserOAuthDto);
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }

  async findByEmailOrUsername(username: string) {
    return await this.usersRepository.findOne({
      where: [{ username: username }, { email: username }],
    });
  }

  findEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUsersByName(name: string) {
    const users = await this.usersRepository.find({
      where: [
        { name: ILike(`%${name}%`) },
        { username: ILike(`%${name}%`) },
      ],
    });
    return users.map(user => getNonSensitiveUserInfo(user));
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map(user => getNonSensitiveUserInfo(user));
  }

  async getNoSecrets(id: string) {
    const user = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, twoFactorSecret, ...data } = user;
    return data;
  }

  async getSensitiveDataById(userId: string) {
    const user = await this.findById(userId);
    return getNonSensitiveUserInfo(user);
  }

  async getSensitiveDataByUsername(username: string) {
    const user = await this.findByUsername(username);
    return getNonSensitiveUserInfo(user);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const { avatar: oldAvatar } = await this.findById(userId);
    const { publicUrl } = await this.uploadFileService.uploadStorage(
      'avatar',
      userId + '_' + Date.now().toString(),
      file,
    );
    if (publicUrl) {
      await this.usersRepository.update(
        {
          id: userId,
        },
        {
          avatar: publicUrl,
        },
      );
      if (oldAvatar) {
        await this.uploadFileService.deleteFileStorage(
          'avatar',
          oldAvatar.split('/').pop(),
        );
      }
    }
    return await this.getNoSecrets(userId);
  }

  async update2fa(userId: string, status: boolean) {
    await this.usersRepository.update(
      { id: userId },
      { twoFactorAuth: status },
    );
    const user = await this.getNoSecrets(userId);
    const res = {
      user,
    };
    if (status) {
      const newTwoFactorSecret = await twoFactorGenerator();
      await this.usersRepository.update(
        { id: userId },
        { twoFactorSecret: newTwoFactorSecret },
      );
      const { twoFactorSecret, name } = await this.findById(userId);
      res['secret'] = twoFactorSecret;
      res['url'] = `otpauth://totp/${encodeURIComponent(
        name,
      )}?secret=${twoFactorSecret}&issuer=pong`;
    }
    return res;
  }

  private userStatusData: Record<string, UserStatus> = {};
  async updateStatusUser(status: UserStatus) {
    const { id, status: newStatus } = status;

    if (newStatus === 'offline') {
      if (this.userStatusData[id]) {
        delete this.userStatusData[id];
      }
    } else {
      if (this.userStatusData[id]) {
        this.userStatusData[id].status = newStatus;
      } else {
        this.userStatusData[id] = { id, status: newStatus };
      }
    }
  }

  async updatedUsersStatus() {
    const updatedData = Object.entries(this.userStatusData).reduce(
      (acc, [userId, userData]) => {
        if (userData.status !== 'offline') {
          acc.push({ id: userId, status: userData.status });
        }
        return acc;
      },
      [] as { id: string; status: string }[],
    );
    console.log('updatedData: ', updatedData);
    return updatedData;
  }
}
