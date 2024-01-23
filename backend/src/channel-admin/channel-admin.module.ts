import { Module } from '@nestjs/common';
import { ChannelAdminController } from './channel-admin.controller';
import { ChannelAdminService } from './channel-admin.service';
import { ChannelAdmin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ChannelAdmin])],
    controllers: [ChannelAdminController],
    providers: [ChannelAdminService],
})
export class ChannelAdminModule {}
