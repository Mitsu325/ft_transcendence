import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { Messages } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { comparePass } from 'src/utils/hash.util';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,

        @InjectRepository(Messages)
        private readonly MessageRepository: Repository<Messages>,
    ) {}

    async findAll(): Promise<ChannelDto[]> {
        const channels = await this.channelsRepository.find();

        const channelDtos = await Promise.all(
            channels.map(async channel => ({
                id: channel.id,
                name_channel: channel.name_channel,
                type: channel.type,
                owner: channel.owner ? channel.owner.name : null,
            })),
        );

        return channelDtos;
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
            return savedChannel;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addMessage(messageDto: CreateMessageDto) {
        const message = await this.MessageRepository.save(messageDto);
        return message;
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
}
