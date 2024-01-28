import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBattleDto } from './dto/game.dto';
import { Battle } from './entities/game.entity';
import { Server } from 'socket.io';

export interface Player {
    id: string;
    name: string;
    username: string;
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
    isRunning: boolean;
    level: number;
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
    player1: { y: number; playerSpeed: number };
    player2: { y: number; playerSpeed: number };
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
    yspeed: number;
}

interface Battle_ {
    id: number;
    winner: User;
    host: User;
    guest: User;
    winner_score: number;
    loser_score: number;
    status: string;
    created_at: Date;
    updated_at: Date;
}

interface User {
    id: string;
    name: string;
}

export interface PerformancePlayer {
    userId: string;
    name: string;
    total_battles: number;
    total_wins: number;
    total_loses: number;
    total_draws: number;
}

const courtDimensions = { width: 580, height: 320 };

@Injectable()
export class BattlesService {
    constructor(
        @InjectRepository(Battle)
        private battlesRepository: Repository<Battle_>,
    ) {}

    async mapBattles(battles: Battle_[]) {
        return battles.map(battle => {
            return {
                battle_id: battle.id,
                battle_status: battle.status,
                battle_winner: battle.winner ? battle.winner.name : null,
                battle_host: battle.host,
                battle_guest: battle.guest,
                battle_score_winner: battle.winner_score,
                battle_score_loser: battle.loser_score,
                battle_created_date: battle.created_at,
                battle_updated_date: battle.updated_at,
            };
        });
    }

    async getPlayersBattleDetails(userId: string): Promise<any> {
        try {
            const battles = await this.battlesRepository
                .createQueryBuilder('battle')
                .where(
                    'battle.host_id = :userId OR battle.guest_id = :userId',
                    { userId },
                )
                .leftJoinAndSelect('battle.host', 'host')
                .leftJoinAndSelect('battle.guest', 'guest')
                .leftJoinAndSelect('battle.winner', 'winner')
                .orderBy('battle.updated_at', 'DESC')
                .getMany();

            if (!battles || battles.length === 0) {
                return null;
            }

            const battleDetails = battles.map(battle => {
                return {
                    battle_id: battle.id,
                    battle_status: battle.status,
                    battle_winner: battle.winner ? battle.winner.name : null,
                    battle_host: battle.host.name,
                    battle_host_id: battle.host.id,
                    battle_guest: battle.guest.name,
                    battle_guest_id: battle.guest.id,
                    battle_score_winner: battle.winner_score,
                    battle_score_loser: battle.loser_score,
                    battle_created_date: battle.created_at,
                };
            });
            return battleDetails;
        } catch (error) {
            throw error;
        }
    }

    async getPerformancePlayers(userId: string): Promise<PerformancePlayer> {
        try {
            const battles = await this.battlesRepository
                .createQueryBuilder('battle')
                .where(
                    'battle.host_id = :userId OR battle.guest_id = :userId',
                    { userId },
                )
                .leftJoinAndSelect('battle.host', 'host')
                .leftJoinAndSelect('battle.guest', 'guest')
                .leftJoinAndSelect('battle.winner', 'winner')
                .orderBy('battle.updated_at', 'DESC')
                .getMany();

            if (!battles || battles.length === 0) {
                return null;
            }

            let totalBattles = 0;
            let totalWins = 0;
            let totalLoses = 0;
            let totalDraws = 0;

            battles.forEach(battle => {
                totalBattles++;
                if (battle.winner) {
                    if (battle.winner.id === userId) {
                        totalWins++;
                    } else {
                        totalLoses++;
                    }
                } else {
                    totalDraws++;
                }
            });

            const playerPerformance: PerformancePlayer = {
                userId,
                name:
                    battles[0].host.id === userId
                        ? battles[0].host.name
                        : battles[0].guest.name,
                total_battles: totalBattles,
                total_wins: totalWins,
                total_loses: totalLoses,
                total_draws: totalDraws,
            };

            return playerPerformance;
        } catch (error) {
            throw error;
        }
    }
}

@Injectable()
export class BallMoverService {
    async moveBall(room: Room): Promise<void> {
        const xpos =
            room.ball.x + room.ball.xspeed * room.ball.xdirection * room.level;
        const ypos =
            room.ball.y + room.ball.yspeed * room.ball.ydirection * room.level;

        room.ball.x = xpos;
        room.ball.y = ypos;

        if (xpos < 15 || xpos > courtDimensions.width - 15) {
            room.scores = await room.scoresService.handleScores(room);
        }

        if (room.ball.x < 15) {
            if (
                room.ball.y > room.padles.player1.y - 5 &&
                room.ball.y < room.padles.player1.y + 55
            ) {
                room.ball.xdirection *= -1;
            }
        }

        if (room.ball.x > courtDimensions.width - 15) {
            if (
                room.ball.y > room.padles.player2.y - 5 &&
                room.ball.y < room.padles.player2.y + 55
            ) {
                room.ball.xdirection *= -1;
            }
        }

        if (
            xpos > courtDimensions.width - room.ball.width ||
            xpos < room.ball.width
        ) {
            room.ball.xdirection *= -1;
        }

        if (
            ypos > courtDimensions.height - room.ball.width ||
            ypos < room.ball.width
        ) {
            room.ball.ydirection *= -1;
        }
        return void 0;
    }
}

@Injectable()
export class PadlesMoverService {
    async movePadle(
        padle: Padle,
        matchPadles: MatchPadle,
        player: string,
    ): Promise<MatchPadle> {
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

        if (player === '1' && updatedPadles.player1.y < 5)
            updatedPadles.player1.y = 2;
        if (player === '2' && updatedPadles.player2.y < 5)
            updatedPadles.player2.y = 2;
        if (
            player === '1' &&
            updatedPadles.player1.y > courtDimensions.height - 50
        )
            updatedPadles.player1.y = courtDimensions.height - 50;
        if (
            player === '2' &&
            updatedPadles.player2.y > courtDimensions.height - 50
        )
            updatedPadles.player2.y = courtDimensions.height - 50;

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
    constructor(
        @InjectRepository(Battle)
        private battlesRepository: Repository<Battle>,
    ) {}

    async saveBattle(createBattleDto: CreateBattleDto) {
        try {
            const battle = this.battlesRepository.create(createBattleDto);
            const savedBattle = await this.battlesRepository.save(battle);
            return savedBattle;
        } catch (error) {
            throw error;
        }
    }

    getDataBattle(room: string, game: Game) {
        const p1score = game.rooms[room].scores.score1;
        const p2score = game.rooms[room].scores.score2;
        let result = 'Empate';

        if (p1score > p2score) {
            result = 'Vitória do Anfitrião';
        } else if (p1score < p2score) {
            result = 'Vitória do Adversário';
        }

        const host = game.rooms[room].player1.id;
        const guest = game.rooms[room].player2.id;
        const winner_score = p1score > p2score ? p1score : p2score;
        const loser_score = p1score < p2score ? p1score : p2score;
        let winner = p1score > p2score ? host : guest;
        winner = p1score === p2score ? null : winner;
        const status = winner === null ? 'Empate' : result;
        const battle = {
            host,
            guest,
            winner_score,
            loser_score,
            winner,
            status,
        };

        return battle;
    }

    findRoomByPlayerId(playerId: string, game: Game): string | null {
        for (const roomId in game.rooms) {
            const room = game.rooms[roomId];

            if (
                room.player1.id === playerId ||
                (room.player2 && room.player2.id === playerId)
            ) {
                return roomId;
            }
        }
        return null;
    }

    async latencyGame(
        roomId: string,
        player: string,
        game: Game,
        server: Server,
    ): Promise<void> {
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

    removeRoomAndNotify(
        roomId: string,
        player: string,
        game: Game,
        server: Server,
    ): void {
        if (game.rooms[roomId]) {
            const room = game.rooms[roomId];
            if (player === room.player1.id) {
                server.to(room.room_id).emit('playerLeftRoom', {
                    message: `${room.player1.name} saiu da sala.`,
                });
            } else if (room.player2 && player === room.player2.id) {
                server.to(room.room_id).emit('playerLeftRoom', {
                    message: `${room.player2.name} saiu da sala.`,
                });
            }
            delete game.rooms[roomId];
        }
    }
}
