import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name_channel: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsString()
    @MinLength(6, { message: 'The password must be at least 6 characters.' })
    @ApiProperty()
    password?: string;

    @IsString()
    @ApiProperty()
    owner: User;
}
