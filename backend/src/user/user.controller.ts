import { Get, Param, NotFoundException, Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getOneUser(@Param() email: string) {
    const user = await this.userService.getOne(email);
    if (user) {
      return user;
    }
    throw new NotFoundException(`Not user found with email ${email}`);
  }
}
