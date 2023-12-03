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
  avatar: null | string;
}

interface Room {
  room_id: string;
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
    // console.log(client.id + ' connected !!!');
  }

  handleDisconnect(client: Socket) {
    const playerId = game.players[client.id]?.id;

    console.log(playerId);

    if (playerId) {
      delete game.players[client.id];
      this.server.emit('players', Object.values(game.players));
      // console.log('player disconnect:', JSON.stringify(game.players, null, 2));
    }

    const roomId = game.rooms[client.id]?.player1.id;

    if (roomId) {
      delete game.rooms[client.id];
      this.server.emit('rooms', Object.values(game.rooms));
      // console.log('room disconnect:', JSON.stringify(game.rooms, null, 2));
      // console.log(game.rooms);
    }
    console.log(game.rooms);
  }

  @SubscribeMessage('CreateRoom')
  handleCreateRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    // const existingRoom = game.rooms[client.id];
    const playerAlreadyInRoom = Object.values(game.rooms).find(room => room.player1.id === user.id || (room.player2 && room.player2.id === user.id));

    if (!playerAlreadyInRoom) {
      client.join(client.id);
      game.rooms[client.id] = { room_id: client.id, player1: { ...user }, player2: null };
    } else {
      console.log('The Player is already in the room:', client.id);
    }
    this.server.emit('rooms', Object.values(game.rooms));
    this.server.emit('players', Object.values(game.players));
    // console.log('rooms:', JSON.stringify(game.rooms, null, 2));
    console.log('----------------------------');
    console.log(game.rooms);
    console.log('----------------------------');
  }

  @SubscribeMessage('GetInRoom')
  handleGetInRoom(@MessageBody() room: Room, @ConnectedSocket() client: Socket) {
    // const existingRoom = game.rooms[room.room_id];
    const playerAlreadyInRoom = Object.values(game.rooms).find(existingRoom => existingRoom.player1.id === room.player2.id || (existingRoom.player2 && existingRoom.player2.id === room.player2.id));

    if (!playerAlreadyInRoom) {
      client.join(room.room_id);
      game.rooms[room.room_id].player2 = { ...room.player2 };
    } else {
      console.log('The Player is already in the room:', client.id);
    }
    this.server.emit('rooms', Object.values(game.rooms));
    this.server.emit('players', Object.values(game.players));
    // console.log('rooms:', JSON.stringify(game.rooms, null, 2));
    console.log('----------------------------');
    console.log(game.rooms);
    console.log('----------------------------');
  }

  @SubscribeMessage('PlayerConnected')
  handlePlayerConnected(@MessageBody() player: any, @ConnectedSocket() client: Socket) {
    const existingPlayer = game.players[client.id];

    if (!existingPlayer) {
      game.players[client.id] = { id: player.id, name: player.username, avatar: player.avatar };
    } else {
      console.log('Player with the same ID already exists:', player.id);
    }
    // console.log('players em connect:', JSON.stringify(game.players, null, 2));
    this.server.emit('rooms', Object.values(game.rooms));
    this.server.emit('players', Object.values(game.players));
  }
}
