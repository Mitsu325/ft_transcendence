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
    @ApiBody({
        type: Object,
        description: 'Request body',
        schema: {
            properties: {
                roomId: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
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
            return owner ? owner.id : null;
        } catch (error) {
            console.error('Error finding owner:', error);
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

    @ApiOperation({ description: 'Add channel password.' })
    @ApiBearerAuth('access-token')
    @ApiBody({
        type: Object,
        description: 'Request body',
        schema: {
            properties: {
                channelId: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
    @Patch('add-password')
    async addPassword(
        @Body() params: { channelId: string; password: string },
    ): Promise<{ message: string }> {
        try {
            const hashPass = await hashPassword(params.password);

            const success = await this.channelService.addPassword(
                params.channelId,
                hashPass,
            );
            return { message: success ? 'Ok' : 'Fail' };
        } catch (error) {
            console.error('Error adding password:', error);
            return { message: 'Fail' };
        }
    }

    @ApiOperation({ description: 'Change channel password.' })
    @ApiBearerAuth('access-token')
    @Patch('change-password')
    async changePassword(
        @Body()
        params: {
            channelId: string;
            oldPassword: string;
            newPassword: string;
        },
    ): Promise<{ message: string }> {
        try {
            const rightPass = await this.channelService.verifyPassword(
                params.channelId,
                params.oldPassword,
            );

            if (!rightPass) {
                return { message: 'Incorrect password' };
            }

            const hashPass = await hashPassword(params.newPassword);
            const success = await this.channelService.changePassword(
                params.channelId,
                hashPass,
            );

            return { message: success ? 'Ok' : 'Fail' };
        } catch (error) {
            console.error('Error changing password:', error);
            return { message: 'Fail' };
        }
    }

    @ApiOperation({ description: 'Remove channel password.' })
    @ApiBearerAuth('access-token')
    @ApiBody({
        type: Object,
        description: 'Request body',
        schema: {
            properties: {
                channelId: { type: 'string' },
                oldPassword: { type: 'string' },
            },
        },
    })
    @Patch('remove-password')
    async removePassword(
        @Body() params: { channelId: string; oldPassword: string },
    ): Promise<{ message: string }> {
        try {
            const rightPass = await this.channelService.verifyPassword(
                params.channelId,
                params.oldPassword,
            );

            if (!rightPass) {
                return { message: 'Incorrect password' };
            }

            const success = await this.channelService.removePassword(
                params.channelId,
            );

            return { message: success ? 'Ok' : 'Fail' };
        } catch (error) {
            console.error('Error removing password:', error);
            return { message: 'Fail' };
        }
    }

    @ApiOperation({ description: 'Verify if userId is in private channel.' })
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
    @ApiParam({ name: 'channelId', type: 'string', description: 'Channel ID' })
    @Get('/:userId/:channelId')
    async isUserInChannel(
        @Param('userId') userId: string,
        @Param('channelId') channelId: string,
    ): Promise<{ isInChannel: boolean }> {
        const isInChannel = await this.channelService.isUserInChannel(
            userId,
            channelId,
        );
        return { isInChannel };
    }
}
