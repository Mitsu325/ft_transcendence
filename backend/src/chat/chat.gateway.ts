import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        console.log('message', message);
        this.server.emit('message', message);
    }
}
