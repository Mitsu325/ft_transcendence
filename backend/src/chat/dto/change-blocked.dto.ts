import { ApiProperty } from '@nestjs/swagger';

export class ChangeBlockedDto {
    @ApiProperty()
    blockedId: string;

    @ApiProperty()
    active: boolean;
}
