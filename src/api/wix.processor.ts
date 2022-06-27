import { Process, Processor } from '@nestjs/bull';

import { BotDTO } from './dto/bot.dto';
import { Job } from 'bull';
import { Wix } from './processorHelper/';

@Processor('bot')
export class WixProcessor {
  @Process('wix')
  async handleProcess(job: Job) {
    const data: BotDTO = job.data;
    return Wix.syncReservations(data.username, data.password);
  }
}
