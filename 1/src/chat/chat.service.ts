import { PrismaService } from '@app/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat-dto.dto';
import { Chat, ChatType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateChatDto, currentUserId: string): Promise<Chat> {
    const { memberIds, type, name } = dto;

    const allMembersIds = Array.from(new Set([...memberIds, currentUserId]));

    if (type === ChatType.DIRECT) {
      if (allMembersIds.length !== 2) {
        throw new BadRequestException('direct chats must have 2 members');
      }

      const existingChat = await this.prismaService.chat.findFirst({
        where: {
          type: ChatType.DIRECT,
          AND: [
            { members: { some: { userId: allMembersIds[0] } } },
            { members: { some: { userId: allMembersIds[1] } } },
          ],
        },
      });

      if (existingChat) {
        throw new BadRequestException('chat already exist');
      }
    }

    const chat = await this.prismaService.chat.create({
      data: {
        type,
        name: type === ChatType.GROUP ? name : null,
        ownerId: type === ChatType.GROUP ? currentUserId : null,
        members: {
          create: memberIds.map((id) => ({
            userId: id,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
    });

    return chat;
  }
}
