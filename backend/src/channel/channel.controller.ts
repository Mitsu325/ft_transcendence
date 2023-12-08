import { Body, Controller, Get, Request, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { hashPassword } from 'src/utils/hash.util';
import { CreateMessageDto } from './dto/create-message.dto';

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

    @ApiOperation({ description: 'Create a new message' })
    @ApiBearerAuth('access-token')
    @Post('message')
    async createMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.channelService.addMessage(createMessageDto);
    }

    @ApiOperation({ description: 'Get all messages' })
    @ApiBearerAuth('access-token')
    @Get('message/:roomId')
    async getAllMessages(@Request() req) {
        try {
            const channel_id = req.params.roomId;
            console.log('canal', channel_id);
            const messages = await this.channelService.getMessages(channel_id);
            return messages;
        } catch (error) {
            console.error(error);
            return { error: 'Erro ao buscar mensagens.' };
        }
    }
}
