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
}
