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

  // TO-DO: password should stored as encrypted
  @Column()
  password: string;

  @Column()
  loginUrl: string;

  @Column()
  jobId: number;

  @OneToOne(() => JobEntity)
  @JoinColumn()
  job: JobEntity;
}
