export interface Player {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export interface Players {
  player1: string;
  player2: string;
}

export interface RoomGame {
  room_id: string;
  player1: Player;
  player2: Player | null;
}

export interface GameData {
  players: Player[];
  rooms: RoomGame[];
  status: string;
  match: boolean;
  connected: boolean;
  message: string;
}

export interface Match {
  matchStatus: string;
  ball: {
    x: number;
    y: number;
    width: number;
  };
  score1: number;
  score2: number;
  courtDimensions: { width: number; height: number };
}

export interface Ball {
  x: number;
  y: number;
  width: number;
  xdirection: number;
  ydirection: number;
  xspeed: number;
  yspeed: number;
}

export interface MatchPadles {
  player1: { y: number; playerSpeed: number };
  player2: { y: number; playerSpeed: number };
}

export interface MatchScores {
  score1: number;
  score2: number;
}

export interface MatchLevel {
  level: number;
}

export const initialBall: Ball = {
  x: 580 / 2,
  y: 320 / 2,
  width: 5,
  xdirection: 1,
  ydirection: 1,
  xspeed: 2.8,
  yspeed: 2.2,
};

export const initialPadles: MatchPadles = {
  player1: { y: 135, playerSpeed: 1.5 },
  player2: { y: 135, playerSpeed: 1.5 },
};

export const initialScores: MatchScores = {
  score1: 0,
  score2: 0,
};
