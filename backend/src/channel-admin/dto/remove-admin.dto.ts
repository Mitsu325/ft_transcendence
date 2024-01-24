import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveAdminDto {
    @IsNotEmpty()
    @IsString()
    channel_id: string;

    @IsNotEmpty()
    @IsString()
    admin_id: string;
}
