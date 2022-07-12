import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import RequestEntity from '../entities/request.entity';

@Injectable()
export class RequestRepository extends Repository<RequestEntity> {
  async getByJobId(jobId: number): Promise<RequestEntity> {
    return this.findOne({
      where: { jobId },
      relations: { job: true },
    });
  }
}
