import { ApiController } from './api.controller';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
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
    TypeOrmModule.forFeature(),
  ],
  controllers: [ApiController],
  providers: [WixProcessor],
})
export class ApiModule {}
