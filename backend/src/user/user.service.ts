import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const newUser = this.userRepository.create(dto);
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  async findByEmailWithRefreshToken(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'refreshToken'],
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    let hashed: string | null = null;

    if (refreshToken) {
      hashed = await bcrypt.hash(refreshToken, 10);
    }

    await this.userRepository.update(userId, { refreshToken: hashed });
  }
}
