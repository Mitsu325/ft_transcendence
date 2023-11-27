import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
    providers: [ChannelService, ChannelGateway],
    controllers: [ChannelController],
})
export class ChannelModule {}
