import { ChatType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateChatDto {
  @IsEnum(ChatType, {
    message: `chat should be of: ${Object.values(ChatType).join(', ')}`,
  })
  type: ChatType;

  @ValidateIf((o: CreateChatDto) => o.type === ChatType.GROUP)
  @IsString()
  @MinLength(3)
  name?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
