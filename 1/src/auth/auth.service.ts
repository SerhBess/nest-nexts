import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { compare } from 'bcrypt';

import { UserService } from '@app/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenPayload } from './types/token-payload.type';
import { AuthenticatedRequest } from './types/authenticated-request.type';
import { AuthenticatedRefreshUser } from './types/authenticated-refresh-request.type';
import { UserPublic } from '@app/user/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // REGISTER
  // ===============================
  async register(
    dto: RegisterDto,
    res: Response,
  ): Promise<{ user: UserPublic }> {
    const existing = await this.users
      .findPublicByEmail(dto.email)
      .catch(() => null);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.users.createUser(dto);

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
    });

    await this.users.updateRefreshToken(user.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { user };
  }

  async login(dto: LoginDto, res: Response): Promise<{ user: UserPublic }> {
    const userWithPassword = await this.users
      .findForAuthByEmail(dto.email)
      .catch(() => null);

    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compare(dto.password, userWithPassword.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens({
      id: userWithPassword.id,
      email: userWithPassword.email,
    });

    await this.users.updateRefreshToken(
      userWithPassword.id,
      tokens.refreshToken,
    );

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const user = await this.users.findPublicById(userWithPassword.id);

    return { user };
  }

  async refresh(
    reqUser: AuthenticatedRefreshUser,
    res: Response,
  ): Promise<{ user: UserPublic }> {
    const userWithRefresh = await this.users
      .findForRefreshToken(reqUser.id)
      .catch(() => null);

    if (!userWithRefresh || !userWithRefresh.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await compare(
      reqUser.refreshToken,
      userWithRefresh.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens({
      id: reqUser.id,
      email: reqUser.email,
    });

    await this.users.updateRefreshToken(reqUser.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const user = await this.users.findPublicById(reqUser.id);

    return { user };
  }

  async getMe(req: AuthenticatedRequest): Promise<{ user: UserPublic }> {
    const user = await this.users.findPublicById(req.user.id);
    return { user };
  }

  private generateTokens(payload: TokenPayload) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    const accessToken = this.jwt.sign(payload, {
      secret: accessSecret,
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: refreshSecret,
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setAuthCookies(res: Response, access: string, refresh: string) {
    res.cookie('accessToken', access, {
      httpOnly: true,
      secure: false, // true в prod + https
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async logout(userId: string, res: Response): Promise<{ success: boolean }> {
    try {
      await this.users.updateRefreshToken(userId, null);

      this.clearAuthCookies(res);

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  private clearAuthCookies(res: Response) {
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      expires: new Date(0),
    });
  }
}
