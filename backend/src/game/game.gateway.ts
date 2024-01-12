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
import { GameService, BallMoverService, PadlesMoverService, ScoresService, Player, Room, Game, MatchPadle, FinalMatch } from './game.service';

interface Padle {
  type: string;
  key: string;
  player: string;
  room: string;
}

const game: Game = {
  players: {},
  rooms: {},
};

const initialPadles: MatchPadle = {
  player1: { y: 135, playerSpeed: 1.5 },
  player2: { y: 135, playerSpeed: 1.5 },
};

const initialScores = { score1: 0, score2: 0 };

const initialBall = {
  x: 580 / 2,
  y: 320 / 2,
  width: 5,
  xdirection: 1,
  ydirection: 1,
  xspeed: 2.8,
  yspeed: 2.2
};

let matchStatus: FinalMatch;

@ApiTags('pong')
@Controller('pong')
@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class GamePong implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) { }

  handleConnection(client: Socket, ...args: any[]) { }

  handleDisconnect(client: Socket) {
    const playerId = game.players[client.id]?.id;
    const roomId = this.gameService.findRoomByPlayerId(playerId, game);

    if (roomId) {
      this.gameService.removeRoomAndNotify(roomId, playerId, game, this.server);
      client.leave(roomId);
    }
    if (playerId) {
      delete game.players[client.id];
    }
    this.server.emit('game', game);
  }

  @SubscribeMessage('CreateRoom')
  handleCreateRoom(@MessageBody() user: Player, @ConnectedSocket() client: Socket) {

    if (!game.rooms[client.id]) {
      client.join(client.id);
      game.rooms[client.id] = {
        room_id: client.id,
        player1: { ...user },
        player2: null,
        padles: initialPadles,
        padlesService: null,
        scores: initialScores,
        scoresService: null,
        ball: initialBall,
        ballService: null,
        isRunning: false,
        level: 1,
      };
      this.server.emit('game', game);
      this.server.emit('cleanRoom', game.rooms[client.id]);
    }
  }

  @SubscribeMessage('GetInRoom')
  handleGetInRoom(@MessageBody() room: Room, @ConnectedSocket() client: Socket) {
    const playerAlreadyInRoom = Object.values(game.rooms).find(existingRoom => existingRoom.player1.id === room.player2.id || (existingRoom.player2 && existingRoom.player2.id === room.player2.id));

    if (!playerAlreadyInRoom && game.rooms[room.room_id].player2 === null) {
      client.join(room.room_id);
      game.rooms[room.room_id].player2 = { ...room.player2 };
      this.server.emit('game', game);
      this.server.to(room.room_id).emit('players', game.rooms[room.room_id].player1, game.rooms[room.room_id].player2);
      game.rooms[room.room_id].isRunning = true;
    } else {
      console.log('The Player is already in the room:', client.id);
    }
  }

  @SubscribeMessage('startMatch')
  async handleStartMatch(@MessageBody() room: string, @ConnectedSocket() client: Socket) {

    let loopGame: NodeJS.Timeout;

    if (!game.rooms[room]) {
      console.log('The room does not exist:', room);
    }

    if (game.rooms[room]) {
      game.rooms[room].isRunning = true;
      game.rooms[room].ballService = new BallMoverService();
      game.rooms[room].scoresService = new ScoresService();
      const initD = Date.now() / 2 === 0 ? 1 : -1;
      game.rooms[room].ball = { ...initialBall, xdirection: initD, ydirection: initD };
      game.rooms[room].scores = initialScores;
      loopGame = setInterval(async () => {
        if (!game.rooms[room]?.isRunning) {
          clearInterval(loopGame);
          return;
        };
        try {
          await game.rooms[room].ballService.moveBall(game.rooms[room]);
          this.server.to(room).emit('matchStarted', room, game.rooms[room].ball);
          this.server.to(room).emit('matchScores', room, game.rooms[room].scores);
        }
        catch (error) { }
      }, 1000 / 60);
    } else {
      clearInterval(loopGame);
    }
  }

  @SubscribeMessage('sendKey')
  async handleSendKey(@MessageBody() padle: Padle, @ConnectedSocket() client: Socket) {
    const player = game.rooms[padle.room].player1.id === padle.player ? '1' : '2';
    const direction = padle.type === 'keyup' ? 'STOP' : 'GO';

    // if (padle.type === 'keyup') {
    //   this.gameService.latencyGame(padle.room, player, game, this.server);
    // }

    if (!game.rooms[padle.room].padlesService) {
      game.rooms[padle.room].padlesService = new PadlesMoverService();
    }

    if (game.rooms[padle.room] && direction === 'GO') {
      game.rooms[padle.room].padles = await game.rooms[padle.room].padlesService.movePadle(
        padle,
        initialPadles,
        player,
      );
      this.server.to(padle.room).emit('movePadles', padle.room, game.rooms[padle.room].padles);
    }
  }

  @SubscribeMessage('sendLevel')
  async handleSendLevel(@MessageBody() matchLevel: any, @ConnectedSocket() client: Socket) {
    if (game.rooms[matchLevel.room]) {
      game.rooms[matchLevel.room].level = matchLevel.level;
      this.server.to(matchLevel.room).emit('matchLevel', matchLevel.room, { level: matchLevel.level });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() room: { userPlayer: Player, userRoomId: string }, @ConnectedSocket() client: Socket) {
    if (game.rooms[room.userRoomId]) {
      game.rooms[room.userRoomId].isRunning = false;
      try {
        this.server.to(room.userRoomId).emit('playerLeftRoom', 'GameOver: Player left the room!');
      } catch (error) { }
      this.gameService.removeRoomAndNotify(room.userRoomId, room.userPlayer.id, game, this.server);
      client.leave(room.userRoomId);
    } else {
      console.error(`Room not found for user ${room.userPlayer.id}`);
    }
    this.server.emit('game', game);
  }

  @SubscribeMessage('playerConnected')
  handlePlayerConnected(@MessageBody() player: any, @ConnectedSocket() client: Socket) {
    const existingPlayer = game.players[client.id];
    const playerAlreadyInGame = Object.values(game.players).find(existingPlayer => existingPlayer.id === player.id);

    if (!existingPlayer && !playerAlreadyInGame) {
      game.players[client.id] = { id: player.id, name: player.username, avatar: player.avatar };
    } else {
      console.log('Player with the same ID already exists:', player.id);
    }
    this.server.emit('game', game);
  }

  @SubscribeMessage('matchSistem')
  handleMatchSistem(@MessageBody() player: Player, @ConnectedSocket() client: Socket) {

    if (Object.keys(game.rooms).length > 0) {
      for (const room in game.rooms) {
        if (game.rooms[room].player2 === null) {
          client.join(room);
          game.rooms[room].player2 = { ...player };
          this.server.emit('game', game);
          this.server.to(room).emit('players', game.rooms[room].player1, game.rooms[room].player2);
          this.server.emit('play', room);
          game.rooms[room].isRunning = true;
          break;
        }
      }
    } else {
      console.log('No rooms available');
    }
    // console.log(game.rooms);
  }
}
