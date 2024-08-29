 # Instalação do TypeORM no Projeto

### Instalar o TypeORM
`npm i typeorm @nestjs/typeorm pg`

# Configuração do TypeORM

**Sugestão**

### No arquivo app.module.ts
  - Importar Módulo do TypeORM e configurar a conexão (OPCIONAL - Configurar variáveis de ambiente no .env)

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- Criar o arquivo data-source.ts na raiz do projeto

```
  import { DataSource } from 'typeorm';

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
```
## Configuração na Arquitetura Hexagonal

### Camada de Domínio

**Entidades**: Defina suas entidades de domínio, que estarão na pasta domain.

**Pasta**: src/domain/entities

### Camada de Aplicação

**Use Cases/Services**: Esta camada contém a lógica de negócios do sistema, aqui será feita a chamada para a interface  de repository
**Pasta**: src/application/services

### Ports

**Ports**: Definição de interfaces que descrevem os contratos que os adaptadores precisam implementar.
**Pasta**: src/application/ports

### Camada de Infraestrutura

**Adaptadores de Banco de Dados**: Implementam as interfaces definidas na camada de aplicação.

**Pasta**: src/infrastructure/database/repositories

## Importante 
- Lembre-se de registrar os repositórios no módulo para correta injeção de dependência (**imports**, **providers** e **exports**)

### Migrações

- Criar scripts no package.json

```
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
  "migration:generate": "npm run typeorm -- migration:generate ./src/migrations/InitialMigration -d ./data-source.ts",
  "migration:run": "npm run typeorm migration:run -- -d ./data-source.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d ./data-source.ts"
```

- Rodar o script npm run migration:generate

- Rodar o script npm run migration:run

- Configurar Repositories (Pode ser direto na service usando os Repositories do proprio TypeORM opu fazendo em uma camada separada)

```
Lembre-se que a conexão com o BD pode demorar a trazer os dados, portanto use asyn/await nas sus requisições
```