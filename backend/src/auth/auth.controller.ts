import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import type { AuthenticatedRequest } from './types/authenticated-request.type';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import type { AuthenticatedRefreshRequest } from './types/authenticated-refresh-request.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return this.authService.getMe(req);
  }

  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @Req() req: AuthenticatedRefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req.user, res);
  }
}
