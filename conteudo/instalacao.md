 # Instalação do TypeORM no Projeto

### Instalar o TypeORM
`npm i typeorm @nestjs/typeorm pg`

# Configuração do TypeORM

## Configuração do Data Source

É por onde ocorre a conexão com o Banco de dados.

- Criar o arquivo data-source.ts na raiz do projeto
  - Configurar as options dentro do DataSource de acordo com a sua necessidade (vou listar abaixo as principais)

```
  import { DataSource } from 'typeorm';

  export const AppDataSource = new DataSource({
    type: 'postgres', // [OBRIGATÓRIO] Tipo de banco, são aceitos: "mysql", "postgres", "cockroachdb", "sap", "spanner", "mariadb", "sqlite", "cordova", "react-native", "nativescript", "sqljs", "oracle", "mssql", "mongodb", "aurora-mysql", "aurora-postgres", "expo", "better-sqlite3", "capacitor".
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'DB_NAME,
    entities: ["entidade", "entity/*.js"], // Lista com as entidades
    migrations: ['./src/migrations/*.ts'], // Caminho das migrations
    synchronize: true, // Não use em produção. Sincroniza suas entidades toda vez que  a aplicação sobe
    logging: false, // Configuração de logs, se for true habilita logs de error e query. Se quiser outros tipos de log, descreva em um array ex.: "query", "error", "schema"].
    logger: "advanced-console", // Configura qual logger que vai ser utilizado. Valores aceitos: "advanced-console", "simple-console" and "file".
    maxQueryExecutionTime: 1000, // Se a execução da query estourar o tempo em milisegundos vai estourar uma exeption.
    poolSize: 10, // Número máximo de conexãoes ativas no pool.
    dropSchema: true, // Não use em produção. Dropa o schema cada vez que a aplicação é inicializada.
    migrationsRun: true, // Inidca se a migrations vão rodar automaticamente cada vez que a aplicação subir. É uma alternativa ao comando migration:run
  });
```

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

## Configuração na Arquitetura Hexagonal

### Camada de Domínio

**Entidades**: Entidade é a classe que será mapeada para uma tabela do banco de dados, basicamente contem colunas e relacionamentos e obrigatoriamente tem que ter uma coluna de chave primária. Todas as entidades tem que ser registradas nas options do DataSource. Defina suas entidades que estarão na pasta domain.

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

- **Criando Entidade**: Para isso, usaremos o decorator `@Entity` para informar ao TypeORM que aquele modelo será uma Tabela no Banco de Dados. Se quiser colocar um nome alternativo para a tabela, você pode especificá-lo como parêmetro no decorator: `@Entity("my_users")`.
- **Adicionando colunas**: Para isso usaremos o decorator `@Column`, cada coluna marcada com esse decorator representará uma coluna da tabela. Por padrão as strings são mapeadas como `varchar(255)`, números como `integer`, mas podemos personalizar os ttipos passando por parametro.
  - **Tipos especiais de colunas**: 
    - `@CreateDateColumn`: automaticamente insere data de criação.
    - `@UpdateDateColumn`: automaticamente insere data de upadate a cada vez que chamamos o `save` no repository.
    - `@DeleteDateColumn`: automaticamente insere data cada vez que o `soft-delete` for chamado no repository.
    - `@VersionColumn`: automaticamente insere a versão de uma entidade a cada vez que chamamos o `save` no repository.
- **Adicionando chave primária**: Podemos usar o decorator `@PrimaryColumn` para isso, também pode especificar o tipo dela passando por parâmetro. Caso queira que o campo seja auto incrementando com um valor inteiro, use o decorator `@PrimaryGeneratedColumn`, se quiser que seja um valor gerado seja um uuid, passe "uuid" como arâmetro no decorator anterior.
- **Acicionando Índices**: Use o decorator `@Index` para criar um índice para o banco de dados.
- **Tipos das colunas**: O TypeORM suporta todos os tipos comuns dos bancos de dados. Você pode especificar o tipo no primeiro parametro do decorator ou na propriedade `type`do options, que pode estar no primeiro ou segundo parametro dependendo se foi passado tipo ou não no primeiro.
  - **Tipo enum**: Podem ser usados os tipos enum do typescript ou arrays
```
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role: UserRole
}

________________________________________________________________

export type UserRoleType = "admin" | "editor" | "ghost",

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["admin", "editor", "ghost"],
        default: "ghost"
    })
    role: UserRoleType
}
```
- **Options das colunas**: 
  - `type`: tipo da coluna
  - `name`: nome da coluna no banco. Por default, o nome é o da propriedade porém se tiver esse campo o calor será substituído pelo valor especificado aqui.
  - `length`: tamanho do campo.
  - `nullable`: booleano, faz a coluna ser `NULL` ou `NOT NULL` na tabela. Por default, seu valor é `false`.
  - `update`: indica se a coluna vai ser aualizada no `save`. Por default, é `true`.
  - `insert`: indica se a coluna vai ser definido na inserção do objeto. Por default, é `true`.
  - `default`: indica um valor `default` para a coluna.
  - `unique`: marca a coluna como unico.
  - `charset`: define `charset` da coluna.
  - `collation`: define `collation` da coluna.
  - `enum`: usado para definir um valor de uma lista permitida de valores.

**Exemplo**:
```
@Entity()
export class Photo {
    @PrimaryGeneratedColumn("uuid") // @PrimaryGeneratedColumn() // @PrimaryColumn
    id: number

    @Column("text", {
        length: 100,
    })
    name: string

    @Column({
      type: "text",
      length: 100,
    )
    description: string

    @Column("text")
    filename: string

    @Column("double")
    views: number

    @Column()
    isPublished: boolean
}
```
### Relacionamentos

Os relacionamentos ajudam a tratar as relações entre as tabelas e tem vários tipos:
  - 1:1 (um para um): Quando o relacionamento contém apenas uma única instância para cada lado. Adicionamos o decorator `@OneToOne` para especificarmos o tipo de relação de destino. Também adicionamos `@JoinColumn` que é obrigatório e deve ser definido apenas em um lado da relação — o lado que deve ter a chave estrangeira na tabela do banco de dados. Relações podem ser unidirecionais e bidirecionais. Unidirecionais são relações com um decorator de relação somente em um lado. Bidirecionais são relações com decorators em ambos os lados de uma relação.

  - N:1 / 1:N  (muitos para um / um para muitos): Quando o relacionamento contém muitas instâncias de um lado da relação e apenas uma unica instancia do outro lado. Usam os decorators `@ManyToOne` / `@OneToMany` e um não existe sem o outro, ou seja, obrigatóriamente se temos um, temos que ter o outro. Podemos omitir o `@JoinColumn` nesse tipo de relação.

  - N:N (muitos para muitos): Quando temos múltiplas instâncias de ambos os lados do relacionamento. Usa o decorator `@ManyToMany` e o `@JoinTable()` é obrigatório para esse tipo de relacionamento e você deve colocà-lo no lado proprietário da relação. Relações podem ser unidirecionais e bidirecionais. Unidirecionais são relações com um decorator de relação somente em um lado. Bidirecionais são relações com decorators em ambos os lados de uma relação.

Opções de relacionamentos:
  - `eager`: boolean - Se for `true`, o relacionamento sempre será carregado com a entidade principal quando for usado o método `find` ou `QueryBuilder` nessa entidade.
  - `cascade`: boolean | ("insert" | "update" | "remove" | "soft-remove" | "recover")[] - Se for `true`, o objeto relacionado será inserido ou atualizado no banco. Você também pode especificar um array de opções em cascata.
  - `onDelete`: "RESTRICT"|"CASCADE"|"SET NULL" - Especifica como a chave estrangeira deve se comportar quando o objeto relacionado for deletado.
  - `nullable`: boolean - Indica se o objeto relacionado pode ou não ser nulo.Por default ele pode ser nulo.
orphanedRowAction: "nullify" | "delete" | "soft-delete" | disable - When a parent is saved (cascading enabled) without a child/children that still exists in database, this will control what shall happen to them. delete will remove these children from database. soft-delete will mark children as soft-deleted. nullify will remove the relation key. disable will keep the relation intact. To delete, one has to use their own repository.

Opções do **@JoinColumn**

Define qual lado da relação contém a coluna de junção com a chave estrangeira e também permite que você personlize o nome da coluna.

Esse decorator é opcional para `@ManyToOne`mas é obrigatório para `@OneToOne`.

```
@ManyToOne(type => Category)
@JoinColumn() || @JoinColumn({ name: "cat_id" })
category: Category;
```

Opções do **@JoinTable**

`@JoinTable` é usado para relacionamenos N:N e descreve as colunas da tabela "auxiliar". Uma tabela auxiliar é uma tabela separada especial criada automaticamente pelo TypeORM com colunas que se referem às entidades relacionadas. Você pode alterar nomes de colunas e suas referências com @JoinColumn: Você também pode alterar o nome da tabela "auxiliar" gerada.

```
@ManyToMany(type => Category)
@JoinTable() || @JoinTable({
    name: "question_categories", // Nome da tabela auxiliar desse relacionamento
    joinColumn: {
        name: "question",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "category",
        referencedColumnName: "id"
    }
})
categories: Category[];
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

## Funções de administração de BD

### Find

`find`, `findBy`, `findOne`, `findOneBy`

```
repository.find()

repository.findBy({
    firstName: "Timber",
})

repository.findOne({
    where: {
        firstName: "Timber",
    },
})

repository.findOneBy({ firstName: "Timber" })

```

- Opções básicas (funcionam para todos os tipos de `find`)
  - `select`: indica quais colunas devem retornar do banco.
  ```
  //SELECT "firstName", "lastName" FROM "user"

  userRepository.find({
    select: {
      firstName: true,
      lastName: true,
    },
  })
  ```
  - `relations`: relacionamentos que precisam ser carregados na busca.
  ```
  //SELECT * FROM "user"
    LEFT JOIN "profile" ON "profile"."id" = "user"."profileId"
    LEFT JOIN "photos" ON "photos"."id" = "user"."photoId"
    LEFT JOIN "videos" ON "videos"."id" = "user"."videoId"

  userRepository.find({
    relations: {
      profile: true,
      photos: true,
      videos: true,
    },
  })
  ```
  - `where`: condições de busca
  ```
  //SELECT * FROM "user"
    WHERE "firstName" = 'Timber' AND "lastName" = 'Saw'

  userRepository.find({
    where: {
      firstName: "Timber",
      lastName: "Saw",
    },
  })
  ```
  - `order`: ordem da seleção
  ```
  //SELECT * FROM "user"
  ORDER BY "name" ASC, "id" DESC

  userRepository.find({
    order: {
      name: "ASC",
      id: "DESC",
    },
  })
  ```
  - `skip`: O mesmo que o `offset`, dita a partir de onde a busca deve ser feita.
  ```
  //SELECT * FROM "user" OFFSET 5

  userRepository.find({
    skip: 5,
  })
  ```
  - `take`: o mesmo que o `limit`, número máximo de resultados que a busca deve retornar.
  ```
  //SELECT * FROM "user" LIMIT 10

  userRepository.find({
    take: 10,
  })
  ```
### Create

Cria uma nova instância da entidade.
```
const user = repository.create({
    id: 1,
    firstName: "Timber",
    lastName: "Saw",
})
```
### Save
Salva a entidade no banco de dados. Caso a entidade exista, será feito o update, senão será inserido um novo registro. Retorna a entidade salva.
```
await repository.save(user)
```
### Remove / Delete
Remove a entidade do banco. Retorna a entidade removida.
```
await repository.remove(user)
await repository.delete(1) // Remove pelo id
```
### Delete



## Migrações

É uma forma de sincronizar as alterações no domelo do banco de dados, se trata de um arquivo com querys em SQL para atualizar um esquema de banco de dados e aplicar novas alterações a um banco de dados existente.

Isso requer o uso da [CLI do typeORM](https://typeorm.io/migrations#:~:text=Pr%C3%A9%2Drequisitos%20%3A-,Instalando%20CLI,-Antes%20de%20criar).

 Precismos também adicionar a propriedade `migrations`às options do DataSource, pois dali que o TypeORM vai saber quais migrações devem ser carregadas.
 ```
 {
  migrations: [/*...*/]
 }
 ```

 A partir daí já pode criar as migrations através da CLI

 `typeorm migration:create ./src/migrations/InitialMigration`


 Após vai gerar um arquivo com o nome `{TIMESTAMP}-InitialMigration.ts `

 Dentro dele, vai ter a classe de migração com 2 métodos: `up`e `down`.

 - `up`: contém o código que vai gerar a migração.
 - `down`: código que vai reverter a migração.

 Denter deses métodos terá o `QueryRunner` que terá a query para o banco.

 ```
 import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialMigrationTIMESTAMP implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" RENAME COLUMN "title" TO "name"`,
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" RENAME COLUMN "name" TO "title"`,
        )
    }
}
```

O comando `typeorm migration:generate ./src/migrations/InitialMigration -d ./data-source.ts` vai gerar as migrações automaticamente de acordo com os schemas que você criou.

Para rodar as migraçes use o comando:  `typeorm migration:run -- -d path-to-datasource-config`.

Esse comando irá rodar todas as migrações pendentes por ordem de criação, executando o métodos `up`deles.

Para reverter as migrações, executando o métodos `down`deles, use o comando: `typeorm migration:revert -- -d path-to-datasource-config`.

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