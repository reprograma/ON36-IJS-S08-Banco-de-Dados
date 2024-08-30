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
    TypeOrmModule.forRoot(AppDataSource.options),
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
    type: 'postgres', // Tipo de banco, são aceitos: postgres, mysql, mariadb, postgres, cockroachdb, sqlite, mssql, oracle, sap, spanner, cordova, nativescript, react-native, expo, mongodb
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'DB_NAME,
    entities: [LISTA_DE_ENTIDADES], // Lista com as entidades
    migrations: ['./src/migrations/*.ts'], // Caminho das migrations
    synchronize: true, // Não use em produção. Sincroniza suas entidades toda vez que  a aplicação sobe
    logging: false, // Configuração de logs
  });
```
## Configuração na Arquitetura Hexagonal

### Camada de Domínio

**Entidades**: Defina suas entidades de domínio, que estarão na pasta domain.

**Pasta**: src/domain/entities

Possivelmente vocês já tem entidades criadas com um modelo parecido com o abaixo:
```
export class Photo {
  id: number
  name: string
  description: string
  filename: string
  views: number
  isPublished: boolean
}
```
Nela já temos um breve modelo de como salvar os dados, por isso, precisamos modificá-la para que passa a ser espelho para a criação da tabela no Banco de dados.

- **Criando Entidade**: Para isso, usaremos o decorator `@Entity` para informar ao TypeORM que aquele modelo será uma Tabela no Banco de Dados.
- **Adicionando colunas**: Para isso usaremos o decorator `@Column`. Por padrão as strings são mapeadas como `varchar(255)`, números como `integer`, mas podemos personalizar os tipos passando por parametro.
- **Adicionando chave primária**: Podemos usar o decorator `@PrimaryColumn` para isso. Caso queira que o campo seja auto incrementando, use o decorator `@PrimaryGeneratedColumn`

```
@Entity()
export class Photo {
    @PrimaryGeneratedColumn() // @PrimaryColumn
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column("text")
    description: string

    @Column()
    filename: string

    @Column("double")
    views: number

    @Column()
    isPublished: boolean
}
```

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