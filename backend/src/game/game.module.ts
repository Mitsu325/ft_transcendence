import { Module } from '@nestjs/common';
import { GamePong } from './game.gateway';
import { GameService, BattlesService } from './game.service';
import { GameController } from './game.controller';
import { Battle } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Battle])],
  controllers: [GameController],
  providers: [GamePong, GameService, BattlesService],
})

export class GameModule { }
