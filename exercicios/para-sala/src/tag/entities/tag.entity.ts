import { Exclude } from 'class-transformer';
import { Task } from 'src/task/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Task, (task) => task.tags)
  @JoinTable()
  @Exclude({ toPlainOnly: true })
  tasks: Task[];
}
