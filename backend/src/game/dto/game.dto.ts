import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBattleDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    host: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    guest: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    winnerScore: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    loserScore: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    winner: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string;
}
