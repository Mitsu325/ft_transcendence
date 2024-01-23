import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    channel_id: Channel;

    @IsString()
    @IsNotEmpty()
    admin_id: User;

    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
