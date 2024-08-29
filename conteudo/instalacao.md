 - Instalar o TypeORM
  - [ ] npm i typeorm @nestjs/typeorm pg

- No arquivo app.module.ts
  - Importar Módulo do TypeORM e configurar a conexão (OPCIONAL - Configurar variáveis de ambiente no .env)
- [ ] 
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
            synchronize: true, //Não use em produção
          }),
        ],

- Criar o arquivo data-source.ts na raiz do projeto

  import { DataSource } from 'typeorm';
  import { User } from './src/user/entities/user.entity';
  import { Profile } from './src/profile/entities/profile.entity';
  import { Task } from './src/task/entities/task.entity';
  import { Tag } from './src/tag/entities/tag.entity';

  export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'DB_NAME,
    entities: [LISTA_DE_ENTIDADES],
    migrations: ['./src/migrations/*.ts'],
    synchronize: true, //Não use em produção
  });

- Criar scripts no package.json

  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
  "migration:generate": "npm run typeorm -- migration:generate ./src/migrations/InitialMigration -d ./data-source.ts",
  "migration:run": "npm run typeorm migration:run -- -d ./data-source.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d ./data-source.ts"

- Configurar Entidades

- Rodar o script npm run migration:generate

- Rodar o script npm run migration:run

- Configurar Repositories (Pode ser direto na service usando os Repositories do proprio TypeORM opu fazendo em uma camada separada)

```
Lembre-se que a conexão com o BD pode demorar a trazer os dados, portanto use asyn/await nas sus requisições
```