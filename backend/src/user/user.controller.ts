import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ description: 'Get all users' })
    @ApiBearerAuth('access-token')
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ description: 'Get a user' })
    @ApiBearerAuth('access-token')
    @Get('me')
    find(@Request() req) {
        return this.userService.findUser(req.user.id);
    }
}
