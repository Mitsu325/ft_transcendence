import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export const initialMatch: Match = {
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
  score1: 0,
  score2: 0,
  courtDimensions: { width: 580, height: 320 },
};

export interface Player {
  id: string;
  name: string;
  avatar: null | string;
}

export interface Room {
  room_id: string;
  player1: Player;
  player2: Player;
  match: Match;
}

export interface Game {
  players: { [key: string]: Player };
  rooms: { [key: string]: Room };
}

export interface Match {
  matchStatus: string;
  ball: {
    x: number;
    y: number;
    width: number;
    xdirection: number;
    ydirection: number;
    xspeed: number;
    yspeed: number
  };
  score1: number;
  score2: number;
  courtDimensions: { width: number; height: number };
}

export interface MatchPadle {
  player1: { y: number, playerSpeed: number };
  player2: { y: number, playerSpeed: number }
}

export interface Padle {
  type: string;
  key: string;
  player: string;
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

  async playingGame(match: Match, matchPadle: MatchPadle, updateCallback: (updatedMatch: Match) => void): Promise<void> {

    const playGame = async () => {

      const xpos = match.ball.x + match.ball.xspeed * match.ball.xdirection;
      const ypos = match.ball.y + match.ball.yspeed * match.ball.ydirection;

      match.ball.x = xpos;
      match.ball.y = ypos;

      const updatedMatchWithColision = await this.handleColision(match, matchPadle);

      if (xpos > match.courtDimensions.width - match.ball.width || xpos < match.ball.width) {
        match.ball.xdirection *= -1;
      }

      if (ypos > match.courtDimensions.height - match.ball.width || ypos < match.ball.width) {
        match.ball.ydirection *= -1;
      }

      if (xpos < match.ball.width) {
        match.score2++;
        match.ball.x = match.courtDimensions.width / 2;
        match.ball.y = match.courtDimensions.height / 2;
      }

      if (xpos > match.courtDimensions.width - match.ball.width) {
        match.score1++;
        match.ball.x = match.courtDimensions.width / 2;
        match.ball.y = match.courtDimensions.height / 2;
      }

      updateCallback(updatedMatchWithColision);

      if (match.matchStatus === 'PLAYING') {
        updateCallback({ ...match });
        await new Promise(resolve => setTimeout(resolve, 1000 / 60));
        await playGame();
      }
    };
    await playGame();
  }

  async movePadle(padle: Padle, matchPadle: MatchPadle, player: string, matchStatus: Match): Promise<MatchPadle> {
    const updatedPadle: MatchPadle = { ...matchPadle };

    if (padle.key === 'ArrowUp') {
      if (player === '1') {
        updatedPadle.player1.y -= 5 * matchPadle.player1.playerSpeed;
      } else {
        updatedPadle.player2.y -= 5 * matchPadle.player1.playerSpeed;
      }
    } else if (padle.key === 'ArrowDown') {
      if (player === '1') {
        updatedPadle.player1.y += 5 * matchPadle.player1.playerSpeed;
      } else {
        updatedPadle.player2.y += 5 * matchPadle.player1.playerSpeed;
      }
    }

    if (player === '1' && updatedPadle.player1.y < 5) updatedPadle.player1.y = 2;
    if (player === '2' && updatedPadle.player2.y < 5) updatedPadle.player2.y = 2;
    if (player === '1' && updatedPadle.player1.y > matchStatus.courtDimensions.height - 50) updatedPadle.player1.y = matchStatus.courtDimensions.height - 50;
    if (player === '2' && updatedPadle.player2.y > matchStatus.courtDimensions.height - 50) updatedPadle.player2.y = matchStatus.courtDimensions.height - 50;

    return updatedPadle;
  }

  async handleColision(match: Match, matchPadle: MatchPadle): Promise<Match> {
    const updatedMatch: Match = { ...match };

    if (updatedMatch.ball.x < 15) {
      if (updatedMatch.ball.y > matchPadle.player1.y - 5 && updatedMatch.ball.y < matchPadle.player1.y + 55) {
        updatedMatch.ball.xdirection *= -1;
      }
    }

    if (updatedMatch.ball.x > updatedMatch.courtDimensions.width - 15) {
      if (updatedMatch.ball.y > matchPadle.player2.y - 5 && updatedMatch.ball.y < matchPadle.player2.y + 55) {
        updatedMatch.ball.xdirection *= -1;
      }
    }
    return updatedMatch;
  }

  removeRoomAndNotify(roomId: string, player: string, game: Game, server: Server): void {
    if (game.rooms[roomId]) {
      const room = game.rooms[roomId];
      game.rooms[roomId].match = initialMatch;
      if (player === room.player1.id) {
        server.to(room.room_id).emit('playerLeftRoom', { message: `${room.player1.name} saiu da sala.` });
      } else if (room.player2 && player === room.player2.id) {
        server.to(room.room_id).emit('playerLeftRoom', { message: `${room.player2.name} saiu da sala.` });
      }
      delete game.rooms[roomId];
    }
  }
}
