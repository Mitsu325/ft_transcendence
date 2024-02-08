import { Module, forwardRef } from '@nestjs/common';
import { ChannelAdminController } from './channel-admin.controller';
import { ChannelAdminService } from './channel-admin.service';
import { ChannelAdmin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAction } from './entities/admin-action.entity';
import { UserModule } from 'src/user/user.module';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
    imports: [
        forwardRef(() => ChannelModule),
        UserModule,
        TypeOrmModule.forFeature([ChannelAdmin, AdminAction]),
    ],
    controllers: [ChannelAdminController],
    providers: [ChannelAdminService],
    exports: [ChannelAdminService],
})
export class ChannelAdminModule {}
