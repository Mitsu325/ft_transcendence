import { Logger, UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

type TextMessage = {
    id: string;
    type: 'text';
    text: string;
    senderUser: {
        id: string;
        avatar: string;
        name: string;
        username?: string;
    };
    hour: string;
};

type Message = {
    recipientId: string;
    message: TextMessage;
};

type SendMessage = {
    message: TextMessage;
    recipient: {
        id: string;
        avatar: string;
        name: string;
        username?: string;
    };
};

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

    constructor(private readonly authService: AuthService) {}

    @WebSocketServer()
    server: Server;

    @UseGuards(AuthGuard)
    async handleConnection(socket: Socket) {
        this.logger.log(`Connected socket ${socket.id}`);

        const jwt = socket.handshake.auth.token || null;
        const userId = await this.authService.getJwtUser(jwt);
        if (!userId) {
            this.handleDisconnect(socket);
        }
        socket.data.userId = userId;
        socket.join(userId);
    }

    handleDisconnect(socket: Socket) {
        this.logger.log(`Socket disconnected ${socket.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(socket: Socket, { recipientId, message }: Message) {
        this.server
            .to(recipientId)
            .emit('message', { senderId: socket.data.userId, message });
    }

    @SubscribeMessage('send-message')
    handleSendMessage(socket: Socket, sendMessage: SendMessage) {
        this.server.to(socket.data.userId).emit('send-message', sendMessage);
    }
}
