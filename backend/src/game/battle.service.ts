import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/game.entity';
import { PerformancePlayer } from './interfaces/game.interface';

@Injectable()
export class BattlesService {
    constructor(
        @InjectRepository(Battle)
        private battlesRepository: Repository<Battle>,
    ) {}

    async getPlayersBattleDetails(userId: string): Promise<any> {
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
                battle_id: battle.id,
                battle_status: battle.status,
                battle_winner: battle.winner ? battle.winner.name : null,
                battle_host: battle.host.name,
                battle_host_id: battle.host.id,
                battle_guest: battle.guest.name,
                battle_guest_id: battle.guest.id,
                battle_score_winner: battle.winner_score,
                battle_score_loser: battle.loser_score,
                battle_created_date: battle.createdAt,
            }));
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
