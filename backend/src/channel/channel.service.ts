import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelDto } from './dto/channel.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,
    ) {}

    async findAll(): Promise<ChannelDto[]> {
        const channels = await this.channelsRepository.find();
        return channels.map(channel => ({
            id: channel.id,
            name_channel: channel.name_channel,
            type: channel.type,
            owner: channel.owner.name,
        }));
    }

    async create(createChannelDto: CreateChannelDto) {
        try {
            const { owner, ...channelData } = createChannelDto;

            const user: DeepPartial<User> = { name: owner };
            const channel: DeepPartial<Channel> = {
                ...channelData,
                owner: user,
            };

            const savedChannel = await this.channelsRepository.save(channel);
            return savedChannel;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
