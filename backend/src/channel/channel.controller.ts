import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @ApiOperation({ description: 'Get all channels' })
    @Get()
    findAll(): Promise<ChannelDto[]> {
        return this.channelService.findAll();
    }

    @ApiOperation({ description: 'Create a new channel' })
    @Post()
    async create(@Body() createChannelDto: CreateChannelDto) {
        return this.channelService.create(createChannelDto);
    }
}
