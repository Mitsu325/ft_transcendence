import { Module } from '@nestjs/common';
import { GamePong } from './game.gateway';
import { GameService } from './game.service';
import { Battle } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Battle])],
  providers: [GamePong, GameService],
})

export class GameModule { }
