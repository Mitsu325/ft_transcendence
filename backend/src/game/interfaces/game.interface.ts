import { BallMoverService } from '../ball-mover.service';
import { PaddlesMoverService } from '../paddles-mover.service';
import { ScoresService } from '../scores.service';

export interface CreateRoom {
    user: Player;
    guestId?: string;
}

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

export interface Room {
    room_id: string;
    player1: Player;
    player2: Player;
    paddles: MatchPaddle;
    paddlesService: PaddlesMoverService;
    scores: MatchScore;
    scoresService: ScoresService;
    ball: Ball;
    ballService: BallMoverService;
    isRunning: boolean;
    level: number;
    guestId?: string;
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

export interface MatchPaddle {
    player1: { y: number; playerSpeed: number };
    player2: { y: number; playerSpeed: number };
}

export interface MatchScore {
    score1: number;
    score2: number;
}

export interface Paddle {
    type: string;
    key: string;
    player: string;
    room?: string;
}

export interface Ball {
    x: number;
    y: number;
    width: number;
    xDirection: number;
    yDirection: number;
    xSpeed: number;
    ySpeed: number;
}

export interface PerformancePlayer {
    userId: string;
    name: string;
    totalBattles: number;
    totalWins: number;
    totalLoses: number;
    totalDraws: number;
}

export interface BattleHistoric {
    id: string;
    status: string;
    winnerName: string | null;
    hostName: string;
    hostId: string;
    guestName: string;
    guestId: string;
    scoreWinner: number;
    scoreLoser: number;
    createdAt: Date;
}
