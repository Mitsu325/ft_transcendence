import { Module } from '@nestjs/common';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [TwoFactorAuthController],
})
export class TwoFactorAuthModule {}
