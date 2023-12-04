import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty()
    recipient_id: string;

    @ApiProperty()
    message: string;
}
