import { Prisma } from '@app/generated/prisma/client';

export type UserPublic = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    username: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type UserWithPassword = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    username: true;
    password: true;
  };
}>;

export type UserWithRefreshToken = Prisma.UserGetPayload<{
  select: {
    id: true;
    refreshToken: true;
  };
}>;
