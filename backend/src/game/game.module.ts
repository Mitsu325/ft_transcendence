import { Module } from '@nestjs/common';
import { GamePong } from './game.gateway';
import { GameService } from './game.service';

@Module({
    providers: [GamePong, GameService],
})
export class GameModule {}
