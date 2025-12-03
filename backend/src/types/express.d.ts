import { AuthenticatedUser } from '@app/auth/types/authenticated-user.type';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends AuthenticatedUser {}
  }
}
