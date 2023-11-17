import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
    providers: [ChannelService],
    controllers: [ChannelController],
})
export class ChannelModule {}
