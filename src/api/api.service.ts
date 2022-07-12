import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import RequestEntity from './entities/request.entity';

@Injectable()
export class ApiService {
  @InjectRepository(RequestEntity)
  private requestsRepository: Repository<RequestEntity>;

  async getJob(jobId: number): Promise<RequestEntity> {
    return this.requestsRepository.findOne({
      where: { jobId },
      relations: { job: true },
    });
  }
}
