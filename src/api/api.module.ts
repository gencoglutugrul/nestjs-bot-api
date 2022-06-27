import { ApiController } from './api.controller';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { WixProcessor } from './wix.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bot',
    }),
  ],
  controllers: [ApiController],
  providers: [WixProcessor],
})
export class ApiModule {}
