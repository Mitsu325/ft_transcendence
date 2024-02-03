import { Logger, UseGuards } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { userNonSensitiveInfo } from 'src/utils/formatNonSensitive.util';

type InvitePlay = {
    sender: userNonSensitiveInfo;
    recipient: userNonSensitiveInfo;
};

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
    },
    namespace: 'friend',
})
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(FriendGateway.name);

    constructor(private readonly authService: AuthService) {}

    @WebSocketServer()
    server: Server;

    @UseGuards(AuthGuard)
    async handleConnection(socket: Socket) {
        this.logger.log(`Connected socket ${socket.id}`);
        const jwt = socket.handshake.auth.token || null;
        if (!jwt) {
            this.handleDisconnect(socket);
            return;
        }
        const userId = await this.authService.getJwtUser(jwt);
        if (!userId) {
            this.handleDisconnect(socket);
            return;
        }
        socket.data.userId = userId;
        socket.join(userId);
    }

    handleDisconnect(socket: Socket) {
        this.logger.log(`Socket disconnected ${socket.id}`);
    }

    @SubscribeMessage('invite-play')
    handleInviteToPlay(@MessageBody() { recipient, sender }: InvitePlay) {
        this.server.to(recipient.id).emit('invite-play', { sender });
    }

    @SubscribeMessage('decline-invite')
    handleDeclineInvite(@MessageBody() { recipient, sender }: InvitePlay) {
        this.server.to(sender.id).emit('decline-invite', { recipient });
    }
}
