import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { ChatGateway } from './socket.gateway';

@Module({
    controllers: [SocketController],
    providers: [ChatGateway],
})
export class SocketModule {}
