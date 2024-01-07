import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

export interface Player {
  id: string;
  name: string;
  avatar: null | string;
}

export interface Players {
  player1: string;
  player2: string;
}

export interface Room {
  room_id: string;
  player1: Player;
  player2: Player;
  padles: MatchPadle;
  padlesService: PadlesMoverService;
  scores: MatchScore;
  scoresService: ScoresService;
  ball: Ball;
  ballService: BallMoverService;
  loopGame: NodeJS.Timeout;
}

export interface Game {
  players: { [key: string]: Player };
  rooms: { [key: string]: Room };
}

export interface FinalMatch {
  player1: string;
  score1: number;
  player2: string;
  score2: number;
}

export interface MatchPadle {
  player1: { y: number, playerSpeed: number };
  player2: { y: number, playerSpeed: number }
}

export interface MatchScore {
  score1: number;
  score2: number;
}

export interface Padle {
  type: string;
  key: string;
  player: string;
}

export interface Ball {
  x: number;
  y: number;
  width: number;
  xdirection: number;
  ydirection: number;
  xspeed: number;
  yspeed: number
};

const courtDimensions = { width: 580, height: 320 };

@Injectable()
export class BallMoverService {
  async moveBall(room: Room): Promise<void> {
    const xpos = room.ball.x + room.ball.xspeed * room.ball.xdirection;
    const ypos = room.ball.y + room.ball.yspeed * room.ball.ydirection;

    room.ball.x = xpos;
    room.ball.y = ypos;

    if (xpos < 15 || xpos > courtDimensions.width - 15) {
      room.scores = await room.scoresService.handleScores(room);
    }

    if (room.ball.x < 15) {
      if (room.ball.y > room.padles.player1.y - 5 && room.ball.y < room.padles.player1.y + 55) {
        room.ball.xdirection *= -1;
      }
    }

    if (room.ball.x > courtDimensions.width - 15) {
      if (room.ball.y > room.padles.player2.y - 5 && room.ball.y < room.padles.player2.y + 55) {
        room.ball.xdirection *= -1;
      }
    }

    if (xpos > courtDimensions.width - room.ball.width || xpos < room.ball.width) {
      room.ball.xdirection *= -1;
    }

    if (ypos > courtDimensions.height - room.ball.width || ypos < room.ball.width) {
      room.ball.ydirection *= -1;
    }
    return void 0;
  }
}

@Injectable()
export class PadlesMoverService {
  async movePadle(padle: Padle, matchPadles: MatchPadle, player: string): Promise<MatchPadle> {
    const updatedPadles: MatchPadle = { ...matchPadles };

    if (padle.key === 'ArrowUp') {
      if (player === '1') {
        updatedPadles.player1.y -= 5 * matchPadles.player1.playerSpeed;
      } else {
        updatedPadles.player2.y -= 5 * matchPadles.player1.playerSpeed;
      }
    } else if (padle.key === 'ArrowDown') {
      if (player === '1') {
        updatedPadles.player1.y += 5 * matchPadles.player1.playerSpeed;
      } else {
        updatedPadles.player2.y += 5 * matchPadles.player1.playerSpeed;
      }
    }

    if (player === '1' && updatedPadles.player1.y < 5) updatedPadles.player1.y = 2;
    if (player === '2' && updatedPadles.player2.y < 5) updatedPadles.player2.y = 2;
    if (player === '1' && updatedPadles.player1.y > courtDimensions.height - 50) updatedPadles.player1.y = courtDimensions.height - 50;
    if (player === '2' && updatedPadles.player2.y > courtDimensions.height - 50) updatedPadles.player2.y = courtDimensions.height - 50;

    return updatedPadles;
  }
}

@Injectable()
export class ScoresService {
  async handleScores(room: Room): Promise<MatchScore> {
    const updatedScores: MatchScore = { ...room.scores };

    if (room.ball.x < room.ball.width) {
      updatedScores.score2++;
      room.ball.x = courtDimensions.width / 2;
      room.ball.y = courtDimensions.height / 2;
    }

    if (room.ball.x > courtDimensions.width - room.ball.width) {
      updatedScores.score1++;
      room.ball.x = courtDimensions.width / 2;
      room.ball.y = courtDimensions.height / 2;
    }
    return updatedScores;
  }
}

@Injectable()
export class GameService {
  findRoomByPlayerId(playerId: string, game: Game): string | null {
    for (const roomId in game.rooms) {
      const room = game.rooms[roomId];

      if (room.player1.id === playerId || (room.player2 && room.player2.id === playerId)) {
        return roomId;
      }
    }
    return null;
  }

  async latencyGame(roomId: string, player: string, game: Game, server: Server): Promise<void> {

    const room = game.rooms[roomId];
    const startTime = new Date().getTime();

    const getLatency = async () => {
      // server.to(room.room_id).emit('ping');

      const currentTime = new Date().getTime();
      const latency = currentTime - startTime;
      server.to(room.room_id).emit('ping', latency);

      console.log(latency, '-->', player);

      await new Promise(resolve => setTimeout(resolve, 5000));
      await getLatency();
    };
    await getLatency();
  }

  removeRoomAndNotify(roomId: string, player: string, game: Game, server: Server): void {
    if (game.rooms[roomId]) {
      const room = game.rooms[roomId];
      if (player === room.player1.id) {
        server.to(room.room_id).emit('playerLeftRoom', { message: `${room.player1.name} saiu da sala.` });
      } else if (room.player2 && player === room.player2.id) {
        server.to(room.room_id).emit('playerLeftRoom', { message: `${room.player2.name} saiu da sala.` });
      }
      delete game.rooms[roomId];
    }
  }
}
