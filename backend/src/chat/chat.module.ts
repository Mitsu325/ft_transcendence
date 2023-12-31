import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { DirectMessage } from './entities/direct-message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forFeature([DirectMessage]),
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        ChatGateway,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class ChatModule {}
