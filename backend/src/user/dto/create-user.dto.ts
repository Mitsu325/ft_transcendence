import { IsString, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength, IsDefined } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    username: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'The password must be at least 8 characters.', })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    })
    password: string;
}
