import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BattlesService } from './game.service';
import { CreateBattleDto } from './dto/game.dto';
import { Public } from 'src/common/constants';

class PlayerHistoricRequest {
  userId: string;
}

@ApiTags('battles')
@Controller('battles')
export class GameController {
  constructor(private readonly battlesService: BattlesService) { }

  @Get('/count_hosts/:playerId')
  async countHostsByPlayer(@Param('playerId') playerId: string): Promise<number> {
    return this.battlesService.countHostsByPlayer(playerId);
  }

  @ApiOperation({ description: 'Historic Battles' })
  @ApiBody({ type: PlayerHistoricRequest, description: 'Request body.' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('historic_battles')
  async playerHistoric(@Body() body: PlayerHistoricRequest) {
    const { userId } = body;
    return await this.battlesService.getUserBattleDetails(userId);
  }
}
