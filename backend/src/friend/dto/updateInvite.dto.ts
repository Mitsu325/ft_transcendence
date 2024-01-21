import { ApiProperty } from '@nestjs/swagger';
import { FriendStatusType } from '../entities/friend.entity';

export class UpdateInviteDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: FriendStatusType;
}
