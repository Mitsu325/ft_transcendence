import { Inject, forwardRef } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChannelAdminService } from 'src/channel-admin/channel-admin.service';

const usersInRooms = {};
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChannelGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChannelAdminService))
    private readonly channelAdminService: ChannelAdminService,
  ) { }

  private rooms: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    console.log(`Usuário conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Usuário desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userName: string; roomId: string },
  ) {
    if (
      !usersInRooms[client.id] ||
      !usersInRooms[client.id].includes(data.roomId)
    ) {
      client.join(data.roomId);

      if (!usersInRooms[client.id]) {
        usersInRooms[client.id] = [];
      }
      usersInRooms[client.id].push(data.roomId);

      this.server
        .to(data.roomId)
        .emit('joinedRoom', data.roomId, data.userName);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      roomId: string;
      message: string;
      userId: string;
      userName: string;
      createdAt: string;
    },
  ) {
    const memberAction = await this.channelAdminService.findMemberAction(
      data.roomId,
      data.userId,
    );

    if (memberAction.action) return;

    this.sendMessageToRoom(
      data.roomId,
      data.message,
      data.userName,
      data.createdAt,
    );
  }

  private sendMessageToRoom(
    roomId: string,
    message: string,
    userName: string,
    createdAt: string,
  ) {
    this.server.to(roomId).emit('message', {
      message: message,
      userName: userName,
      createdAt: createdAt,
    });
  }
}
