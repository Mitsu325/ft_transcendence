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
import { GameService, Player, Room, Game } from './game.service';

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

  constructor(private readonly gameService: GameService) { }

  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(client: Socket) {
    const playerId = game.players[client.id]?.id;

    if (playerId) {
      delete game.players[client.id];
      this.server.emit('game', game);
    }

    const roomId = this.gameService.findRoomByPlayerId(playerId, game);

    if (roomId) {
      delete game.rooms[client.id];
      client.leave(roomId);
      this.server.emit('game', game);
    }
  }

  @SubscribeMessage('CreateRoom')
  handleCreateRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    const playerAlreadyInRoom = Object.values(game.rooms).find(room => room.player1.id === user.id || (room.player2 && room.player2.id === user.id));

    if (!playerAlreadyInRoom) {
      client.join(client.id);
      game.rooms[client.id] = { room_id: client.id, player1: { ...user }, player2: null };
    } else {
      console.log('The Player is already in the room:', client.id);
    }

    this.server.emit('game', game);
  }

  @SubscribeMessage('GetInRoom')
  handleGetInRoom(@MessageBody() room: Room, @ConnectedSocket() client: Socket) {
    const playerAlreadyInRoom = Object.values(game.rooms).find(existingRoom => existingRoom.player1.id === room.player2.id || (existingRoom.player2 && existingRoom.player2.id === room.player2.id));

    if (!playerAlreadyInRoom) {
      client.join(room.room_id);
      game.rooms[room.room_id].player2 = { ...room.player2 };
    } else {
      console.log('The Player is already in the room:', client.id);
    }

    this.server.emit('game', game);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    const roomId = this.gameService.findRoomByPlayerId(user.id, game);

    if (roomId) {
      delete game.rooms[client.id];
      client.leave(roomId);
      this.server.emit('game', game);
      console.log(game.rooms);
    }
  }

  @SubscribeMessage('PlayerConnected')
  handlePlayerConnected(@MessageBody() player: any, @ConnectedSocket() client: Socket) {
    const existingPlayer = game.players[client.id];

    if (!existingPlayer) {
      game.players[client.id] = { id: player.id, name: player.username, avatar: player.avatar };
    } else {
      console.log('Player with the same ID already exists:', player.id);
    }

    this.server.emit('game', game);
  }
}
