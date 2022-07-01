import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BotDTO {
  @IsNotEmpty()
  @IsString()
  login_url: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
