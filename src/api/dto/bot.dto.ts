import { IsNotEmpty, IsString } from 'class-validator';

export class BotDTO {
  @IsNotEmpty()
  @IsString()
  login_url: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
