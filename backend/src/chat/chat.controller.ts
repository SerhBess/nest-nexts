import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from '@app/auth/guards/access-token.guard';
import { CreateChatDto } from './dto/create-chat-dto.dto';
import type { AuthenticatedRequest } from '@app/auth/types/authenticated-request.type';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async create(@Body() dto: CreateChatDto, @Req() req: AuthenticatedRequest) {
    const id = req.user.id;

    return this.chatService.create(dto, id);
  }
}
