import { ApiProperty } from '@nestjs/swagger';

export class Update2faDto {
    @ApiProperty()
    twoFactorAuth: boolean;
}
