import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeorm from './configs/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { typeOrmConfig } from './configs/typeorm.config';
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
        // TypeOrmModule.forRoot(typeOrmConfig),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeorm],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        UserModule,
        AuthModule,
        ChannelModule,
        GameModule,
        ChatModule,
        UploadFileModule,
        FriendModule,
        ChannelAdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
