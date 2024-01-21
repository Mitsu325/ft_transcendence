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
    winner_score: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    loser_score: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    winner: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string;
}
