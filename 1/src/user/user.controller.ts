import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '@app/auth/guards/access-token.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('all')
  async getAll() {
    return this.userService.getAll();
  }
}
