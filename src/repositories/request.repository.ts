import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import RequestEntity from 'src/entities/request.entity';

@Injectable()
export class RequestRepository {
  @InjectRepository(RequestEntity)
  private repository: Repository<RequestEntity>;

  async getByJobId(jobId: number): Promise<RequestEntity | null> {
    return this.repository.findOne({
      where: { jobId },
      relations: { job: true },
    });
  }
}
