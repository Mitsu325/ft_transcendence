import { Channel } from '../entities/channel.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    channel_id: Channel;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    sender_id: User;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    message: string;
}
