import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsEmail,
} from 'class-validator';

export class CreateFromOAuthDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    email: string;

    @IsString()
    username: string;

    @IsString()
    avatar: string;
}
