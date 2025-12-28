import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (config: ConfigService) => ({
  accessSecret: config.get<string>('JWT_ACCESS_SECRET'),
  refreshSecret: config.get<string>('JWT_REFRESH_SECRET'),
  accessExpires: config.get<string>('JWT_ACCESS_EXPIRES_IN'),
  refreshExpires: config.get<string>('JWT_REFRESH_EXPIRES_IN'),
});
