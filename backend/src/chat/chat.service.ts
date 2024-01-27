import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isSameDay, format } from 'date-fns';

import { DirectMessage } from './entities/direct-message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/user/user.service';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { BlockedDto } from './dto/blocked.dto';
import { Blocked } from './entities/blocked.entity';
import { ChangeBlockedDto } from './dto/change-blocked.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(DirectMessage)
        private directMessageRepository: Repository<DirectMessage>,
        @InjectRepository(Blocked)
        private blockedRepository: Repository<Blocked>,
        private readonly userService: UserService,
    ) {}

    async findAllMessages(): Promise<DirectMessage[]> {
        return await this.directMessageRepository.find();
    }

    async findAllInteractedUsers(loggedUserId: string) {
        const blockedUsers: Blocked[] = await this.blockedRepository.find({
            where: {
                blocker: { id: loggedUserId },
                active: true,
            },
            relations: ['blocker', 'blocked'],
        });

        const blockedIds = blockedUsers.map((item: Blocked) => item.blocked.id);

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

        const filteredInteractedUserIds = new Set(
            [...interactedUserIds].filter(item => !blockedIds.includes(item)),
        );

        const currentDate = new Date();
        const interactedUsers = [];
        for (const id of filteredInteractedUserIds) {
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

            const recipientUser = await this.userService.findById(recipientId);

            if (!recipientUser) {
                throw new NotFoundException('Recipient not found');
            }

            const senderUser = await this.userService.findById(loggedUserId);

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

    async findAllBlockedUsers(loggedUserId: string) {
        const blockedUsers: Blocked[] = await this.blockedRepository.find({
            where: {
                blocker: { id: loggedUserId },
                active: true,
            },
            relations: ['blocker', 'blocked'],
        });

        return blockedUsers.map((item: Blocked) => ({
            id: item.id,
            blocked: getNonSensitiveUserInfo(item.blocked),
        }));
    }

    async blockUser(blockedDto: BlockedDto, loggedUserId: string) {
        const { blockedId } = blockedDto;

        if (loggedUserId === blockedId) {
            throw new BadRequestException(
                'The blocker and blocked are the same users',
            );
        }

        const blockerUser = await this.userService.findById(loggedUserId);
        if (!blockerUser) {
            throw new NotFoundException('Blocker not found');
        }

        const blockedUser = await this.userService.findById(blockedId);
        if (!blockedUser) {
            throw new NotFoundException('Blocked not found');
        }

        const blocked = await this.blockedRepository.findOne({
            where: {
                blocker: { id: loggedUserId },
                blocked: { id: blockedId },
            },
        });

        if (blocked) {
            await this.blockedRepository.update(
                {
                    blocker: { id: loggedUserId },
                    blocked: { id: blockedId },
                },
                {
                    active: true,
                },
            );
        } else {
            const params = {
                blocker: blockerUser,
                blocked: blockedUser,
            };
            await this.blockedRepository.create(params).save();
        }
        return;
    }

    async updateBlockUser(
        changeBlockedDto: ChangeBlockedDto,
        loggedUserId: string,
    ) {
        const { blockedId, active } = changeBlockedDto;

        const blocked = await this.blockedRepository.findOne({
            where: {
                blocker: { id: loggedUserId },
                blocked: { id: blockedId },
            },
        });

        if (!blocked) {
            throw new NotFoundException('Blocked not found');
        }

        await this.blockedRepository.update(
            {
                blocker: { id: loggedUserId },
                blocked: { id: blockedId },
            },
            { active },
        );
        return;
    }

    async userIsBlocked(
        blockerId: string,
        blockedId: string,
    ): Promise<boolean> {
        const blocked = await this.blockedRepository.findOne({
            where: {
                blocker: { id: blockerId },
                blocked: { id: blockedId },
                active: true,
            },
        });
        return !!blocked;
    }
}
