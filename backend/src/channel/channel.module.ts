import { Module, forwardRef } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Messages } from './entities/message.entity';
import { PrivateChannelUsers } from './entities/privateChannel.entity';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelAdminModule } from 'src/channel-admin/channel-admin.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        UserModule,
        forwardRef(() => ChannelAdminModule),
        TypeOrmModule.forFeature([Channel, Messages, PrivateChannelUsers]),
    ],
    providers: [ChannelService, ChannelGateway],
    controllers: [ChannelController],
    exports: [ChannelService],
})
export class ChannelModule {}
