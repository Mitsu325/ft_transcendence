import {
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
}
