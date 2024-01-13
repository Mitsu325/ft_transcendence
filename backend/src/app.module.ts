import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { ChannelModule } from './channel/channel.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        UserModule,
        AuthModule,
        ChannelModule,
        GameModule,
        ChatModule,
        UploadFileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
