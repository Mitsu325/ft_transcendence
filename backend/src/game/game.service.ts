import { Injectable } from '@nestjs/common';

export interface Player {
  id: string;
  name: string;
  avatar: null | string;
}

export interface Room {
  room_id: string;
  player1: Player;
  player2: Player;
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
  player1: { x: number; y: number };
  player2: { x: number; y: number }
  score1: number;
  score2: number;
  courtDimensions: { width: number; height: number };
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

  async playingGame(match: Match, updateCallback: (updatedMatch: Match) => void): Promise<void> {

    const playGame = async () => {
      const xpos = match.ball.x + match.ball.xspeed * match.ball.xdirection;
      const ypos = match.ball.y + match.ball.yspeed * match.ball.ydirection;

      match.ball.x = xpos;
      match.ball.y = ypos;

      if (xpos > match.courtDimensions.width - match.ball.width || xpos < match.ball.width) {
        match.ball.xdirection *= -1;
      }

      if (ypos > match.courtDimensions.height - match.ball.width || ypos < match.ball.width) {
        match.ball.ydirection *= -1;
      }

      if (xpos < match.ball.width) {
        match.score2++;
      }

      if (xpos > match.courtDimensions.width - match.ball.width) {
        match.score1++;
      }

      if (match.matchStatus === 'PLAYING') {
        updateCallback({ ...match });
        await new Promise(resolve => setTimeout(resolve, 10000 / 60));
        await playGame();
      }
    };

    await playGame();
  }
}
