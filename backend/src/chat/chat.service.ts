import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './entities/direct-message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(DirectMessage)
        private directMessageRepository: Repository<DirectMessage>,
        private readonly userService: UserService,
    ) {}

    async findAllMessages(): Promise<DirectMessage[]> {
        return await this.directMessageRepository.find();
    }

    async findAllInteractedUsers(user_id: string): Promise<User[]> {
        const sentMessages = await this.directMessageRepository.find({
            where: { sender: { id: user_id } },
        });
        const receivedMessages = await this.directMessageRepository.find({
            where: { recipient: { id: user_id } },
        });

        const interactedUsersIds = [
            ...new Set([
                ...sentMessages.map(message => message.recipient.id),
                ...receivedMessages.map(message => message.sender.id),
            ]),
        ];
        return await this.userService.findByIds(interactedUsersIds);
    }

    async saveMessage(sendMessageDto: SendMessageDto, user_id: string) {
        try {
            const { recipient_id, message } = sendMessageDto;

            const recipientUser = await this.userService.findUser(recipient_id);

            if (!recipientUser) {
                throw new NotFoundException('Recipient not found');
            }

            const senderUser = await this.userService.findUser(user_id);

            if (!senderUser) {
                throw new NotFoundException('Sender not found');
            }

            const params = {
                sender: senderUser,
                recipient: recipientUser,
                message,
            };
            const directMessage = await this.directMessageRepository
                .create(params)
                .save();

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { sender, recipient, ...data } = directMessage;
            return data;
        } catch (error) {
            throw error;
        }
    }
}
