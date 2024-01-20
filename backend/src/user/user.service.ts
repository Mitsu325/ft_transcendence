import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateFromOAuthDto } from './dto/create-from-oauth.dto';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly uploadFileService: UploadFileService,
    ) {}

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

    async findUser(id: string) {
        const user = await this.findById(id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...data } = user;
        return data;
    }

    async findAll() {
        const users = await this.usersRepository.find();
        return users.map(user => getNonSensitiveUserInfo(user));
    }

    private async findById(id: string) {
        return await this.usersRepository.findOne({
            where: { id },
        });
    }

    async findByUsername(username: string) {
        return await this.usersRepository.findOne({
            where: { username },
        });
    }

    findUsername(username: string) {
        return this.usersRepository.findOne({
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

    async getUserSensitiveDataById(userId: string) {
        const user = await this.findById(userId);
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
        return await this.findUser(userId);
    }
}
