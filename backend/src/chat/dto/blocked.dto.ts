import { ApiProperty } from '@nestjs/swagger';

export class BlockedDto {
    @ApiProperty()
    blockedId: string;
}
