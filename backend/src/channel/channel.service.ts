import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Messages } from './entities/message.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { comparePass } from 'src/utils/hash.util';
import { PrivateChannelUsers } from './entities/privateChannel.entity';
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import { ChannelAdminService } from 'src/channel-admin/channel-admin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,

        @InjectRepository(Messages)
        private readonly MessageRepository: Repository<Messages>,
        @InjectRepository(PrivateChannelUsers)
        private readonly privateChannelUsersRepository: Repository<PrivateChannelUsers>,

        @Inject(forwardRef(() => ChannelAdminService))
        private readonly channelAdminService: ChannelAdminService,

        private readonly userService: UserService,
    ) {}

    async findAll(userId: string): Promise<ChannelDto[]> {
        const channelsWithoutAccess =
            await this.channelAdminService.findChannelsWithoutAccess(userId);

        const channels = await this.channelsRepository.find();

        const filterChannels: ChannelDto[] = await Promise.all(
            channels
                .filter(channel => !channelsWithoutAccess.includes(channel.id))
                .map(async channel => ({
                    id: channel.id,
                    name_channel: channel.name_channel,
                    type: channel.type,
                    owner: channel.owner ? channel.owner.name : null,
                })),
        );

        return filterChannels;
    }

    async findById(channelId: string) {
        return await this.channelsRepository.findOne({
            where: { id: channelId },
        });
    }

    async create(createChannelDto: CreateChannelDto) {
        try {
            const savedChannel =
                await this.channelsRepository.save(createChannelDto);
            if (createChannelDto.users && createChannelDto.users.length > 0) {
                await Promise.all(
                    createChannelDto.users.map(async userId => {
                        const privateChannelUser = new PrivateChannelUsers();
                        privateChannelUser.userId = userId;
                        privateChannelUser.channelId = savedChannel.id;
                        await this.privateChannelUsersRepository.save(
                            privateChannelUser,
                        );
                    }),
                );
            }
            return savedChannel;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addMessage(messageDto: CreateMessageDto) {
        try {
            const memberAction =
                await this.channelAdminService.findMemberAction(
                    messageDto.channel_id,
                    messageDto.sender_id,
                );

            if (memberAction.action) {
                return {
                    success: false,
                    message: 'Não foi possível enviar mensagem',
                    data: memberAction,
                };
            }

            const channel = await this.findById(messageDto.channel_id);

            const sender = await this.userService.findById(
                messageDto.sender_id,
            );

            if (!channel || !sender) {
                return {
                    success: false,
                    message: 'Não foi possível enviar mensagem',
                    data: { action: '', expirationDate: null },
                };
            }

            const message = await this.MessageRepository.save({
                channel_id: channel,
                sender_id: sender,
                message: messageDto.message,
            });

            return { success: true, message };
        } catch (error) {
            return {
                success: false,
                message: 'Não foi possível enviar mensagem',
                data: { action: '', expirationDate: null },
            };
        }
    }

    async getMessages(channel_id) {
        try {
            const allMsg = await this.MessageRepository.find();
            const channelMessages = allMsg.filter(
                message =>
                    message.channel_id && message.channel_id.id === channel_id,
            );
            const retMessages = channelMessages.map(message => ({
                message: message.message,
                channel_id: message.channel_id ? message.channel_id.id : null,
                userName: message.sender_id ? message.sender_id.name : null,
                createdAt: message.createdAt,
            }));
            return retMessages;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async verifyPassword(roomId: string, password: string): Promise<boolean> {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: roomId },
            });
            if (!channel) {
                return false;
            }
            return await comparePass(password, channel.password);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async generateToken(roomId: string): Promise<string> {
        const key = crypto.randomBytes(32).toString('hex');

        try {
            const token = jwt.sign({ roomId }, key, { expiresIn: '24h' });
            return token;
        } catch (error) {
            console.error('Error generating token:', error);
            throw error;
        }
    }

    async findOwner(channelId: string) {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: channelId },
                relations: ['owner'],
            });
            return channel ? channel.owner : null;
        } catch (error) {
            throw error;
        }
    }

    async updateOwner(channelId: string): Promise<Channel> {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: channelId },
            });
            channel.owner = null;
            return this.channelsRepository.save(channel);
        } catch (error) {
            throw error;
        }
    }

    async addPassword(channelId: string, password: string): Promise<boolean> {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: channelId },
            });
            if (!channel) {
                throw new Error('Channel not find');
            }
            channel.password = password;
            channel.type = 'Protegido';
            await this.channelsRepository.save(channel);
            return true;
        } catch (error) {
            console.error('Error adding channel password:', error);
            return false;
        }
    }

    async changePassword(
        channelId: string,
        newPassword: string,
    ): Promise<boolean> {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: channelId },
            });
            if (!channel) {
                throw new Error('Channel not find');
            }
            channel.password = newPassword;
            await this.channelsRepository.save(channel);
            return true;
        } catch (error) {
            console.error('Error change channel password:', error);
            return false;
        }
    }

    async removePassword(channelId: string): Promise<boolean> {
        try {
            const channel = await this.channelsRepository.findOne({
                where: { id: channelId },
            });
            if (!channel) {
                throw new Error('Channel not find');
            }
            channel.password = '';
            channel.type = 'Público';
            await this.channelsRepository.save(channel);
            return true;
        } catch (error) {
            console.error('Error remove channel password:', error);
            return false;
        }
    }

    async isUserInChannel(userId: string, channelId: string): Promise<boolean> {
        const result = await this.privateChannelUsersRepository.findOne({
            where: {
                userId: Equal(userId),
                channelId: Equal(channelId),
            },
        });
        if (result) {
            return true;
        } else return false;
    }
}
