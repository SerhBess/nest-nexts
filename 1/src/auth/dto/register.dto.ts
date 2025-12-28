import { IsString } from 'class-validator';
import { BaseUserFieldsDto } from './base-user-fields.dto';

export class RegisterDto extends BaseUserFieldsDto {
  @IsString()
  username: string;
}
