import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
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
  @MaxLength(200)
  @ApiProperty()
  status: string;
}
