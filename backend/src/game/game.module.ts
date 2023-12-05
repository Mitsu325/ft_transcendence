import { Module } from '@nestjs/common';
import { GamePong } from './game.controller';
import { GameService } from './game.service';

@Module({
  providers: [GamePong, GameService],
})

export class GameModule { }
