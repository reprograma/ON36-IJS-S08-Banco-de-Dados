CREATE DATABASE db_teste;

DROP DATABASE db_teste;

CREATE TABLE clientes (
    cod_cliente INT PRIMARY KEY,
    nome_cliente VARCHAR(20) NOT NULL,
    sobrenome_cliente VARCHAR(40) NOT NULL
);

CREATE TABLE produtos (
    cod_produto INT PRIMARY KEY,
    nome_produto VARCHAR(30) NOT NULL,
    descricao TEXT NULL,
    preco NUMERIC CHECK(preco > 0) NOT NULL,
    qtd_estoque SMALLINT DEFAULT 0
);

CREATE TABLE pedidos (
    cod_pedido SERIAL PRIMARY KEY,
    cod_cliente INT NOT NULL REFERENCES clientes(cod_cliente),
    cod_produto INT NOT NULL,
    qtd SMALLINT NOT NULL,
    FOREIGN KEY (cod_produto) REFERENCES produtos(cod_produto)
);

INSERT INTO clientes (cod_cliente, nome_cliente, sobrenome_cliente)
VALUES (1, 'Monica', 'Craveiro');

INSERT INTO clientes (cod_cliente, nome_cliente, sobrenome_cliente)
VALUES (2, 'Ana Luiza', 'Sampaio');

INSERT INTO clientes (cod_cliente, nome_cliente, sobrenome_cliente)
VALUES (3, 'Jéssica', 'Félix');

SELECT * FROM clientes;

INSERT INTO produtos (cod_produto, nome_produto, descricao, preco, qtd_estoque)
VALUES 
(1, 'Álcool Gel', 'Garrafa de álcool em gel de 1L', 12.90, 20),
(2, 'Luvas de Látex', 'Caixa de Luvas de látex com 100 unidades', 32.50, 25),
(3, 'Pasta de Dentes', 'Tubo de pasta de dentes de 90g', 3.60, 12),
(4, 'Sabonete', 'Sabonete antibacteriano', 3.50, 5),
(5, 'Enxaguante Bucal', 'Antiséptico Bucal de 500ml', 17.00, 28),
(6, 'Detergente', 'Detergente líquido de 500ml', 1.89, 32),
(7, 'Leite Integral', 'Leite integral caixa de 1L', 4.60, 70),
(8, 'Refrigerante', 'Garrafa de refrigerante de 600ml', 3.70, 14),
(9, 'Refrigerante', 'Garrafa de refrigerante de 1L', 6.89, 16),
(10, 'Refrigerante', 'Lata de refrigerante de 350ml', 2.99, 45);

INSERT INTO produtos (cod_produto, nome_produto, preco, qtd_estoque)
VALUES 
(11, 'Margarina', 3.20, 8);

SELECT * FROM produtos;

INSERT INTO pedidos (cod_cliente, cod_produto, qtd)
VALUES 
(1, 2, 3),
(2, 3, 2),
(1, 3, 4);

SELECT * FROM pedidos;

SELECT nome_cliente FROM clientes;

SELECT nome_cliente, sobrenome_cliente FROM clientes;

SELECT sobrenome_cliente, nome_cliente FROM clientes;

SELECT nome_produto FROM produtos;

SELECT nome_produto, descricao FROM produtos;

SELECT nome_produto, preco, descricao FROM produtos;

SELECT * FROM clientes WHERE cod_cliente = 1;

SELECT * FROM clientes WHERE cod_cliente = 2;

SELECT * FROM clientes WHERE cod_cliente = 3;

SELECT * FROM clientes WHERE cod_cliente = 4;

SELECT nome_produto, qtd_estoque FROM produtos WHERE qtd_estoque < 10;

SELECT nome_produto, preco FROM produtos WHERE preco >= 15.00;

SELECT cod_produto, qtd FROM pedidos WHERE cod_cliente = 1;

SELECT * FROM produtos ORDER BY nome_produto;

SELECT * FROM produtos ORDER BY qtd_estoque DESC;

SELECT nome_produto, preco FROM produtos ORDER BY nome_produto;

SELECT nome_produto, preco FROM produtos ORDER BY nome_produto, preco;

SELECT nome_produto, descricao FROM produtos ORDER BY descricao;

SELECT nome_produto, descricao FROM produtos ORDER BY descricao NULLS FIRST;

SELECT nome_produto, descricao FROM produtos ORDER BY descricao NULLS LAST;

SELECT nome_produto, preco FROM produtos WHERE preco > 10.00  ORDER BY preco;

SELECT nome_produto, preco FROM produtos WHERE preco > 10.00  ORDER BY preco DESC;

SELECT * FROM produtos ORDER BY preco LIMIT 4;

SELECT * FROM produtos ORDER BY preco DESC LIMIT 3;

SELECT * FROM produtos ORDER BY preco DESC LIMIT 3 OFFSET 2;

SELECT * FROM produtos ORDER BY preco DESC OFFSET 2;

SELECT * FROM produtos ORDER BY preco DESC LIMIT ALL;

SELECT * FROM produtos ORDER BY preco DESC OFFSET 0;

SELECT * FROM produtos LIMIT 4;

SELECT nome_produto, preco FROM produtos WHERE preco > 12.00;

SELECT nome_produto, qtd_estoque FROM produtos WHERE qtd_estoque <= 20 AND qtd_estoque > 10;

SELECT nome_produto, qtd_estoque FROM produtos WHERE nome_produto != 'Refrigerante';

SELECT nome_produto, preco FROM produtos WHERE preco BETWEEN 10.00 AND 20.00;

SELECT nome_produto, preco FROM produtos WHERE preco BETWEEN 3.50 AND 5.00 OR preco BETWEEN 10.00 AND 20.00;

SELECT nome_produto, preco, qtd_estoque FROM produtos WHERE preco BETWEEN 2.00 AND 6.00 AND qtd_estoque < 10;

SELECT nome_produto, preco FROM produtos WHERE preco NOT BETWEEN 5.00 AND 12.00;

UPDATE produtos SET descricao = 'Pode de margarina vegetal' WHERE cod_produto = 11;

UPDATE produtos SET preco = 3.95 WHERE nome_produto = 'Sabonete';

UPDATE produtos SET qtd_estoque = qtd_estoque - 4 WHERE preco > 15.00;

UPDATE produtos SET preco = preco * 1.10;

INSERT INTO produtos (cod_produto, nome_produto, descricao, preco, qtd_estoque)
VALUES 
(12, 'Sabão em Pó', 'Caixa de sabão em pó de 1/2Kg', 12.50, 5),
(13, 'Biscoito', 'Pacote de Biscoito integral 110g', 3.45, 16),
(14, 'Manteiga', 'Pote de manteiga 250g', 8.70, 5);

DELETE FROM produtos WHERE cod_produto = 12;

DELETE FROM produtos WHERE nome_produto = 'Manteiga';

DELETE FROM produtos WHERE qtd_estoque <= 5;

INSERT INTO pedidos (cod_cliente, od_produto, qtd)
VALUES 
(1, 2, 3),
(2, 3, 2),
(1, 3, 4),
(2, 6, 3),
(2, 5, 2),
(3, 8, 5);

SELECT COUNT(*) FROM clientes;

SELECT COUNT(*) AS 'Qtd Clientes' FROM clientes;

SELECT COUNT(nome_cliente) FROM clientes;

SELECT COUNT(nome_produto) FROM produtos;

SELECT COUNT(DISTINCT nome_produto) FROM produtos;

SELECT COUNT(*) FROM produtos WHERE preco >= 10.00;

SELECT MAX(preco) FROM produtos;

SELECT MIN(preco) FROM produtos;

SELECT SUM(preco) FROM produtos;

SELECT AVG(preco) FROM produtos;

SELECT ROUND(AVG(preco), 2) FROM produtos;

SELECT ROUND(AVG(preco), 2) FROM produtos WHERE nome_produto = 'Refrigerante'; 

SELECT pedidos.cod_pedido, produtos.nome_produto, pedidos.qtd FROM pedidos INNER JOIN produtos ON pedidos.cod_produto = produtos.cod_produto;

SELECT pe.cod_pedido, pr.nome_produto, pe.qtd FROM pedidos pe INNER JOIN produtos pr ON pe.cod_produto = pr.cod_produto WHERE pe.cod_pedido = 9;

SELECT pe.cod_pedido, cl.nome_cliente, pr.nome_produto, pe.qtd FROM pedidos pe INNER JOIN produtos pr ON pe.cod_produto = pr.cod_produto INNER JOIN cliente cl ON pe.cod_cliente = cl.cod_cliente WHERE pe.cod_pedido = 9;

SELECT pe.cod_pedido, cl.nome_cliente, pr.nome_produto pedidos pe INNER JOIN produtos pr ON pe.cod_produto = pr.cod_produto INNER JOIN cliente cl ON pe.cod_cliente = cl.cod_cliente WHERE cl.cod_cliente = 1;