import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './entities/direct-message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/user/user.service';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';

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

    async findAllInteractedUsers(loggedUserId: string) {
        const messages = await this.directMessageRepository.find({
            where: [
                { sender: { id: loggedUserId } },
                { recipient: { id: loggedUserId } },
            ],
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
        });

        const interactedUserIds = new Set<string>();
        messages.forEach(message => {
            if (message.sender.id !== loggedUserId) {
                interactedUserIds.add(message.sender.id);
            } else {
                interactedUserIds.add(message.recipient.id);
            }
        });

        const interactedUsers = [];
        for (const id of interactedUserIds) {
            let lastMessage;
            if (id === loggedUserId) {
                lastMessage = messages.find(
                    message =>
                        message.sender.id === id && message.recipient.id === id,
                );
            } else {
                lastMessage = messages.find(
                    message =>
                        message.sender.id === id || message.recipient.id === id,
                );
            }
            if (!lastMessage) continue;

            const sender = getNonSensitiveUserInfo(lastMessage.sender);
            const recipient = getNonSensitiveUserInfo(lastMessage.recipient);
            interactedUsers.push({
                id: lastMessage.id,
                message: lastMessage.message,
                createdAt: lastMessage.createdAt,
                sender: { ...sender },
                recipient: { ...recipient },
            });
        }

        return interactedUsers;
    }

    async findMessagesFromChattingUser(
        chattingUserId: string,
        loggedUserId: string,
    ) {
        const messages = await this.directMessageRepository.find({
            where: [
                {
                    sender: { id: loggedUserId },
                    recipient: { id: chattingUserId },
                },
                {
                    sender: { id: chattingUserId },
                    recipient: { id: loggedUserId },
                },
            ],
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
        });
        return messages.map(item => ({
            id: item.id,
            message: item.message,
            createdAt: item.createdAt,
            sender: { ...getNonSensitiveUserInfo(item.sender) },
            recipient: { ...getNonSensitiveUserInfo(item.recipient) },
        }));
    }

    async saveMessage(sendMessageDto: SendMessageDto, loggedUserId: string) {
        try {
            const { recipientId, message } = sendMessageDto;

            const recipientUser = await this.userService.findUser(recipientId);

            if (!recipientUser) {
                throw new NotFoundException('Recipient not found');
            }

            const senderUser = await this.userService.findUser(loggedUserId);

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
