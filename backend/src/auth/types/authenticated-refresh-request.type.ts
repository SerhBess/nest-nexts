import { Request } from 'express';
import { AuthenticatedUser } from './authenticated-user.type';

export interface AuthenticatedRefreshUser extends AuthenticatedUser {
  refreshToken: string;
}

export interface AuthenticatedRefreshRequest extends Request {
  user: AuthenticatedRefreshUser;
}
