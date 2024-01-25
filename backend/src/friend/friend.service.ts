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
import { CreateInvite, Invite, InviteRes } from './interfaces/friend.interface';
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
    ): Promise<InviteRes> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const total = await this.friendRepository.count({
            where: [
                { sender: { id: userId }, status: 'active' },
                { recipient: { id: userId }, status: 'active' },
            ],
        });

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
            return { data: [], pagination: { total: 0, page, limit } };
        }

        const data = friends.map(friend => ({
            id: friend.id,
            friend:
                friend.sender.id === userId
                    ? getNonSensitiveUserInfo(friend.recipient)
                    : getNonSensitiveUserInfo(friend.sender),
            invitedAt: friend.createdAt,
        }));

        return { data, pagination: { total, page, limit } };
    }

    async findInviteReceived(
        userId: string,
        pagination: PaginationOptions,
    ): Promise<InviteRes> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const total = await this.friendRepository.count({
            where: { recipient: { id: userId }, status: 'pending' },
        });

        const friends = await this.friendRepository.find({
            where: { recipient: { id: userId }, status: 'pending' },
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
            skip,
            take: limit,
        });

        if (!friends.length) {
            return { data: [], pagination: { total: 0, page, limit } };
        }

        const data = friends.map(friend => ({
            id: friend.id,
            friend: getNonSensitiveUserInfo(friend.sender),
            invitedAt: friend.createdAt,
        }));

        return { data, pagination: { total, page, limit } };
    }

    async findInviteSent(
        userId: string,
        pagination: PaginationOptions,
    ): Promise<InviteRes> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const total = await this.friendRepository.count({
            where: { sender: { id: userId }, status: 'pending' },
        });

        const friends = await this.friendRepository.find({
            where: { sender: { id: userId }, status: 'pending' },
            order: { createdAt: 'DESC' },
            relations: ['sender', 'recipient'],
            skip,
            take: limit,
        });

        if (!friends.length) {
            return { data: [], pagination: { total: 0, page, limit } };
        }

        const data = friends.map(friend => ({
            id: friend.id,
            friend: getNonSensitiveUserInfo(friend.recipient),
            invitedAt: friend.createdAt,
        }));

        return { data, pagination: { total, page, limit } };
    }

    async invite(inviteDto: InviteDto, userId: string): Promise<CreateInvite> {
        const { recipientId } = inviteDto;

        if (userId === recipientId) {
            throw new BadRequestException('Recipient is the same as sender');
        }

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
                    {
                        status: 'pending',
                        sender: senderUser,
                        recipient: recipientUser,
                    },
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

        if (status === 'pending') {
            throw new BadRequestException('Cannot change to this status');
        }

        const invite = await this.friendRepository.findOne({
            where: [
                { id, recipient: { id: userId } },
                { id, sender: { id: userId } },
            ],
            relations: ['sender', 'recipient'],
        });

        if (!invite) {
            throw new NotFoundException('Invite not found');
        }

        if (
            (status === 'active' || status === 'rejected') &&
            invite.recipient.id !== userId
        ) {
            throw new BadRequestException('Cannot change to this status');
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
        if (!invite) {
            throw new NotFoundException('Invite not found');
        }
        if (invite.status !== 'pending') {
            throw new BadRequestException('The invitation is not pending');
        }
        await this.friendRepository.delete({ id: inviteId });
    }
}
