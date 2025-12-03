import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly config: ConfigService) {
    const cookieExtractor = (req: Request): string | null => {
      const cookies = req.cookies as Record<string, unknown> | undefined;
      const token = cookies?.['refreshToken'];
      return typeof token === 'string' ? token : null;
    };

    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,
      ignoreExpiration: false,
      passReqToCallback: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(
    req: Request,
    payload: AuthenticatedUser,
  ): AuthenticatedUser & { refreshToken: string } {
    const cookies = req.cookies as Record<string, unknown> | undefined;
    const token = cookies?.['refreshToken'];

    if (typeof token !== 'string') {
      throw new Error('Refresh token missing or invalid');
    }

    return {
      ...payload,
      refreshToken: token,
    };
  }
}
