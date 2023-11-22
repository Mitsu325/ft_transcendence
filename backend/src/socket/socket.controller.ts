import { Controller, Get } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';

@Controller('socket')
export class SocketController {
    constructor(private readonly chatGateway: ChatGateway) {}

    @Get('send')
    sendMessage(): string {
        this.chatGateway.handleMessage('Hello from server!');
        return 'Message sent';
    }
}
