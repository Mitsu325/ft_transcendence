import {
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamExistValidationPipe } from 'src/common/code-validation.pipe';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @ApiOperation({ description: 'Request 42 access token' })
    @Post('42')
    async handleToken(
        @Query('code', ParamExistValidationPipe) code: string,
        @Res() res: Response,
    ) {
        try {
            const token = await this.authService.requestAccessToken(code);

            if (!token.access_token) {
                throw new HttpException(
                    'Login using oauth 42 was not allowed',
                    HttpStatus.FORBIDDEN,
                );
            }

            const resourceOwner = await this.authService.requestResourceOwner(
                token.access_token,
            );

            if (!resourceOwner.email) {
                throw new HttpException(
                    'Login using oauth 42 was not allowed',
                    HttpStatus.FORBIDDEN,
                );
            }

            const emailExists = await this.userService.findEmail(
                resourceOwner.email,
            );
            let user = emailExists;
            if (!user) {
                user = await this.userService.createFromOAuth({
                    name: resourceOwner.usual_full_name,
                    email: resourceOwner.email,
                    avatar: resourceOwner?.image?.link ?? '',
                });
            }
            const data = {
                avatar: user.avatar,
                email: user.email,
                name: user.name,
                twoFactorAuth: user.twoFactorAuth,
                username: user.username,
            };
            res.status(HttpStatus.OK).json({
                message: 'Successfully exchanged code for access token',
                data,
            });
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                throw new HttpException(
                    `Error getting data: ${error.message}`,
                    status,
                );
            } else if (error.request) {
                throw new HttpException(
                    'Unable to get response from server',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            } else {
                throw new HttpException(
                    'Error configuring the request',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
