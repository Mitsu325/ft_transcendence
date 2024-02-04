import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
import { UpdateStatusResponse } from './user.service';
import { PlayersService } from 'src/game/game.service';
import { game } from 'src/game/game.gateway';
import { Injectable, Inject } from '@nestjs/common';

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

  @ApiOperation({ description: 'Update User Status' })
  @ApiBody({ type: UserStatus, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Post('set/user-status')
  async updateStatus(@Body() status: UserStatus, @Request() req) {
    const roomId = this.playersService.findPlayerById(status.id, game);
    if (roomId !== null) {
      status.status = 'playing';
    }
    await this.userService.updateStatusUser(status);
  }

  @ApiOperation({ description: 'Get all users status' })
  @ApiBearerAuth('access-token')
  @Get('get/all-users-status')
  async getUsersStatus() {
    const usersStatus = await this.userService.updatedUsersStatus();
    return usersStatus;
  }
}
