import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
    ApiOperation,
    ApiTags,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { BlockedDto } from './dto/blocked.dto';
import { ChangeBlockedDto } from './dto/change-blocked.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({ description: 'Get all messages' })
    @ApiBearerAuth('access-token')
    @Get('messages')
    async findAllMessages() {
        return await this.chatService.findAllMessages();
    }

    @ApiOperation({
        description: 'Get all messages that I chatted with a person',
    })
    @ApiParam({
        name: 'chattingUserId',
        type: 'string',
        description: 'ID who you are talking to',
    })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiBearerAuth('access-token')
    @Get('messages/:chattingUserId')
    async findMessagesFromChattingUser(
        @Param() params: any,
        @Pagination() pagination: PaginationOptions,
        @Request() req,
    ) {
        return await this.chatService.findMessagesFromChattingUser(
            params.chattingUserId,
            req.user.sub,
            pagination,
        );
    }

    @ApiOperation({ description: 'Get all recipients' })
    @ApiBearerAuth('access-token')
    @Get('recipients')
    async findAllInteractedUsers(@Request() req) {
        return await this.chatService.findAllInteractedUsers(req.user.sub);
    }

    @ApiOperation({ description: 'Send message' })
    @ApiBody({ type: SendMessageDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @Post('send-message')
    async sendMessage(@Body() sendMessageDto: SendMessageDto, @Request() req) {
        return await this.chatService.saveMessage(sendMessageDto, req.user.sub);
    }

    @ApiOperation({ description: 'Get all blocked users' })
    @ApiBearerAuth('access-token')
    @Get('blocked-users')
    async findAllBlockedUsers(@Request() req) {
        return await this.chatService.findAllBlockedUsers(req.user.sub);
    }

    @ApiOperation({ description: 'Block a user' })
    @ApiBody({ type: BlockedDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @Post('block-user')
    async blockUser(@Body() blockedDto: BlockedDto, @Request() req) {
        return await this.chatService.blockUser(blockedDto, req.user.sub);
    }

    @ApiOperation({ description: 'Update blocked a user' })
    @ApiBody({ type: ChangeBlockedDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @Patch('block-user')
    async updateBlockUser(
        @Body() changeBlockedDto: ChangeBlockedDto,
        @Request() req,
    ) {
        return await this.chatService.updateBlockUser(
            changeBlockedDto,
            req.user.sub,
        );
    }
}
