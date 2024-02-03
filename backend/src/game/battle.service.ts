import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/game.entity';
import { BattleHistoric, PerformancePlayer } from './interfaces/game.interface';

@Injectable()
export class BattlesService {
    constructor(
        @InjectRepository(Battle)
        private battlesRepository: Repository<Battle>,
    ) {}

    async getPlayersBattleDetails(userId: string): Promise<BattleHistoric[]> {
        try {
            const battles = await this.battlesRepository.find({
                where: [{ host: { id: userId } }, { guest: { id: userId } }],
                order: { updatedAt: 'DESC' },
                relations: ['host', 'guest', 'winner'],
            });

            if (!battles.length) {
                return null;
            }

            return battles.map(battle => ({
                id: battle.id,
                status: battle.status,
                winnerName: battle?.winner?.name,
                hostName: battle.host?.name,
                hostId: battle.host?.id,
                guestName: battle.guest?.name,
                guestId: battle.guest?.id,
                scoreWinner: battle.winnerScore,
                scoreLoser: battle.loserScore,
                createdAt: battle.createdAt,
            }));
        } catch (error) {
            throw error;
        }
    }

    async getPerformancePlayers(userId: string): Promise<PerformancePlayer> {
        try {
            const battles = await this.battlesRepository.find({
                where: [{ host: { id: userId } }, { guest: { id: userId } }],
                order: { updatedAt: 'DESC' },
                relations: ['host', 'guest', 'winner'],
            });

            if (!battles.length) {
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
                totalBattles: totalBattles,
                totalWins: totalWins,
                totalLoses: totalLoses,
                totalDraws: totalDraws,
            };

            return playerPerformance;
        } catch (error) {
            throw error;
        }
    }
}
