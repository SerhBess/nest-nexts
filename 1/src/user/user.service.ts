import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@app/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import {
  UserPublic,
  UserWithPassword,
  UserWithRefreshToken,
} from './types/user.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<UserPublic> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findPublicById(id: string): Promise<UserPublic> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getAll(): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  async findPublicByEmail(email: string): Promise<UserPublic> {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findForAuthByEmail(email: string): Promise<UserWithPassword> {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });
  }

  async findForRefreshToken(userId: string): Promise<UserWithRefreshToken> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        refreshToken: true,
      },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashed = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashed,
      },
    });
  }
}
