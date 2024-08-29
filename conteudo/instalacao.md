 - Instalar o TypeORM
  - [ ] npm i typeorm @nestjs/typeorm pg

- No arquivo db.module.ts
  - Importar Módulo do TypeORM
    - [ ] import { TypeOrmModule } from '@nestjs/typeorm';
    - Dentro do @Module
      - [ ] Colocar 
        imports: [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: 'DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
          }),
        ],

- Configurar Entidades
  - User

    import { Profile } from 'src/profile/entities/profile.entity';
    import { Task } from 'src/task/entities/task.entity';
    import {
      Column,
      Entity,
      OneToMany,
      OneToOne,
      PrimaryGeneratedColumn,
    } from 'typeorm';

    @Entity()
    export class User {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @Column()
      email: string;

      @OneToOne(() => Profile, (profile) => profile.user)
      profile: Profile;

      @OneToMany(() => Task, (task) => task.user)
      tasks: Task[];
    }

  - Profile

    import { User } from 'src/user/entities/user.entity';
    import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      OneToOne,
      JoinColumn,
    } from 'typeorm';

    @Entity()
    export class Profile {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      bio: string;

      @Column()
      avatar: string;

      @OneToOne(() => User, (user) => user.profile)
      @JoinColumn()
      user: User;
    }

  - Task

    import { Tag } from 'src/tag/entities/tag.entity';
    import { User } from 'src/user/entities/user.entity';
    import {
      Column,
      Entity,
      JoinTable,
      ManyToMany,
      ManyToOne,
      PrimaryGeneratedColumn,
    } from 'typeorm';

    @Entity()
    export class Task {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      title: string;

      @ManyToOne(() => User, (user) => user.tasks)
      user: User;

      @ManyToMany(() => Tag, (tag) => tag.tasks)
      @JoinTable()
      tags: Tag[];
    }

  - Tag

    import { Task } from 'src/task/entities/task.entity';
    import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

    @Entity()
    export class Tag {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @ManyToMany(() => Task, (task) => task.tags)
      tasks: Task[];
    }

- [ ] (OPCIONAL) Configurar variáveis de ambiente no .env
  DB_HOST=
  DB_PORT=
  DB_NAME=
  DB_USERNAME=
  DB_PASSWORD=

- Criar o arquivo data-source.ts na raiz do projeto

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
    synchronize: false,
  });

- Criar scripts no package.json

  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
  "migration:generate": "npm run typeorm -- migration:generate ./src/migrations/InitialMigration -d ./data-source.ts",
  "migration:run": "npm run typeorm migration:run -- -d ./data-source.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d ./data-source.ts"

- Rodar o script npm run migration:generate

- Rodar o script npm run migration:run

- Configurar Repositories

  - User
    import { Injectable } from '@nestjs/common';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';
    import { User } from './entities/user.entity';

    @Injectable()
    export class UserRepository extends Repository<User> {
      constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {
        super(
          userRepository.target,
          userRepository.manager,
          userRepository.queryRunner,
        );
      }

      async findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['tasks'] });
      }

      async findOneById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id }, relations: ['tasks'] });
      }

      async createUser(name: string, email: string): Promise<User> {
        const user = this.userRepository.create({ name, email });
        return this.userRepository.save(user);
      }

      async updateUser(id: number, name: string, email: string): Promise<User> {
        await this.userRepository.update(id, { name, email });
        return this.findOneById(id);
      }

      async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
      }
    }

  - Profile

    import { Injectable } from '@nestjs/common';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Profile } from './entities/profile.entity';

    @Injectable()
    export class ProfileRepository {
      constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
      ) {}

      async createProfile(bio: string, avatar: string): Promise<Profile> {
        const profile = this.profileRepository.create({ bio, avatar });
        return this.profileRepository.save(profile);
      }

      async findOne(id: number): Promise<Profile> {
        return this.profileRepository.findOne({ where: { id } });
      }
    }

  - Task

    import { Injectable } from '@nestjs/common';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Task } from './entities/task.entity';

    @Injectable()
    export class TaskRepository extends Repository<Task> {
      constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
      ) {
        super(
          taskRepository.target,
          taskRepository.manager,
          taskRepository.queryRunner,
        );
      }

      async findAll(): Promise<Task[]> {
        return this.taskRepository.find({ relations: ['user', 'tags'] });
      }

      async findOneById(id: number): Promise<Task> {
        return this.taskRepository.findOne({
          where: { id },
          relations: ['user', 'tags'],
        });
      }

      async createTask(title: string, userId: number): Promise<Task> {
        const task = this.taskRepository.create({ title, user: { id: userId } });
        return this.taskRepository.save(task);
      }

      async updateTask(id: number, title: string): Promise<Task> {
        await this.taskRepository.update(id, { title });
        return this.findOneById(id);
      }

      async deleteTask(id: number): Promise<void> {
        await this.taskRepository.delete(id);
      }
    }

  - Tag

    import { Injectable } from '@nestjs/common';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Tag } from './entities/tag.entity';

    @Injectable()
    export class TagRepository extends Repository<Tag> {
      constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
      ) {
        super(
          tagRepository.target,
          tagRepository.manager,
          tagRepository.queryRunner,
        );
      }

      async findAll(): Promise<Tag[]> {
        return this.tagRepository.find({ relations: ['tasks'] });
      }

      async findOneById(id: number): Promise<Tag> {
        return this.tagRepository.findOne({ where: { id }, relations: ['tasks'] });
      }

      async createTag(name: string): Promise<Tag> {
        const tag = this.tagRepository.create({ name });
        return this.tagRepository.save(tag);
      }

      async updateTag(id: number, name: string): Promise<Tag> {
        await this.tagRepository.update(id, { name });
        return this.findOneById(id);
      }

      async deleteTag(id: number): Promise<void> {
        await this.tagRepository.delete(id);
      }
    }

- Criar Módulo Para Banco de Dados
  - [ ] nest generate module db
  - Na pasta db
    - [ ] Criar pasta entities
    - [ ] Criar pasta migrations
    - [ ] Criar arquivo typeOrm.migration-config.ts
- Configurar typeOrm.migration-config.ts
  - [ ] npm i dotenv
  - [ ] Preencher o arquivo
    import { ConfigService } from '@nestjs/config';
    import 'dotenv/config';
    import { DataSource, DataSourceOptions } from 'typeorm';

    const configService = new ConfigService();

    const dataSourceOptions: DataSourceOptions = {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [UserEntity, TaskEntity],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
    };

    export default new DataSource(dataSourceOptions);

- [ ] Criar Scripts no package.json
  "migration:create": "npm run typeorm -- migration:create ./src/db/migrations/$npm_config_name",
  "migration:run": "npm run typeorm migration:run -- -d ./src/db/typeorm.migrations.config.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d ./src/db/typeorm.migrations.config.ts"
- [ ] Criar task.entity.ts dentro da pasta entities
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('tasks')
  export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    title: string;

    @Column('varchar')
    description: string;

    @Column('varchar')
    status: string;

    @Column('timestamptz', { name: 'expiration_date' })
    expirationDate: Date;
  }
- [ ] Criar user.entity.ts dentro da pasta entities
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('users')
  export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    username: string;

    @Column('varchar', { name: 'password_hash' })
    passwordHash: string;
  }
- importar TypeOrmModule no users.module.ts
 - [ ] Adicionar imports no @Module
    imports: [TypeOrmModule.forFeature([UserEntity])],
- Refatorar users.services.ts
  - [ ] adicionar construtor importando Repository
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
    ) {}
  - [ ] modificar findByUsername
    async findByUsername(username: string): Promise<UserDto | null> {
      const userFound = await this.userRepository.findOne({
        where: { username },
      });

      if (!userFound) {
        return null;
      }

      return {
        id: userFound.id,
        username: userFound.username,
        password: userFound.passwordHash,
      };
    }
  - [ ] modificar createUser
    async createUser(newUser: UserDto) {
      const userAlreadyExists = await this.findByUsername(newUser.username);

      if (userAlreadyExists) {
        throw new ConflictException(`User ${newUser.username} already exists`);
      }

      const dbUser = new UserEntity();
      dbUser.username = newUser.username;
      dbUser.passwordHash = bcryptHashSync(newUser.password, 10);

      const { id, username } = await this.userRepository.save(dbUser);

      return { id, username };
    }
- Modificar o auth.service.ts
  - [ ] Adicionar async/await e Promise no signIn
- Modificar o auth.controller.ts
  - [ ] Adicionar async/await e Promise no signIn
- importar TypeOrmModule no tasks.module.ts
 - [ ] Adicionar imports no @Module
    imports: [TypeOrmModule.forFeature([TaskEntity])],
- Refatorar tasks.services.ts
  - [ ] adicionar construtor importando Repository
    constructor(
      @InjectRepository(TaskEntity)
      private readonly taskepository: Repository<TaskEntity>,
    ) {}
  - [ ] Refatorar create
    async create(task: TaskDto) {
      const taskToSave: TaskEntity = {
        title: task.title,
        description: task.description,
        status: TaskStatusEnum.TO_DO,
        expirationDate: task.expirationDate,
      };

      const createdTask = await this.taskRepository.save(taskToSave);

      return this.mapEntityToDto(createdTask);
    }
  - [ ] Criar mapEntityToDto
    private mapEntityToDto(task: TaskEntity): TaskDto {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: TaskStatusEnum[task.status],
        expirationDate: task.expirationDate,
      };
    }
  - [ ] Refatorar findById
    async findById(id: string): Promise<TaskDto> {
      const foundTask = await this.taskRepository.find({ where: { id } });

      if (!foundTask) {
        throw new HttpException(
          `Task with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return this.mapEntityToDto(foundTask[0]);
    }
  - [ ] Refatorar findAll
    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
      const searchParams: FindOptionsWhere<TaskEntity> = {};

      if (params.title) {
        searchParams.title = Like(`%${params.title}%`);
      }

      if (params.status) {
        searchParams.status = Like(`%${params.status}%`);
      }

      const tasksFound = await this.taskRepository.find({
        where: searchParams,
      });

      return tasksFound.map((task) => this.mapEntityToDto(task));
    }
  - [ ] Refatorar update
    async update(id: string, task: TaskDto): Promise<void> {
      const foundTask = await this.taskRepository.findOne({ where: { id } });

      if (!foundTask) {
        throw new HttpException(
          `Task with ID ${id} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.taskRepository.update({ id }, this.mapDtoToEntity(task));
    }
  - [ ] Criar o mapDtoToEntity
    private mapDtoToEntity(task: TaskDto): Partial<TaskEntity> {
      return {
        title: task.title,
        description: task.description,
        status: task.status.toString(),
        expirationDate: task.expirationDate,
      };
    }
  - [ ] Refatorar o delete
    async delete(id: string): Promise<string> {
      const result = await this.taskRepository.delete(id);

      if (!result.affected) {
        throw new HttpException(
          `Task with ID ${id} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return `Task with ID ${id} deleted`;
    }

- Modificar o auth.controller.ts
  - [ ] Adicionar async/await e Promise nas rotas
