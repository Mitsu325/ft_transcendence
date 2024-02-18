import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/game.entity';
import { BattleHistoric, PerformancePlayer } from './interfaces/game.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private battlesRepository: Repository<Battle>,
    private readonly userService: UserService,
  ) { }

  async getPlayersBattleDetails(userId: string): Promise<BattleHistoric[]> {
    try {
      const battles = await this.battlesRepository.find({
        where: [{ host: { id: userId } }, { guest: { id: userId } }],
        order: { updatedAt: 'DESC' },
        relations: ['host', 'guest', 'winner'],
      });

      if (!battles.length) {
        return [];
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
        const user = await this.userService.findById(userId);
        return {
          userId,
          name: user.name,
          totalBattles: 0,
          totalWins: 0,
          totalLoses: 0,
          totalDraws: 0,
          winPercent: 0,
          losePercent: 0,
          drawPercent: 0,
        };
      }

      let totalBattles: number = 0;
      let totalWins: number = 0;
      let totalLoses: number = 0;
      let totalDraws: number = 0;

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
        winPercent: !totalBattles
          ? 0
          : (totalWins / totalBattles) * 100,
        losePercent: !totalBattles
          ? 0
          : (totalLoses / totalBattles) * 100,
        drawPercent: !totalBattles
          ? 0
          : (totalDraws / totalBattles) * 100,
      };

      return playerPerformance;
    } catch (error) {
      throw error;
    }
  }
}
