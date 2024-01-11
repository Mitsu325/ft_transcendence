import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as speakeasy from 'speakeasy';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
    constructor(private readonly userService: UserService) {}

    @Post('verifyOTP')
    async verifyOTP(
        @Body() body: { userId: string; otp: string },
    ): Promise<{ verified: boolean }> {
        const user = await this.userService.findUser(body.userId);

        const verified: boolean = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: body.otp,
        });
        return { verified };
    }
}
