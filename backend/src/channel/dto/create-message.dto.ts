import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    channel_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    sender_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    message: string;
}
