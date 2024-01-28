import {
    Body,
    Controller,
    Get,
    Request,
    Post,
    Param,
    Patch,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
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
    @ApiBody({ type: CreateChannelDto, description: 'Request body.' })
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
    @ApiBody({ type: CreateMessageDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @Post('message')
    async createMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.channelService.addMessage(createMessageDto);
    }

    @ApiOperation({ description: 'Get all messages' })
    @ApiBearerAuth('access-token')
    @ApiParam({
        name: 'roomId',
        type: 'string',
        description: 'Channel Id',
    })
    @Get('message/:roomId')
    async getAllMessages(@Request() req) {
        try {
            const channel_id = req.params.roomId;
            const messages = await this.channelService.getMessages(channel_id);
            return messages;
        } catch (error) {
            console.error(error);
            return { error: 'Error fetching messages.' };
        }
    }

    @ApiOperation({ description: 'Verify channel password' })
    @ApiBearerAuth('access-token')
    @Post('verify-password')
    async verifyPass(
        @Body() params: { roomId: string; password: string },
    ): Promise<{ success: boolean }> {
        const { roomId, password } = params;
        try {
            const isPasswordCorrect = await this.channelService.verifyPassword(
                roomId,
                password,
            );
            return { success: isPasswordCorrect };
        } catch (error) {
            console.error('Error checking channel password:', error);
        }
    }

    @ApiOperation({
        description: 'Creates a token to access the protected channel.',
    })
    @ApiBearerAuth('access-token')
    @ApiParam({
        name: 'roomId',
        type: 'string',
        description: 'Channel Id',
    })
    @Get('token/:roomId')
    async generateToken(
        @Param('roomId') roomId: string,
    ): Promise<{ token: string }> {
        try {
            const token = await this.channelService.generateToken(roomId);
            return { token };
        } catch (error) {
            console.error('Error generating token:', error);
        }
    }

    @ApiOperation({ description: 'Get owner of channelId' })
    @ApiBearerAuth('access-token')
    @ApiParam({
        name: 'channelId',
        type: 'string',
        description: 'Channel Id',
    })
    @Get(':channelId')
    async findOwner(@Param('channelId') channelId: string) {
        try {
            const owner = await this.channelService.findOwner(channelId);

            if (owner) {
                return owner.id;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error finding owner.' };
        }
    }

    @ApiOperation({ description: 'Update channel owner.' })
    @ApiBearerAuth('access-token')
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Channel Id',
    })
    @Patch('update-owner/:id')
    async updateOwner(@Param('id') id: string): Promise<any> {
        try {
            const updateOwner = await this.channelService.updateOwner(id);
            return {
                message: 'Success.',
                owner: updateOwner.owner,
            };
        } catch (error) {
            return { error: 'Error update owner.' };
        }
    }
}
