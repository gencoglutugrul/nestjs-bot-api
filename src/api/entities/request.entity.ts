import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import JobEntity from './job.entity';

@Entity()
export default class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  loginUrl: string;

  @Column({ nullable: true })
  jobId: number;

  @OneToOne(() => JobEntity)
  @JoinColumn()
  job: JobEntity;
}
