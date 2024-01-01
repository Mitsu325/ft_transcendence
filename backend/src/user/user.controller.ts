import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import {
    ApiOperation,
    ApiTags,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';
import { ParamExistValidationPipe } from 'src/common/code-validation.pipe';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ description: 'Get all users' })
    @ApiBearerAuth('access-token')
    @Get('all')
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ description: 'Get a user' })
    @ApiBearerAuth('access-token')
    @Get('me')
    find(@Request() req) {
        return this.userService.findUser(req.user.sub);
    }

    @ApiOperation({ description: 'Find a user by name' })
    @ApiQuery({ name: 'name', type: String, required: true })
    @ApiBearerAuth('access-token')
    @Get('search')
    searchUsers(@Query('name', ParamExistValidationPipe) name: string) {
        return this.userService.findUsersByName(name);
    }

    @ApiOperation({ description: 'Find a user by id' })
    @ApiParam({
        name: 'userId',
        type: 'string',
        description: 'user ID',
    })
    @ApiBearerAuth('access-token')
    @Get(':userId')
    findUserById(@Param() params: any) {
        return this.userService.getUserSensitiveDataById(params.userId);
    }
}
