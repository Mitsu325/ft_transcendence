import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    channel_id: Channel;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    admin_id: User;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    active: boolean;
}
