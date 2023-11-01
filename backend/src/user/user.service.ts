import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

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
            console.error(error);
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = 15;
        const hashPass = await bcrypt.hash(password, salt);
        return hashPass;
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    findUser(username: string) {
        return this.usersRepository.findOne({ where: { username } });
    }

    update(id: number) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
