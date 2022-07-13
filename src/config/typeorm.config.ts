import { DataSource, DataSourceOptions } from 'typeorm';

import { Initial1657698016998 } from 'src/migrations/1657698016998-initial';
import JobEntity from 'src/entities/job.entity';
import RequestEntity from 'src/entities/request.entity';

export const SqliteConnectionOption: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME,
  entities: [RequestEntity, JobEntity],
  migrations: [Initial1657698016998],
  synchronize: false,
};

export const SqliteDataSource = new DataSource(SqliteConnectionOption);

SqliteDataSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization', err);
});
