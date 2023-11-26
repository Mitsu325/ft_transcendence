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

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface Room {
  player1: Player;
  player2: Player;
}

interface Game {
  players: { [key: string]: Player };
  rooms: { [key: string]: Room };
}

const game: Game = {
  players: {},
  rooms: {},
};

@ApiTags('pong')
@Controller('pong')
@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class GamePong implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id + ' connected !!!');
  }

  handleDisconnect(client: Socket) {
    const playerId = game.players[client.id]?.id;

    if (playerId) {
      delete game.players[client.id];
      this.server.emit('players', Object.values(game.players));
    }
    console.log('players em disconnect: ' + Object.values(game.players));

    const roomId = game.rooms[client.id]?.player1.id;

    if (roomId) {
      delete game.rooms[client.id];
      this.server.emit('rooms', Object.values(game.rooms));
    }
    console.log('rooms em disconnect: ' + Object.values(game.rooms));
    console.log(client.id + ' disconnected !!!');
  }

  @SubscribeMessage('CreateRoom')
  handleCreateRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    const existingRoom = game.rooms[client.id];

    if (!existingRoom) {
      client.join(client.id);
      game.rooms[client.id] = { player1: { ...user }, player2: null };
    } else {
      console.log('The Player is already in the room:', client.id);
    }
    this.server.emit('rooms', Object.values(game.rooms));
  }

  @SubscribeMessage('PlayerConnected')
  handlePlayerConnected(@MessageBody() player: any, @ConnectedSocket() client: Socket) {
    const existingPlayer = game.players[client.id];

    if (!existingPlayer) {
      game.players[client.id] = { ...player };
      this.server.emit('players', Object.values(game.players));
    } else {
      console.log('Player with the same ID already exists:', player.id);
    }
  }
}
