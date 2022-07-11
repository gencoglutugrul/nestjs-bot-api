import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'datetime' })
  processedOn?: Date;

  @Column({ type: 'datetime' })
  finishedOn?: Date;

  @Column()
  result?: string;

  @Column()
  isCompleted: boolean;

  @Column()
  isFailed: boolean;
}
