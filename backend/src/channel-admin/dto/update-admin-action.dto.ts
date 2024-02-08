import { IsString, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../entities/admin-action.entity';

export class UpdateAdminActionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    channelId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    memberId: string;

    @IsNotEmpty()
    @ApiProperty()
    action: ActionType;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    active: boolean;

    @IsDate()
    @ApiProperty()
    expirationDate: string;
}
