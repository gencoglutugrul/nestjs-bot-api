import {
  Body,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { BotDTO } from './dto/bot.dto';
import { Controller } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  @Inject(ApiService)
  private readonly apiService: ApiService;

  constructor(@InjectQueue('bot') private readonly botQueue: Queue) {}

  @Post('/start-bot')
  @HttpCode(200)
  async run(@Body() post: BotDTO) {
    if (post.login_url.indexOf('wix.com') !== -1) {
      const job = await this.botQueue.add('wix', post);

      return {
        jobId: job.id,
      };
    } else {
      throw new NotFoundException(
        `There is no implementation for ${post.login_url}`,
      );
    }
  }
  @Get('/result/:id')
  async getJobResult(@Param('id') id: number) {
    const job = await this.apiService.getJob(id);
    if (!job) {
      throw new NotFoundException(`There is no job with id ${id}`);
    }
    return job;
  }
}
