import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ description: 'Lista todos os usuários da base' })
    @ApiBearerAuth('access-token')
    @Get()
    findAll() {
        return this.userService.findAll();
    }
}
