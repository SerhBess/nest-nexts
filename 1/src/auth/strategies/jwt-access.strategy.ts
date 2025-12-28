import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../types/token-payload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const cookieExtractor = (req: Request): string | null => {
      if (!req || typeof req !== 'object') {
        return null;
      }

      const cookies = req.cookies as Record<string, unknown> | undefined;

      if (!cookies || typeof cookies !== 'object') {
        return null;
      }

      const token = cookies['accessToken'];

      return typeof token === 'string' ? token : null;
    };

    const options: StrategyOptions = {
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
