import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import RequestEntity from './request.entity';

@Entity()
export default class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'datetime', nullable: true })
  processedOn: Date | null;

  @Column({ type: 'datetime', nullable: true })
  finishedOn: Date | null;

  @Column({ nullable: true })
  result: string | null;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isFailed: boolean;

  @OneToOne(() => RequestEntity)
  request: RequestEntity;
}
