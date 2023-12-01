import { Channel } from '../entities/channel.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    channel_id: Channel;

    @IsNotEmpty()
    @IsString()
    sender_id: User;

    @IsNotEmpty()
    @IsString()
    message: string;
}
