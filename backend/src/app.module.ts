import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), UserModule, AuthModule],
    controllers: [AppController, TwoFactorAuthController],
    providers: [AppService],
})
export class AppModule {}
