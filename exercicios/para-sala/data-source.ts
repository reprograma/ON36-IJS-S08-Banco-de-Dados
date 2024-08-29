import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';
import { Profile } from './src/profile/entities/profile.entity';
import { Task } from './src/task/entities/task.entity';
import { Tag } from './src/tag/entities/tag.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  username: 'postgres.xtqkutrklwmkabhrzqpt',
  password: 'ReprogramaDB36!',
  database: 'postgres',
  entities: [User, Profile, Task, Tag],
  migrations: ['./src/migrations/*.ts'],
  synchronize: true,
});
