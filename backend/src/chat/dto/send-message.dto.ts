import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty()
    recipientId: string;

    @ApiProperty()
    message: string;
}
