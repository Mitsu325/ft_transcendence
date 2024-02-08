import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { ParamExistValidationPipe } from 'src/common/code-validation.pipe';
import { LoginDto } from 'src/user/dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from 'src/common/constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @ApiOperation({ description: 'Request 42 access token' })
    @ApiQuery({ name: 'code', type: String, required: true })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('42')
    async handleToken(@Query('code', ParamExistValidationPipe) code: string) {
        return await this.authService.signInWith42(code);
    }

    @ApiOperation({ description: 'Login user' })
    @ApiBody({ type: LoginDto, description: 'Login request body.' })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() loginDto: LoginDto) {
        return await this.authService.signIn(
            loginDto.username,
            loginDto.password,
        );
    }

    @ApiOperation({ description: 'Create a new user' })
    @ApiBody({ type: CreateUserDto, description: 'Request body.' })
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signUp(
            createUserDto.name,
            createUserDto.email,
            createUserDto.username,
            createUserDto.password,
        );
    }

    @ApiOperation({ description: 'Verify 2FT' })
    @ApiBody({ type: CreateUserDto, description: 'Request body.' })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('two-factor-auth')
    async verifyOTP(@Body() body: { userId: string; otp: string }) {
        return await this.authService.verifyOTP(body);
    }

    @ApiOperation({ description: 'Get req user' })
    @ApiBearerAuth('access-token')
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
