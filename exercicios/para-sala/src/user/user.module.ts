import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Task])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exportar se for necessário em outros módulos
})
export class UserModule {}
