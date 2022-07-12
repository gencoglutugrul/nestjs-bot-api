import { ApiController } from './api.controller';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import JobEntity from './entities/job.entity';
import { Module } from '@nestjs/common';
import RequestEntity from './entities/request.entity';
import { RequestRepository } from './repositories/request.repository';
import { SlackModule } from 'nestjs-slack';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WixProcessor } from './wix.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bot',
    }),
    SlackModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'api',
        apiOptions: {
          token: configService.get('SLACK_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RequestEntity, JobEntity]),
  ],
  controllers: [ApiController],
  providers: [RequestRepository, WixProcessor],
})
export class ApiModule {}
