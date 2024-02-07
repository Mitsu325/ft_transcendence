import { Injectable } from '@nestjs/common';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelAdmin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Equal } from 'typeorm';
import { RemoveAdminDto } from './dto/remove-admin.dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { AdminActionRes, AdminRes } from './interfaces/channel-admin.interface';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import { ActionType, AdminAction } from './entities/admin-action.entity';
import { UpdateAdminActionDto } from './dto/update-admin-action.dto';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { format } from 'date-fns';

@Injectable()
export class ChannelAdminService {
    constructor(
        @InjectRepository(ChannelAdmin)
        private ChannelAdminRepository: Repository<ChannelAdmin>,
        @InjectRepository(AdminAction)
        private AdminActionRepository: Repository<AdminAction>,
        private readonly channelService: ChannelService,
        private readonly userService: UserService,
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

    async findAdminAction(
        channelId: string,
        pagination: PaginationOptions,
        action: ActionType,
    ): Promise<AdminActionRes> {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;
            const currentDate = new Date();

            const query = [
                {
                    channel: Equal(channelId),
                    action,
                    active: true,
                    expirationDate: IsNull(),
                },
                {
                    channel: Equal(channelId),
                    action,
                    active: true,
                    expirationDate: MoreThan(currentDate),
                },
            ];

            const total = await this.AdminActionRepository.count({
                where: query,
            });

            const adminActions = await this.AdminActionRepository.find({
                where: query,
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
            });

            if (!adminActions.length) {
                return { data: [], pagination: { total: 0, page, limit } };
            }

            const data = adminActions.map(admin => ({
                id: admin.id,
                channel_id: admin.channel.name_channel,
                member: getNonSensitiveUserInfo(admin.member),
                action: admin.action,
                active: admin.active,
                expirationDate: admin.expirationDate
                    ? format(admin.expirationDate, 'dd/MM/yyyy HH:mm:ss')
                    : '',
            }));

            return { data, pagination: { total, page, limit } };
        } catch (error) {
            console.error('Error to find channel administrators:', error);
            throw error;
        }
    }

    async updateAdminAction(
        updateAdminActionDto: UpdateAdminActionDto,
        userId: string,
    ) {
        const { channelId, memberId, action, active, expirationDate } =
            updateAdminActionDto;

        if (action === 'mute' && active && !expirationDate) {
            return {
                status: 'bad-request',
                message: 'Informe a data de expiração',
            };
        }

        const channel = await this.channelService.findById(channelId);

        const channelAdmin = await this.ChannelAdminRepository.findOne({
            where: {
                channel: { id: channelId },
                admin: { id: userId },
                active: true,
            },
        });

        if (channel.owner.id !== userId && !channelAdmin) {
            return {
                status: 'no-permission',
                message: 'Sem permissão para efetuar a ação',
            };
        }

        const memberIsAdmin = await this.ChannelAdminRepository.findOne({
            where: {
                channel: { id: channelId },
                admin: { id: memberId },
                active: true,
            },
        });

        if (channel.owner.id === memberId || memberIsAdmin) {
            return {
                status: 'member-is-admin',
                message: 'O usuário é um admin',
            };
        }

        const admin = await this.userService.findById(userId);

        const adminAction = await this.AdminActionRepository.findOne({
            where: {
                channel: { id: channelId },
                member: { id: memberId },
            },
        });

        if (adminAction) {
            if (adminAction.action === 'ban' && adminAction.active) {
                return {
                    status: 'banned',
                    message: 'O usuário está permanentemente banido',
                };
            }

            const params = {
                action,
                admin,
                active,
                expirationDate: action !== 'mute' ? null : expirationDate,
            };
            await this.AdminActionRepository.update(
                { id: adminAction.id },
                params,
            );

            return { status: 'success' };
        }

        const member = await this.userService.findById(memberId);

        const params = {
            channel,
            admin,
            member,
            action,
            active,
            expirationDate: action !== 'mute' ? null : expirationDate,
        };
        const newAdminAction = this.AdminActionRepository.create(params);
        await this.AdminActionRepository.save(newAdminAction);

        return { status: 'success' };
    }
}
