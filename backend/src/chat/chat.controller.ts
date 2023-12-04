import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({ description: 'Get all messages' })
    @ApiBearerAuth('access-token')
    @Get('messages')
    findAllMessages() {
        return this.chatService.findAllMessages();
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
