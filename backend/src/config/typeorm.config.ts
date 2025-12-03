import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    logging: config.get<string>('DB_LOGGING') === 'true',
    synchronize: false,

    entities: [
      __dirname + '/../**/*.entity.js',
      __dirname + '/../**/*.entity.ts',
    ],
  };
}
