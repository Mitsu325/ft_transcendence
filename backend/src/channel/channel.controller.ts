import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { hashPassword } from 'src/utils/hash.util';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @ApiOperation({ description: 'Get all channels' })
    @ApiBearerAuth('access-token')
    @Get()
    findAll(): Promise<ChannelDto[]> {
        return this.channelService.findAll();
    }

    @ApiOperation({ description: 'Create a new channel' })
    @ApiBearerAuth('access-token')
    @Post()
    async create(@Body() createChannelDto: CreateChannelDto) {
        try {
            if (createChannelDto.password) {
                const hashPass = await hashPassword(createChannelDto.password);
                createChannelDto.password = hashPass;
            }

            const channel = this.channelService.create(createChannelDto);
            if (channel) {
                return {
                    success: true,
                    message: 'Channel created successfully',
                };
            } else {
                return { success: false, message: 'Failed to create channel' };
            }
        } catch (error) {
            return { success: false, error: error };
        }
    }
}
