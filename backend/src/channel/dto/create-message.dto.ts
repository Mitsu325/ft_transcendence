import { Channel } from '../entities/channel.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    channel_id: Channel;

    @IsNotEmpty()
    @IsString()
    sender_id: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
