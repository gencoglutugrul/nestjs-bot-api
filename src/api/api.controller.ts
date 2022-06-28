import {
  Body,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { BotDTO } from './dto/bot.dto';
import { Controller } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('api')
export class ApiController {
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
  async getJobResult(@Param('id') id: string) {
    const job = await this.botQueue.getJob(id);
    if (!job) {
      throw new NotFoundException(`There is no job with id ${id}`);
    }
    // TODO: Refactor
    const isCompleted = await job.isCompleted();
    const isFailed = await job.isFailed();

    const result = {
      isCompleted,
      isActive: await job.isActive(),
      isFailed,
      isWaiting: await job.isWaiting(),
    };

    if (isFailed)
      return {
        ...result,
        isCompleted: true,
        executionTime: (job.finishedOn - job.processedOn) / 1000,
        result: {
          success: false,
          message: job.failedReason,
        },
      };

    if (!isCompleted) return result;

    return {
      ...result,
      executionTime: (job.finishedOn - job.processedOn) / 1000,
      result: job.returnvalue,
    };
  }
}
