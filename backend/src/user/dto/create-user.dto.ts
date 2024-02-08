import {
    IsString,
    IsEmail,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8, { message: 'The password must be at least 8 characters.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
            'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    })
    password: string;

    @ApiProperty()
    twoFactorSecret: string;
}
