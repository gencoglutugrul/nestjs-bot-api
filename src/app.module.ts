import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { BullModule } from '@nestjs/bull';
import Joi from 'joi';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SESSIONS_DIR: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
