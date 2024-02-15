import { Module } from '@nestjs/common';
import { GamePong } from './game.gateway';
import { GameService, PlayersService } from './game.service';
import { GameController } from './game.controller';
import { Battle } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BattlesService } from './battle.service';
import { BallMoverService } from './ball-mover.service';
import { PaddlesMoverService } from './paddles-mover.service';
import { ScoresService } from './scores.service';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([Battle])],
    controllers: [GameController],
    providers: [
        GamePong,
        GameService,
        BattlesService,
        BallMoverService,
        PaddlesMoverService,
        ScoresService,
        PlayersService,
    ],
})
export class GameModule {}
