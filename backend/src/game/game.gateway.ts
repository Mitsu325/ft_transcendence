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
import { GameService, Player, Room, Game, Match } from './game.service';

interface Padle {
  type: string;
  key: string;
  player: string;
}

const game: Game = {
  players: {},
  rooms: {},
};

const match: Match = {
  matchStatus: 'WAITING',
  ball: {
    x: 580 / 2,
    y: 320 / 2,
    width: 5,
    xdirection: 1,
    ydirection: 1,
    xspeed: 2.8,
    yspeed: 2.2
  },
  player1: { y: 135 },
  player2: { y: 135 },
  score1: 0,
  score2: 0,
  courtDimensions: { width: 580, height: 320 },
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
    const roomId = this.gameService.findRoomByPlayerId(playerId, game);

    if (playerId) {
      if (playerId === game.rooms[roomId]?.player1.id) {
        delete game.rooms[roomId];
        client.leave(roomId);
      } else {
        delete game.rooms[roomId]?.player2;
        client.leave(roomId);
      }
      delete game.players[client.id];
    }
    this.server.emit('game', game);
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

  @SubscribeMessage('startMatch')
  async handleStartMatch(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    const roomId = this.gameService.findRoomByPlayerId(user.id, game);

    if (game.rooms[roomId]) {
      const initialMatch: Match = { ...match, matchStatus: 'PLAYING' };
      await this.gameService.playingGame(initialMatch, updatedMatch => {
        this.server.to(game.rooms[roomId].room_id).emit('matchStarted', { match: { ...updatedMatch } });
      });
    }
  }

  @SubscribeMessage('sendKey')
  async handleSendKey(@MessageBody() padle: Padle, @ConnectedSocket() client: Socket) {
    console.log(padle);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {
    const roomId = this.gameService.findRoomByPlayerId(user.id, game);

    if (game.rooms[roomId]) {
      if (user.id === game.rooms[roomId].player1.id) {
        this.server.to(game.rooms[roomId].room_id).emit('playerLeftRoom', { message: `${game.rooms[roomId].player1.name} saiu da sala.` });
        delete game.rooms[roomId];
      } else {
        this.server.to(game.rooms[roomId].room_id).emit('playerLeftRoom', { message: `${game.rooms[roomId].player2.name} saiu da sala.` });
        delete game.rooms[roomId].player2;
      }
      client.leave(roomId);
      this.server.emit('game', game);
    } else {
      console.error(`Room not found for user ${user.id}`);
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
