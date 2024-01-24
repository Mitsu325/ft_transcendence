import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { ChannelAdminService } from './channel-admin.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RemoveAdminDto } from './dto/remove-admin.dto';

@Controller('channel-admin')
export class ChannelAdminController {
    constructor(private readonly channelAdminService: ChannelAdminService) {}

    @ApiOperation({ description: 'Get all channel admins' })
    @ApiBearerAuth('access-token')
    @Get(':channel_id')
    findAll(@Param() params: any) {
        return this.channelAdminService.findAll(params.channel_id);
    }

    @ApiOperation({ description: 'Add a new Admin' })
    @ApiBearerAuth('access-token')
    @Post('add')
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.channelAdminService.create(createAdminDto);
    }

    @Patch('removeAdmin')
    async removeAdmin(@Param() params: RemoveAdminDto) {
        return this.channelAdminService.removeAdmin(params);
    }

    @ApiOperation({ description: 'Get admins of channelId' })
    @ApiBearerAuth('access-token')
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