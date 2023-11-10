import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateFromOAuthDto } from './dto/create-from-oauth.dto';

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

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
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
