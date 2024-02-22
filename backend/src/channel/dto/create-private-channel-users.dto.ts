import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivateChannelUsersDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    channelId: string;
}
