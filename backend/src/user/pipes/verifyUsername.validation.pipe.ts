import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UsernameExistsValidationPipe 
    implements PipeTransform<CreateUserDto> 
{
  constructor(private readonly userService: UserService) {}

  async transform(value: CreateUserDto , metadata: ArgumentMetadata) {

    const userExists = await this.userService.findUser(value.username);
    if (userExists) {
      throw new BadRequestException('Username is already in use.');
    }

    return value;
  }
}
