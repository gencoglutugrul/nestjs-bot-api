import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, NotImplementedException } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { BullModule } from '@nestjs/bull';
import Joi from 'joi';
import { SqliteConnectionOption } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      isGlobal: true,
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
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('DB_TYPE') === 'sqlite')
          return SqliteConnectionOption;
        // TO-DO: Implement cases for other database solutions.
        else
          throw new NotImplementedException(
            'There is no implementation other than SQLite!',
          );
      },
      inject: [ConfigService],
    }),

    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
