import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelAdmin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Equal } from 'typeorm';
import { RemoveAdminDto } from './dto/remove-admin.dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { AdminRes } from './interfaces/channel-admin.interface';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';

@Injectable()
export class ChannelAdminService {
    constructor(
        @InjectRepository(ChannelAdmin)
        private readonly ChannelAdminRepository: Repository<ChannelAdmin>,
    ) {}

    async create(createAdminDto: CreateAdminDto) {
        try {
            const activeAdmin = await this.ChannelAdminRepository.findOne({
                where: {
                    channel: Equal(createAdminDto.channel_id),
                    admin: Equal(createAdminDto.admin_id),
                    active: true,
                },
            });

            if (activeAdmin) {
                return { success: false };
            }

            const existingAdmin = await this.ChannelAdminRepository.findOne({
                where: {
                    channel: Equal(createAdminDto.channel_id),
                    admin: Equal(createAdminDto.admin_id),
                    active: false,
                },
            });

            if (existingAdmin) {
                existingAdmin.active = true;
                await this.ChannelAdminRepository.save(existingAdmin);
                return { success: true };
            } else {
                const newAdmin = this.ChannelAdminRepository.create({
                    channel: createAdminDto.channel_id,
                    admin: createAdminDto.admin_id,
                    active: createAdminDto.active,
                });
                await this.ChannelAdminRepository.save(newAdmin);
                return { success: true };
            }
        } catch (error) {
            console.error(
                'Error creating or activating channel administrator:',
                error,
            );
            return { success: false };
        }
    }

    async findAll(
        channel_id: string,
        pagination: PaginationOptions,
    ): Promise<AdminRes> {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;

            const total = await this.ChannelAdminRepository.count({
                where: {
                    channel: Equal(channel_id),
                    active: true,
                },
            });

            const admins = await this.ChannelAdminRepository.find({
                where: {
                    channel: Equal(channel_id),
                    active: true,
                },
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
            });

            if (!admins.length) {
                return { data: [], pagination: { total: 0, page, limit } };
            }

            const data = admins.map(admin => ({
                id: admin.id,
                channel_id: admin.channel.name_channel,
                active: admin.active,
                admin: getNonSensitiveUserInfo(admin.admin),
            }));

            return { data, pagination: { total, page, limit } };
        } catch (error) {
            console.error('Error to find channel administrators:', error);
            throw error;
        }
    }

    async removeAdmin(
        removeAdminDto: RemoveAdminDto,
    ): Promise<{ success: boolean; message?: string }> {
        try {
            const channelAdmin = await this.ChannelAdminRepository.findOne({
                where: {
                    channel: { id: removeAdminDto.channel_id },
                    admin: { id: removeAdminDto.admin_id },
                    active: true,
                },
            });

            if (channelAdmin) {
                channelAdmin.active = false;
                await this.ChannelAdminRepository.save(channelAdmin);
                return { success: true };
            }
        } catch (error) {
            console.error('Error in removing channel administrator:', error);
            return { success: false };
        }
    }

    async findAdmins(channelId: string) {
        try {
            const channel = await this.ChannelAdminRepository.find({
                where: {
                    channel: Equal(channelId),
                    active: true,
                },
            });
            return channel.map(admin => ({
                admin_id: admin.admin.id,
            }));
        } catch (error) {
            throw error;
        }
    }
}
