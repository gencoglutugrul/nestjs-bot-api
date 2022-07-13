import { DataSource } from 'typeorm';
import RequestEntity from '../entities/request.entity';

export const RequestRepositoryProvider = {
  provide: 'RequestEntityRepository',
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(RequestEntity).extend({
      async getByJobId(jobId: number): Promise<RequestEntity | null> {
        console.log(this);

        return this.findOne({
          where: { jobId },
          relations: { job: true },
        });
      },
    }),
  inject: [DataSource],
};
