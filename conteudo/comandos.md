# Comandos (Querys)

**Comando** ou **Query** (em inglês) é um  "pedido" de uma informação ou de um dado, também é conhecido como consulta, solicitação ou requisição. Vai realizar a leitura de dados dentro de um banco de dados.

Essa leitura é feita com base em uma série de comandos feitos a partir da linguagem SQL.

Existem comandos que funcionam em Bancos de Dados específicos como o comando **GO** qu só funciona na linguagem **Transact-SQL** da Microsoft, ou o comando **DESC** que só existe na linguagem **PL-SQL** da Oracle, porém temos diversos comandos universais como o **INSERT**, **SELECT**, **ALTER** onde suas sintaxes são muito parecidas entre os Bancos de Dados.

## Grupos de Comandos SQL

- **DDL (Data Definition Language)**: Esse grupo possui comandos para definir e administrar objetos do banco de Dados.
    - CREATE
    - ALTER
    - DROP
- **DCL (Data Control Language)**: Esse grupo possui comandos para controlar o acesso aos dados.
    - GRANT
    - REVOKE
    - DENY
- **DML (Data Manipulation Language)**: É o grupo responsável por adicionar, modificar e excluir dados dentro das tabelas.
    - INSERT INTO
    - UPDATE
    - DELETE FROM
- **DQL (Data Query Language)**: Este grupo ajuda você a consultar e buscar dados do banco de dados.
    - SELECT
    - FROM
    - WHERE
- **DTL (Data Transaction Language)**: É o grupo que utilizamos quando é necessário gerenciar transações feitas no banco.
    - COMMIT
    - BEGIN
    - ROLLBACK

Geralmente os dois primeiros grupos são mais utilizados por DBAs (DataBase Administrators), já os demais grupos são mais virados para o público em geral porque saber trabalhar com banco de dados te ajuda a ser muito mais rápido e efetivo nas soluções e no dia-a-dia.

<img src="../assets/comandos/subconjuntos-sql.png" alt="Bancos de dados NoSQL" width="600">

## Principais Tipos de dados

São os tipos que podemos usar na criação de colunas nas tabelas dos Bancos de Dados. O PostgreSQL tam muitos tipos já pré definidos, mas também podemos definir um tipo personalizado usando o comando **CREATE TYPE**.

- **smallint**: Valores inteiros de 2 bytes
- **int**: Valores inteiros de 4 bytes
- **bigint**: Valores inteiros de 8 bytes
- **Numeric(p, s)**: Valores numéricos onde podemos selecionar a precisão (**numeric(5,2)**)
- **real**: 32 bits com até 6 digditos decimais
- **double precision**: 64 bits - variável com até 15 digditos decimais
- **serial**: 32 bits, com sinal e números sequenciais
- **big serial**: 64 bits, com sinal e números sequenciais
- **money**: 64 bits, com sinal. Valores monetários
- **text**: varchar ilimitado
- **char(n) ou character(n)**: Cadeia de caracteres de tamanho **n** fixo, com padding
- **varchar(n)**: varchar limitado a **n** caracteres.
- **date**: Valores de data (**ano, mês e dia**)
- **time**: Valores de hora (**hora, minuto e segundo**) sem fuso horário.
- **timestamp**: Valores de data e hora (**ano, mês, dia, hora, minuto e segundo**) com fuso horário.
- **interval**: armazena faixas de tempo.
- **boolean**: Valores lógicos verdadeiro (**TRUE**) ou falso (**FALSE**)

[Todos os Tipos de Dados do PostgreSQL](https://www.postgresql.org/docs/current/datatype.html)

## Operadores Lógicos

Compara dois valores e retorna o valor booleano resultante da operação.

- Diferente: **!=** ou **<>**
- Igual a: **=**
- Maior ou Maior ou igual: **>** ou **>=**
- Menor ou Menor ou igual: **<** ou **<=**
- Grupo de itens: **IN**
- Entre valores: **BETWEEN**

## Operadores Aritméticos

- **-**: Subtração
- **^**: Exponenciação
- *: Multiplicação
- **/**: Divisão
- **+**: Soma
- **%**: Módulo da divisão
- **|/**: raiz quadrada
- **||/**: raiz cúbica
- **@**: valor absoluto


## Funções de agregação (aggregate functions)

São funções que são usadas para computar um valor único a partir de valores de entrada.

- **COUNT**: Contagem de valores da coluna ou expressão
- **MAX**: Maior valor da coluna
- **MIN**: Menor valor da coluna
- **AVG**: Média dos valores
- **SUM**: Soma todos os valores

# Chave Primária

**Chave primária** (**Primary Key**) é o campo que identifica a tabela de maneira única. Cada tabela pode ter apenas uma única chave primária e esse valor não pode ser repetido, justamente por essa característica é usada para os relacionamentos.

# Chave Estrageira

**Chave estrangeira** (**Foreign Key**) é o campo que contém o dado que referencia outra tabela e estabelece o relacionamento entre elas.

# Índices

Índices são usados para otimizar as buscas, permite acesso mais rápido e eficiente aos dados, é muito utilizado em tabelas muito grandes.

E por que eles são importantes?

- **Melhor desempenho das consultas**: Os índices permitem que o banco de dados localize rapidamente os registros que correspondem aos critérios de busca, resultando em consultas mais rápidas e eficientes.

- **Redução da carga de trabalho do servidor**: Com índices adequados, o banco de dados pode evitar a necessidade de ler todas as linhas de uma tabela para executar uma consulta. Isso reduz a carga de trabalho do servidor e melhora o tempo de resposta.

- **Suporte a restrições de chave única**: Os índices podem ser usados para garantir a unicidade dos valores em uma coluna ou conjunto de colunas, permitindo a definição de restrições de chave única.

- **Ordenação eficiente**: Os índices permitem que os dados sejam armazenados de forma ordenada, facilitando a execução de consultas com base em ordem crescente ou decrescente.

- **Melhor desempenho de junções**: Os índices também podem melhorar o desempenho de operações de junção entre tabelas, ajudando o banco de dados a encontrar rapidamente os registros relacionados.

**Tipos de Índices**

- **Índice B-Tree**: É o tipo de índice mais comum no PostgreSQL. Ele funciona bem para colunas com valores repetidos e permite a busca rápida e eficiente.

- **Índice Hash**: É adequado para consultas de igualdade (exatamente igual) em colunas. É mais eficiente quando os valores de coluna são distribuídos uniformemente.

- **Índice GiST (Generalized Search Tree)**: É um tipo de índice genérico que suporta vários tipos de dados e operadores. É útil para consultas espaciais, pesquisa de texto e muito mais.

- **Índice GIN (Generalized Inverted Index)**: É otimizado para consultas com base em listas de valores. É usado principalmente para pesquisa de texto e pesquisa de listas.

# Comandos SQL

## CREATE DATABASE

Cria um Banco de Dados

- Sintaxe:

**CREATE DATABASE** nome_do_banco
**WITH**
**OWNER =** proprietário
**ENCODING =** "UTF8"
**LC_COLLATE =** 'pt_BR.UTF-8'
**LC_TYPE =** 'pt_BR.UTF-8'
**TABLESPACE =** pg_default
**CONNECTION LIMIT** -1;

## DROP DATABASE

Exclui um Banco de Dados

- Sintaxe:

**DROP DATABASE** nome_do_banco;

## CREATE TABLE

Cria uma tabela no Banco de Dados.

- Sintaxe:

**CREATE TABLE** nome_da_tabela (
    nome_coluna tipo_dado constraints,
    nome_coluna tipo_dado constraints,
    nome_coluna tipo_dado constraints,
    nome_coluna tipo_dado constraints
);

## ALTER TABLE

Altera uma tabela no Banco de Dados.

- Adicionar coluna:

**ALTER TABLE** table_name 
**ADD COLUMN** column_name datatype column_constraint;

- Excluir coluna:

**ALTER TABLE** table_name 
**DROP COLUMN** column_name;

- Renomear coluna:

**ALTER TABLE** table_name 
**RENAME COLUMN** column_name 
**TO** new_column_name;

- Modificar um valor default:

**ALTER TABLE** table_name 
**ALTER COLUMN** column_name 
[**SET DEFAULT** value | **DROP DEFAULT**];

- Alterar NOT NULL

**ALTER TABLE** table_name 
**ALTER COLUMN** column_name 
[**SET** NOT NULL| **DROP** NOT NULL];

- Alterar nome da tabela

**ALTER TABLE** table_name 
**RENAME TO** new_table_name;


## DROP TABLE

Exclui uma tabela no Banco de Dados.

- Sintaxe:

**DROP TABLE** nome_da_tabela;

## INSERT INTO

Insere um novo registro na tabela.

- Sintaxe:

**INSERT INTO** nome_tabela (coluna1, coluna2, coluna3, ...)
**VALUES** (dado1, dado2, dado3, ...);

## SELECT FROM

Seleciona os campos da tabela que você deseja incluir nos seus resutados.

**Obs**.: Para selecionar todos os campos da tabela usamos o **(*)**

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela

## WHERE

Filtra o resultado de uma consulta. Define condições para restringir os dados retornados.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**WHERE** condicao;

## ORDER BY

Ordena o resultado de acordo com o campo informado. É usado para classificar o conjunto de resultados por ordem crescente (**ASC**) ou decrescente (**DESC**).

Por padrão ele classifica por ordem CRESCENTE, se classificar por ordem decrescente pracisamos usar o DESC.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
[**WHERE** condicao]
**ORDER BY** coluna1, coluna2,... **ASC|DESC**;

## FIRST

Ordena a busca e insere os valores nulos primeiro.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**ORDER BY** coluna1, coluna2,... **NULLS FIRST**;

## LAST

Ordena a busca e insere os valores nulos ao final.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**ORDER BY** coluna1, coluna2,... **NULLS LAST**;

## LIMIT

Limita a quantidade de registros que serão exibidos na consulta.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
[**WHERE** condicao]
[**ORDER BY** coluna1, coluna2,...]
**LIMIT** qtd_limite | ALL;

## OFFSET

Limita a quantidade de registros a partir de uma linha específica que serão exibidos na consulta.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**LIMIT** qtd_limite;
**OFFSET** deslocamento | 0;

## AND

Acrescenta uma nova comparação.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**WHERE** condicao1 **AND** condicao2;

## BETWEEN

Permite filtrar intervalos de dados.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**WHERE** coluna1 [**NOT**] **BETWEEN** condicao1 **AND** condicao2;

## OR

Acrescenta uma nova comparação para filtros mais complexos.

- Sintaxe:

**SELECT** coluna1, coluna2,...
**FROM** nome_da_tabela
**WHERE**
    condicao1 **OR** condicao2;

## UPDATE

Atualiza um registro na tabela.

**Obs¹**.: É muito importante colocar a cláusula **WHERE** nesse comando, senão serão alterados **TODOS** os registros da tabela.

**Obs²**.: na clausula **WHERE** podemos usar **qualquer coluna** e seu valor para realizar a alteração, porém o ideal é ser pelo **índice** para evitar erros.

- Sintaxe:

**UPDATE** nome_da_tabela
**SET** coluna = novo_valor
**WHERE** coluna = valor_coluna;

## DELETE FROM

Exclui linhas específicas de uma tabela.

**Obs¹**.: É muito importante colocar a cláusula **WHERE** nesse comando, senão **TODOS** os registros da tabela serão excluídos.

- Sintaxe:

**DELETE FROM** nome_da_tabela
**WHERE** condição;

## COUNT
Mostra o valor total de linhas que retornam de uma busca.

**Obs**.: Quando usamos o nome de uma coluna para contagem, fique atendo pois ele desconsidera os valores nulos daquela coluna.

- Sintaxe:

**SELECT COUNT**(coluna)
**FROM** nome_da_tabela;

## DISTINCT

Mostra o valor total de linhas que retornam de uma busca, desconsiderando os valores repetidos.

- Sintaxe:

**SELECT COUNT**(**DISTINCT** coluna)
**FROM** nome_da_tabela;

## AS

Altera o nome da coluna que aparece no retorno da busca. Conhecida como ALIAS

- Sintaxe:

**SELECT** 
    coluna1 **AS** aliss_coluna1,
    coluna2 **AS** aliss_coluna2,
    coluna3 **AS** aliss_coluna3,
**FROM** nome_tabela **AS** alias_tabela;

## MAX

Fornece o valor máximo da coluna.

- Sintaxe:

**SELECT MAX**(coluna)
**FROM** nome_tabela;

## MIN

Fornece o valor mínimo da coluna.

- Sintaxe:

**SELECT MIN**(coluna)
**FROM** nome_tabela;

## SUM

Soma a quantidade total do valor desejado na busca.

- Sintaxe:

**SELECT SUM**(coluna)
**FROM** nome_da_tabela;

## GROUP BY

Agrupa campos de uma tabela.

- Sintaxe:

**SELECT** coluna1, coluna2,..., **SUM**(coluna3)
**FROM** nome_da_tabela
**GROUP BY** coluna1

## AVG

Trás a média aritmética dos valores da coluna.

- Sintaxe:

**SELECT AVG**(coluna)
**FROM** nome_da_tabela;

## ROUND

Arredonda valores.

- Sintaxe:

**SELECT ROUND**(**AVG**(coluna), qtd_casas_decimais)
**FROM** nome_da_tabela;

## JOIN

Junta ou agrega dados de diferentes tabelas em um único resultado.

- Sintaxe:

**SELECT** tb2.coluna1, tb1.coluna2,...
**FROM** nome_da_tabela1 tb1
**JOIN** nome_da_tabela2 tb2
**ON** tb1.codigo = tb2.codigo;

Existem vários tipos de **JOIN**s:
- **INNER JOIN**: Retorna resultado quando houver pelo menos uma correspondência entre elas. É a intersecção entre duas tabelas.
    - Sintaxe:

**SELECT** tb2.coluna1, tb1.coluna2,...
**FROM** nome_da_tabela1 tb1
**INNER JOIN** nome_da_tabela2 tb2
**ON** tb1.codigo = tb2.codigo;

- **OUTER JOIN**: Retorna resultado mesmo quando não houver pelo menos uma correnpondência. O **OUTER JOIN** se divide em:
    - **LEFT JOIN**: Retorna todos os registros da tabela esquerda e os registros correspondentes da tabela direita.

    **SELECT** colunas
    **FROM** Tabela A
    **LEFT JOIN** Tabela B
    **ON** A.Key = B.Key;

    - **RIGHT JOIN**: Retorna todos os registros da tabela direita e os registros correspondentes da tabela esquerda.

    **SELECT** colunas
    **FROM** Tabela A
    **RIGHT JOIN** Tabela B
    **ON** A.Key = B.Key;

    - **FULL JOIN**: Retorna todos os registros quando houver uma correspondência na tabela esquerda ou direita.

    **SELECT** colunas
    **FROM** Tabela A
    **FULL JOIN** Tabela B
    **ON** A.Key = B.Key;

<img src="../assets/comandos/joins.avif" alt="Bancos de dados NoSQL" width="600">

## CREATE INDEX

Usado para criar um índice usado na indexação das buscas.

- Sintaxe:

**CREATE INDEX** <nome_do_indice> **ON** <nome_da_tabela> (coluna1, coluna2, ...);

## DROP INDEX

Remove um índice.

- Sintaxe:

**DROP INDEX** nome_do_indice;
