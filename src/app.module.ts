import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, NotImplementedException } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { BullModule } from '@nestjs/bull';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

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
        switch (configService.get('DB_TYPE')) {
          case 'sqlite':
            return {
              type: 'sqlite',
              database: configService.get('DB_NAME'),
              entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],

              // TO-DO: this is dangerous on production
              // find another way to create automatically table schema
              // there can be migration systems on typeorm
              synchronize: true,
            };
            break;

          default:
            // TO-DO: Implement cases for other database solutions.
            throw new NotImplementedException(
              'There is no implementation other than SQLite!',
            );
            break;
        }
      },
      inject: [ConfigService],
    }),

    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
