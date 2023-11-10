import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class EmailExistsValidationPipe implements PipeTransform<CreateUserDto> {
    constructor(private readonly userService: UserService) {}

    async transform(value: CreateUserDto) {
        const emailExists = await this.userService.findEmail(value.email);
        if (emailExists) {
            throw new BadRequestException('Email is already in use.');
        }
        return value;
    }
}
