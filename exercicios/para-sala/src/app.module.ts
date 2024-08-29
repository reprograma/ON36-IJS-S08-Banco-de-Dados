import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'SEU_HOST_DO_BANCO',
      port: 'PORTA_DO_BANCO',
      username: 'USERNAME_DO_BANCO',
      password: 'SENHA_DI_BANCO',
      database: 'NOME DA BASE DE DADOS',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    TaskModule,
    TagModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
