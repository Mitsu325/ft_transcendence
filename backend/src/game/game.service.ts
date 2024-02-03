import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBattleDto } from './dto/game.dto';
import { Battle } from './entities/game.entity';
import { Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Battle)
        private battlesRepository: Repository<Battle>,
        private readonly userService: UserService,
    ) {}

    async saveBattle(createBattleDto: CreateBattleDto) {
        try {
            const { host, guest, winner, ...params } = createBattleDto;
            const hostUser = await this.userService.findById(host);
            const guestUser = await this.userService.findById(guest);
            const winnerUser = await this.userService.findById(winner);
            const battle = this.battlesRepository.create({
                host: hostUser,
                guest: guestUser,
                winner: winnerUser,
                ...params,
            });
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
