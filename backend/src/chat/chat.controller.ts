import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
} from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';

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

    @ApiOperation({ description: 'Get all messages' })
    @ApiParam({
        name: 'chattingUserId',
        type: 'string',
        description: 'ID who you are talking to',
    })
    @ApiBearerAuth('access-token')
    @Get('messages/:chattingUserId')
    async findMessagesFromChattingUser(@Param() params: any, @Request() req) {
        return await this.chatService.findMessagesFromChattingUser(
            params.chattingUserId,
            req.user.sub,
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
}
