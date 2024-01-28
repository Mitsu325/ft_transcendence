import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveAdminDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    channel_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    admin_id: string;
}
