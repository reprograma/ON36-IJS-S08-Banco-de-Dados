import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  minibio?: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  user: User;
}
