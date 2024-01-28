import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { UserModule } from 'src/user/user.module';
import { FriendGateway } from './friend.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Friend])],
    controllers: [FriendController],
    providers: [FriendService, FriendGateway],
})
export class FriendModule {}
