import { Process, Processor } from '@nestjs/bull';

import { BotDTO } from './dto/bot.dto';
import { Job } from 'bull';
import { syncReservations } from './processorHelper/wix/index';

@Processor('bot')
export class WixProcessor {
  @Process('wix')
  async handleProcess(job: Job) {
    const data: BotDTO = job.data;
    return syncReservations(data.username, data.password);
  }
}
