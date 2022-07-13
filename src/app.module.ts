import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { BullModule } from '@nestjs/bull';
import Joi from 'joi';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SESSIONS_DIR: Joi.string().required(),
        SLACK_TOKEN: Joi.string().required(),
        SLACK_CHANNEL: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      expandVariables: true,
      isGlobal: true,
      load: [typeormConfig],
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow('orm');
      },
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
