import { Controller, Get, Post, Body } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  @Get('generateSecret')
  generateSecret(): { secret: string; otpauth_url: string } | string {
    if (speakeasy && speakeasy.generateSecret) {
      const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret({ length: 20 });
      return {
        secret: secret.base32,
        otpauth_url: secret.otpauth_url,
      };
    } else {
      return "speakeasy ou speakeasy.generateSecret not defined";
    }
  }

  @Post('verifyOTP')
  verifyOTP(@Body() body: { secret: string; otp: string }): { verified: boolean } {
    const verified: boolean = speakeasy.totp.verify({
      secret: body.secret,
      encoding: 'base32',
      token: body.otp,
    });
    return { verified };
  }
}
