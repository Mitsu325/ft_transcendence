import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ChannelAdminService } from './channel-admin.service';
import {
    ApiOperation,
    ApiBearerAuth,
    ApiTags,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RemoveAdminDto } from './dto/remove-admin.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';

@ApiTags('channel-admin')
@Controller('channel-admin')
export class ChannelAdminController {
    constructor(private readonly channelAdminService: ChannelAdminService) {}

    @ApiOperation({ description: 'Get all channel admins' })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiBearerAuth('access-token')
    @Get(':channel_id')
    findAll(@Pagination() pagination: PaginationOptions, @Param() params: any) {
        return this.channelAdminService.findAll(params.channel_id, pagination);
    }

    @ApiOperation({ description: 'Add a new Admin' })
    @ApiBearerAuth('access-token')
    @ApiBody({ type: CreateAdminDto, description: 'Request body.' })
    @HttpCode(HttpStatus.CREATED)
    @Post('add')
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.channelAdminService.create(createAdminDto);
    }

    @ApiOperation({ description: 'Remove an Admin' })
    @ApiBearerAuth('access-token')
    @ApiBody({ type: RemoveAdminDto, description: 'Request body.' })
    @Patch('removeAdmin')
    async removeAdmin(@Body() removeAdminDto: RemoveAdminDto) {
        return this.channelAdminService.removeAdmin(removeAdminDto);
    }

    @ApiOperation({ description: 'Get admins of channelId' })
    @ApiBearerAuth('access-token')
    @ApiParam({
        name: 'channelId',
        type: 'string',
        description: 'Channel ID',
    })
    @Get('all/:channelId')
    async getAdmins(@Param('channelId') channelId: string) {
        try {
            const admins = await this.channelAdminService.findAdmins(channelId);
            if (admins) {
                return { admins };
            } else {
                return { error: 'Channel not found or has no admins.' };
            }
        } catch (error) {
            console.error(error);
            return { error: 'Error getting admins.' };
        }
    }
}
