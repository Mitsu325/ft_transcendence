import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelAdmin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChannelAdminDto } from './dto/admin.dto';
import { Equal } from 'typeorm';
import { RemoveAdminDto } from './dto/remove-admin.dto';

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

    async findAll(channel_id: string): Promise<ChannelAdminDto[]> {
        try {
            const admins = await this.ChannelAdminRepository.find({
                where: {
                    channel: Equal(channel_id),
                    active: true,
                },
            });
            return admins.map(admin => ({
                id: admin.id,
                channel_id: admin.channel.name_channel,
                admin_id: admin.admin.name,
                active: admin.active,
            }));
        } catch (error) {
            console.error('Error to find channel administrators:', error);
            throw error;
        }
    }

    async removeAdmin(
        params: RemoveAdminDto,
    ): Promise<{ success: boolean; message?: string }> {
        try {
            const channelAdmin = await this.ChannelAdminRepository.findOne({
                where: {
                    channel: { id: params.channel_id },
                    admin: { id: params.admin_id },
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
