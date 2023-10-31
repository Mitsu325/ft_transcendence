import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto'
import { isEmail } from 'class-validator';

@Injectable()
export class UsernameExistsValidationPipe 
    implements PipeTransform<CreateUserDto> 
{
  constructor(private readonly userService: UserService) {}

  async transform(value: CreateUserDto , metadata: ArgumentMetadata) {
    const { username } = value;

    if (username.includes('@')) {
    
      if (!isEmail(username)){
        throw new BadRequestException('Invalid email.');
      }
    } 
    
    const userExists = await this.userService.findUser(value.username);
    if (userExists) {
      throw new BadRequestException('Username is already in use.');
    }
    return value;
  }
}
