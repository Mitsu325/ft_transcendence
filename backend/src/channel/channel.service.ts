import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { Messages } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
// import { User } from '../user/entities/user.entity';

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
        return channels.map(channel => ({
            id: channel.id,
            name_channel: channel.name_channel,
            type: channel.type,
            owner: channel.owner ? channel.owner.name : null,
        }));
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

    async getAllMessages(): Promise<Messages[]> {
        return this.MessageRepository.find();
    }
}
