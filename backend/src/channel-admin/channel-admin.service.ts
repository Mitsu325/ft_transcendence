import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelAdmin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChannelAdminDto } from './dto/admin.dto';
import { Equal } from 'typeorm';

@Injectable()
export class ChannelAdminService {
    constructor(
        @InjectRepository(ChannelAdmin)
        private readonly ChannelAdminRepository: Repository<ChannelAdmin>,
    ) {}

    async create(createAdminDto: CreateAdminDto) {
        try {
            const admin = this.ChannelAdminRepository.create({
                channel: createAdminDto.channel_id,
                admin: createAdminDto.admin_id,
                active: createAdminDto.active,
            });
            if (admin) {
                this.ChannelAdminRepository.save(admin);
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async findAll(channel_id: string): Promise<ChannelAdminDto[]> {
        const admins = await this.ChannelAdminRepository.find({
            where: {
                channel: Equal(channel_id),
            },
        });

        return admins.map(admin => ({
            id: admin.id,
            channel_id: admin.channel.name_channel,
            admin_id: admin.admin.name,
            active: admin.active,
        }));
    }
}
