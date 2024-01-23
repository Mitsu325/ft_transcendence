import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ChannelAdminService } from './channel-admin.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('channel-admin')
export class ChannelAdminController {
    constructor(private readonly channelAdminService: ChannelAdminService) {}

    @ApiOperation({ description: 'Get all channel admins' })
    @ApiBearerAuth('access-token')
    @Get(':channel_id')
    findAll(@Param() params: any) {
        return this.channelAdminService.findAll(params.channel_id);
    }

    @Post('add')
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.channelAdminService.create(createAdminDto);
    }
}
