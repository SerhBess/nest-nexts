import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly username: string;
}
