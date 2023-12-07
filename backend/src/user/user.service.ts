import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateFromOAuthDto } from './dto/create-from-oauth.dto';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
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

    findUsername(username: string) {
        return this.usersRepository.findOne({
            where: [{ username: username }, { email: username }],
        });
    }

    findEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }
}
