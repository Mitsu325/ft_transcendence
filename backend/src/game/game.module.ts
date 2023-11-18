import { Module } from '@nestjs/common';
import { GamePong } from './game.controller';

@Module({
  providers: [GamePong],
})

export class GameModule { }