import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { EmailExistsValidationPipe } from './pipes/verifyEmail.validation.pipe';
import { hashPassword, comparePass } from '../utils/hash.util'
import { LoginDto } from './dto/login.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Create a new user' })
  @ApiBody({ type: CreateUserDto, description: 'Request body.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
  
      await new ValidationPipe().transform(createUserDto, {
        metatype: CreateUserDto,
        type: 'body',
      });
      await new EmailExistsValidationPipe(this.userService).transform(createUserDto, { metatype: String, type: 'body' });

      const hashPass = await hashPassword(createUserDto.password)
      createUserDto.password = hashPass;

      const user = await this.userService.create(createUserDto);
      if (user) {
       return { success: true, message: 'User created successfully' };
      } else {
        return { success: false, message: 'Failed to create user' };
      }
    } catch(error){
      return { success: false, message: 'Validation failed', error: error.response.message  };
    } 
  }

  @ApiOperation({ description: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'Login request body.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto){
  const { username, password } = loginDto;

  const user = await this.userService.findUsername(username);
  if (!user) {
      return { success: false, message: 'User not found.' };
  }

  const matchPass = await comparePass(password, user.password);
  if (matchPass) {
    return { success: true, message: 'Login successful.' };
  } else {
    return { success: false, message: 'Invalid credentials.' };
  }
}

  @ApiOperation({ description: 'Lista todos os usuários da base' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
