import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InviteDto } from './dto/invite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { getNonSensitiveUserInfo } from 'src/utils/formatNonSensitive.util';
import {
    CreateInvite,
    Invite,
    InviteAnswered,
} from './interfaces/friend.interface';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { UpdateInviteDto } from './dto/updateInvite.dto';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private friendRepository: Repository<Friend>,
        private readonly userService: UserService,
    ) {}

    async findFriends(
        userId: string,
        pagination: PaginationOptions,
    ): Promise<InviteAnswered[]> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const friends = await this.friendRepository.find({
            where: [
                { sender: { id: userId }, status: 'active' },
                { recipient: { id: userId }, status: 'active' },
            ],
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
            skip,
            take: limit,
        });

        if (!friends.length) {
            return [];
        }

        return friends.map(friend => ({
            id: friend.id,
            friend:
                friend.sender.id === userId
                    ? getNonSensitiveUserInfo(friend.recipient)
                    : getNonSensitiveUserInfo(friend.sender),
            invitedAt: friend.createdAt,
        }));
    }

    async findInviteReceived(
        userId: string,
        pagination: PaginationOptions,
    ): Promise<InviteAnswered[]> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const friends = await this.friendRepository.find({
            where: { recipient: { id: userId }, status: 'pending' },
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
            skip,
            take: limit,
        });

        if (!friends.length) {
            return [];
        }

        return friends.map(friend => ({
            id: friend.id,
            friend: getNonSensitiveUserInfo(friend.sender),
            invitedAt: friend.createdAt,
        }));
    }

    async findInviteSent(
        userId: string,
        pagination: PaginationOptions,
    ): Promise<InviteAnswered[]> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const friends = await this.friendRepository.find({
            where: { sender: { id: userId }, status: 'pending' },
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
            skip,
            take: limit,
        });

        if (!friends.length) {
            return [];
        }

        return friends.map(friend => ({
            id: friend.id,
            friend: getNonSensitiveUserInfo(friend.recipient),
            invitedAt: friend.createdAt,
        }));
    }

    async invite(inviteDto: InviteDto, userId: string): Promise<CreateInvite> {
        const { recipientId } = inviteDto;

        const recipientUser = await this.userService.findById(recipientId);
        if (!recipientUser) {
            throw new NotFoundException('Recipient not found');
        }

        const senderUser = await this.userService.findById(userId);
        if (!senderUser) {
            throw new NotFoundException('Sender not found');
        }

        const invite = await this.friendRepository.findOne({
            where: [
                { sender: { id: userId }, recipient: { id: recipientId } },
                { sender: { id: recipientId }, recipient: { id: userId } },
            ],
            relations: ['sender', 'recipient'],
        });

        let friend: Friend;
        if (invite) {
            if (['unfriended', 'rejected'].includes(invite.status)) {
                await this.friendRepository.update(
                    { id: invite.id },
                    { status: 'pending' },
                );
                invite.status = 'pending';
                friend = invite;
            } else {
                return {
                    status: 'already_invited',
                    invite: {
                        id: invite.id,
                        friend:
                            invite.sender.id === userId
                                ? getNonSensitiveUserInfo(invite.recipient)
                                : getNonSensitiveUserInfo(invite.sender),
                        status: invite.status,
                        invitedAt: invite.createdAt,
                    },
                };
            }
        } else {
            const params = {
                sender: senderUser,
                recipient: recipientUser,
            };
            friend = await this.friendRepository.create(params).save();
        }

        const formattedFriend: Invite = {
            id: friend.id,
            friend: getNonSensitiveUserInfo(friend.recipient),
            status: friend.status,
            invitedAt: friend.createdAt,
        };
        return { status: 'success', invite: formattedFriend };
    }

    async updateInviteStatus(
        updateInviteDto: UpdateInviteDto,
        userId: string,
    ): Promise<Invite> {
        const { id, status } = updateInviteDto;

        const invite = await this.friendRepository.findOne({
            where: { id },
            relations: ['sender', 'recipient'],
        });

        if (!invite) {
            throw new NotFoundException('Invite not found');
        }

        await this.friendRepository.update({ id }, { status });

        return {
            id: invite.id,
            friend:
                invite.sender.id === userId
                    ? getNonSensitiveUserInfo(invite.recipient)
                    : getNonSensitiveUserInfo(invite.sender),
            status,
            invitedAt: invite.createdAt,
        };
    }

    async deleteInvite(inviteId: string) {
        const invite = await this.friendRepository.findOne({
            where: { id: inviteId },
        });
        if (invite.status !== 'pending') {
            throw new BadRequestException('The invitation is not pending');
        }
        await this.friendRepository.delete({ id: inviteId });
    }
}
