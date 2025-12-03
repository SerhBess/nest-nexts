import { UserService } from '@app/user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { compare, hash } from 'bcrypt';
import { TokenPayload } from '@app/auth/types/token-payload.type';
import { LoginDto } from '@app/auth/dto/login.dto';
import { UserEntity } from '@app/user/user.entity';
import { Response } from 'express';
import { AuthenticatedRequest } from './types/authenticated-request.type';
import { AuthenticatedRefreshUser } from './types/authenticated-refresh-request.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.users.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.users.createUser({
      ...dto,
      password: hashedPassword,
    });

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
    });

    await this.users.updateRefreshToken(user.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const safeUser = this.toSafeUser(user);

    return { user: safeUser };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.users.findByEmailWithPassword(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await compare(dto.password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
    });

    await this.users.updateRefreshToken(user.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const safeUser = this.toSafeUser(user);

    return { user: safeUser };
  }

  async refresh(reqUser: AuthenticatedRefreshUser, res: Response) {
    const user = await this.users.findByEmailWithRefreshToken(reqUser.email);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'User not found or no refresh token stored',
      );
    }

    const isValid = await compare(reqUser.refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
    });

    await this.users.updateRefreshToken(user.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { user: this.toSafeUser(user) };
  }

  async getMe(req: AuthenticatedRequest) {
    const user = await this.users.findById(req.user.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { user };
  }

  private toSafeUser(user: UserEntity) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...safe } = user;
    return safe;
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
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15m
    });

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }
}
