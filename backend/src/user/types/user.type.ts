import { UserEntity } from '@app/user/user.entity';

export type UserSafe = Omit<UserEntity, 'password' | 'refreshToken'>;
