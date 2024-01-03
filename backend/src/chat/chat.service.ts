import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isSameDay, format } from 'date-fns';

import { DirectMessage } from './entities/direct-message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/user/user.service';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';

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

        const currentDate = new Date();
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

            const chatUser =
                id == lastMessage.sender.id
                    ? getNonSensitiveUserInfo(lastMessage.sender)
                    : getNonSensitiveUserInfo(lastMessage.recipient);
            delete chatUser.username;

            interactedUsers.push({
                chatUser,
                text: lastMessage.message,
                date: isSameDay(currentDate, lastMessage.createdAt)
                    ? format(lastMessage.createdAt, 'HH:mm')
                    : format(lastMessage.createdAt, 'MM/dd/yyyy'),
            });
        }

        return interactedUsers;
    }

    async findMessagesFromChattingUser(
        chattingUserId: string,
        loggedUserId: string,
        pagination: PaginationOptions,
    ) {
        const { page, limit } = pagination;
        const totalCount = await this.directMessageRepository.count({
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
        });

        const skip = (page - 1) * limit;
        let messages = await this.directMessageRepository.find({
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
            skip,
            take: limit + 1,
        });

        if (!messages.length) {
            return [];
        }

        messages = messages.reverse();

        const hasNextPage = totalCount > page * limit;
        const formattedMessages = [];
        let date = messages.length ? messages[0].createdAt : '';
        for (const item of messages) {
            if (!isSameDay(date, item.createdAt)) {
                date = item.createdAt;
                formattedMessages.push({
                    type: 'divider',
                    text: format(date, 'MM/dd/yyyy'),
                });
            }
            const senderUser = getNonSensitiveUserInfo(item.sender);
            delete senderUser.username;
            formattedMessages.push({
                id: item.id,
                type: 'text',
                text: item.message,
                senderUser,
                hour: format(item.createdAt, 'HH:mm'),
            });
        }
        if (messages.length > limit) {
            formattedMessages.shift();
        }
        if (!hasNextPage) {
            formattedMessages.unshift({
                type: 'divider',
                text: format(messages[0].createdAt, 'MM/dd/yyyy'),
            });
        }
        return formattedMessages;
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
            const formattedMessage = {
                id: directMessage.id,
                type: 'text',
                text: directMessage.message,
                senderUser: getNonSensitiveUserInfo(directMessage.sender),
                hour: format(directMessage.createdAt, 'HH:mm'),
            };
            return formattedMessage;
        } catch (error) {
            throw error;
        }
    }
}
