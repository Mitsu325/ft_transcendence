import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { InviteDto } from './dto/invite.dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { UpdateInviteDto } from './dto/updateInvite.dto';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @ApiOperation({ description: 'Get all friends of the logged in user' })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiBearerAuth('access-token')
    @Get()
    async findFriends(
        @Pagination() pagination: PaginationOptions,
        @Request() req,
    ) {
        return await this.friendService.findFriends(req.user.sub, pagination);
    }

    @ApiOperation({ description: 'Get all invitations received' })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiBearerAuth('access-token')
    @Get('invite-received')
    async inviteReceived(
        @Pagination() pagination: PaginationOptions,
        @Request() req,
    ) {
        return await this.friendService.findInviteReceived(
            req.user.sub,
            pagination,
        );
    }

    @ApiOperation({ description: 'Get all invitations sent' })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiBearerAuth('access-token')
    @Get('invite-sent')
    async inviteSent(
        @Pagination() pagination: PaginationOptions,
        @Request() req,
    ) {
        return await this.friendService.findInviteSent(
            req.user.sub,
            pagination,
        );
    }

    @ApiOperation({ description: 'Invite to be friends' })
    @ApiBody({ type: InviteDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @Post('invite')
    async invite(@Body() inviteDto: InviteDto, @Request() req) {
        return await this.friendService.invite(inviteDto, req.user.sub);
    }

    @ApiOperation({ description: 'Update invite status' })
    @ApiBody({ type: UpdateInviteDto, description: 'Request body.' })
    @ApiBearerAuth('access-token')
    @Patch('invite-status')
    async updateInviteStatus(
        @Body() updateInviteDto: UpdateInviteDto,
        @Request() req,
    ) {
        return await this.friendService.updateInviteStatus(
            updateInviteDto,
            req.user.sub,
        );
    }

    @ApiOperation({ description: 'Delete invite' })
    @ApiParam({
        name: 'inviteId',
        type: 'string',
        description: 'Invite ID',
    })
    @ApiBearerAuth('access-token')
    @Delete(':inviteId')
    async remove(@Param('inviteId') inviteId: string) {
        return await this.friendService.deleteInvite(inviteId);
    }
}
