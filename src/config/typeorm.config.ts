import { DataSource, DataSourceOptions } from 'typeorm';

import { AddPasswordToRequestEntity1657708756844 } from 'src/migrations/1657708756844-AddPasswordToRequestEntity';
import { Initial1657698016998 } from 'src/migrations/1657698016998-initial';
import JobEntity from 'src/entities/job.entity';
import { NotImplementedException } from '@nestjs/common';
import RequestEntity from 'src/entities/request.entity';
import { registerAs } from '@nestjs/config';

export const getTypeORMOptions = (): DataSourceOptions => {
  const generalOptions = {
    entities: [RequestEntity, JobEntity],
    migrations: [Initial1657698016998, AddPasswordToRequestEntity1657708756844],
    synchronize: false,
  };

  if (process.env.DB_TYPE === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.DB_NAME,
      ...generalOptions,
    };
  } else {
    // TO-DO: Implement cases for other database solutions.
    throw new NotImplementedException(
      `There is no implementation for ${process.env.DB_TYPE}!`,
    );
  }
};

export const SqliteDataSource = process.env._.includes('typeorm')
  ? new DataSource(getTypeORMOptions())
  : null;

export default registerAs('orm', getTypeORMOptions);
