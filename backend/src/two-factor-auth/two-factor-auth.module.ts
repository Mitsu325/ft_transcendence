import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TwoFactorAuthController],
  providers: [UserService],
})
export class TwoFactorAuthModule { }