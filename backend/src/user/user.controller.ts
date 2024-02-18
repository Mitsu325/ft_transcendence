import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ParamExistValidationPipe } from 'src/common/code-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from 'src/common/validator/file.validator';
import {
  MAX_AVATAR_SIZE_IN_BYTES,
  VALID_IMAGE_MIME_TYPES,
} from 'src/common/constants';
import { Update2faDto } from './dto/update-2fa.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PlayersService } from 'src/game/game.service';
import { Injectable } from '@nestjs/common';

class UserStatus {
  id: string;
  status: string;
}

@ApiTags('user')
@Controller('user')
@Injectable()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly playersService: PlayersService,
  ) { }

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
    return this.userService.getNoSecrets(req.user.sub);
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
  @Get('/id/:userId')
  findUserById(@Param() params: any) {
    return this.userService.getSensitiveDataById(params.userId);
  }

  @ApiOperation({ description: 'Find a user by username' })
  @ApiParam({
    name: 'username',
    type: 'string',
    description: 'username',
  })
  @ApiBearerAuth('access-token')
  @Get('/username/:username')
  findUserByUsername(@Param() params: any) {
    return this.userService.getSensitiveDataByUsername(params.username);
  }

  @ApiOperation({
    description:
      'Upload user avatar. Only valid files with extension image/jpeg, image/png and less than 2 MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_IMAGE_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({
          maxSize: MAX_AVATAR_SIZE_IN_BYTES,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    return this.userService.uploadAvatar(req.user.sub, file);
  }

  @ApiOperation({ description: 'Update twoFactorAuth' })
  @ApiBody({ type: Update2faDto, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Post('set/two-factor-auth')
  update2fa(@Body() update2faDto: Update2faDto, @Request() req) {
    return this.userService.update2fa(
      req.user.sub,
      update2faDto.twoFactorAuth,
    );
  }

  @ApiOperation({ description: 'Update user' })
  @ApiBody({ type: UpdateUserDto, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUser(req.user.sub, updateUserDto);
  }

  @ApiOperation({ description: 'Update password' })
  @ApiBody({ type: ChangePasswordDto, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Patch('password')
  updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.userService.updatePassword(req.user.sub, changePasswordDto);
  }

  @ApiOperation({ description: 'Update User Status' })
  @ApiBody({ type: UserStatus, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Post('set/user-status')
  async updateStatus(@Body() status: UserStatus) {
    await this.userService.updateStatusUser(status);
  }

  @ApiOperation({ description: 'Get all users status' })
  @ApiBearerAuth('access-token')
  @Get('get/all-users-status')
  async getUsersStatus() {
    const usersStatus = await this.userService.updatedUsersStatus();
    return usersStatus;
  }

  @ApiOperation({ description: 'Get users status by id' })
  @ApiBearerAuth('access-token')
  @Get('get/users-status-by-id/:id')
  async getUsersStatusById(@Param() params: any) {
    const usersStatus = await this.userService.updatedUsersStatus();
    const statusFounded = usersStatus.find(
      el => String(el.id) === String(params.id),
    );

    if (statusFounded) {
      return statusFounded.status;
    } else {
      return 'offline';
    }
  }
}
