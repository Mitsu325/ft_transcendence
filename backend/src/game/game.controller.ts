import { Controller, Get, Param } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { BattlesService } from './battle.service';

@ApiTags('battles')
@Controller('battles')
export class GameController {
    constructor(private readonly battlesService: BattlesService) {}

    @ApiOperation({ description: 'Historic Battles' })
    @ApiParam({
        name: 'userId',
        type: 'string',
        description: 'ID whose history I want to see',
    })
    @ApiBearerAuth('access-token')
    @Get('historic_battles/:userId')
    async playerHistoric(@Param() params: any) {
        return await this.battlesService.getPlayersBattleDetails(params.userId);
    }

    @ApiOperation({ description: 'Performance Player' })
    @ApiParam({
        name: 'userId',
        type: 'string',
        description: 'ID whose history I want to see',
    })
    @ApiBearerAuth('access-token')
    @Get('performance_player/:userId')
    async playerStats(@Param() params: any) {
        return await this.battlesService.getPerformancePlayers(params.userId);
    }
}
