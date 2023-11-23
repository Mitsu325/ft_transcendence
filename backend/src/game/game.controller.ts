import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const players = [];

@ApiTags('pong')
@Controller('pong')
@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class GamePong implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  players: any[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id + ' connected !!!');
  }

  handleDisconnect(client: Socket) {
    const index = players.findIndex((p) => p.sid === client.id);
    if (index !== -1) {
      players.splice(index, 1);
    }
    this.server.emit('players', players);
    console.log(players);
  }

  @SubscribeMessage('PlayerConnected')
  handlePlayerConnected(@MessageBody() player: any, @ConnectedSocket() client: Socket) {
    const existingPlayerIndex = players.findIndex((p) => p.id === player.id);

    if (existingPlayerIndex === -1) {
      players.push({ id: player.id, sid: client.id, ...player });
    } else {
      console.log('Player with the same ID already exists:', player.id);
    }
    this.server.emit('players', players);
    console.log(players);
  }
}
