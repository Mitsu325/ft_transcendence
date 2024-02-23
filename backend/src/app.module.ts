import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { ChannelModule } from './channel/channel.module';
import { FriendModule } from './friend/friend.module';
import { ChannelAdminModule } from './channel-admin/channel-admin.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        UserModule,
        AuthModule,
        ChannelModule,
        GameModule,
        ChatModule,
        UploadFileModule,
        FriendModule,
        ChannelAdminModule,
    ],
})
export class AppModule {}
