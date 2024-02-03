import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/constants';
import { BattlesService } from './battle.service';
import { PerformancePlayer } from './interfaces/game.interface';

class PlayerRequest {
    userId: string;
}

@ApiTags('battles')
@Controller('battles')
export class GameController {
    constructor(private readonly battlesService: BattlesService) {}

    @ApiOperation({ description: 'Historic Battles' })
    @ApiBody({ type: PlayerRequest, description: 'Request body.' })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('historic_battles')
    async playerHistoric(@Body() body: PlayerRequest) {
        const { userId } = body;
        return await this.battlesService.getPlayersBattleDetails(userId);
    }

    @ApiOperation({ description: 'Performance Player' })
    @ApiBody({ type: PlayerRequest, description: 'Request body.' })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('performance_player')
    async playerStats(@Body() body: PerformancePlayer) {
        const { userId } = body;
        return await this.battlesService.getPerformancePlayers(userId);
    }
}
