import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export default class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  loginUrl: string;
}
