import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    name_channel: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @MinLength(6, { message: 'The password must be at least 6 characters.' })
    password?: string;

    @IsString()
    owner: User;
}
