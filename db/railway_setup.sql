-- ===================================================
-- SCRIPT PARA RAILWAY - SISTEMA DE ESTOQUE
-- ===================================================

-- No Railway, o banco 'railway' já existe
USE railway;

-- ===================================================
-- CRIANDO AS TABELAS
-- ===================================================

-- Tabela: usuario
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perfil` int NOT NULL COMMENT '1=Operador, 2=Supervisor, 3=Administrador',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: local_estoque
CREATE TABLE `local_estoque` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: produto
CREATE TABLE `produto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marca` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localizacao_fisica` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_venda` decimal(10,2) DEFAULT NULL,
  `estoque_atual` int DEFAULT NULL,
  `estoque_minimo` int DEFAULT NULL,
  `eh_kit` tinyint(1) DEFAULT NULL,
  `quantidade_por_kit` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: movimentacao
CREATE TABLE `movimentacao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `produto_id` bigint NOT NULL,
  `tipo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'entrada/saida/ajuste/edicao',
  `quantidade` int NOT NULL,
  `responsavel_id` bigint NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku_anterior` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_anterior` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao_anterior` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria_anterior` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marca_anterior` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localizacao_fisica_anterior` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_venda_anterior` decimal(10,2) DEFAULT NULL,
  `estoque_atual_anterior` int DEFAULT NULL,
  `estoque_minimo_anterior` int DEFAULT NULL,
  `eh_kit_anterior` tinyint(1) DEFAULT NULL,
  `quantidade_por_kit_anterior` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_movimentacao_produto` (`produto_id`),
  KEY `fk_movimentacao_responsavel` (`responsavel_id`),
  CONSTRAINT `fk_movimentacao_produto` FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`),
  CONSTRAINT `fk_movimentacao_responsavel` FOREIGN KEY (`responsavel_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- DADOS INICIAIS
-- ===================================================

-- Usuario admin padrão
INSERT INTO usuario (nome, usuario, senha, perfil) VALUES 
('Admin do Sistema', 'admin', 'admin123', 3);

-- Outros usuários de teste
INSERT INTO usuario (nome, usuario, senha, perfil) VALUES 
('João Silva', 'joao', 'senha123', 2),
('Maria Santos', 'maria', 'senha123', 1);

-- Locais de estoque básicos
INSERT INTO local_estoque (nome, ativo) VALUES 
('Estoque Principal', 1),
('Almoxarifado', 1),
('Área de Expedição', 1),
('Quarentena', 1);

-- Alguns produtos de exemplo
INSERT INTO produto (sku, nome, descricao, categoria, marca, localizacao_fisica, preco_venda, estoque_atual, estoque_minimo, eh_kit, quantidade_por_kit) VALUES 
('PROD001', 'Notebook Dell', 'Notebook para trabalho', 'Informática', 'Dell', 'Estoque Principal', 2500.00, 10, 5, 0, NULL),
('PROD002', 'Mouse Logitech', 'Mouse sem fio', 'Informática', 'Logitech', 'Estoque Principal', 89.90, 25, 10, 0, NULL),
('PROD003', 'Kit Completo', 'Notebook + mouse', 'Informática', 'Vários', 'Estoque Principal', 2650.00, 5, 2, 1, 2),
('PROD004', 'Papel A4', 'Resma 500 folhas', 'Papelaria', 'Chamex', 'Almoxarifado', 25.90, 100, 20, 0, NULL);

-- Algumas movimentações de teste
INSERT INTO movimentacao (produto_id, tipo, quantidade, responsavel_id, motivo, observacao) VALUES 
(1, 'entrada', 10, 1, 'Compra inicial', 'Primeira entrada'),
(2, 'entrada', 25, 1, 'Compra inicial', 'Primeira entrada'),
(3, 'entrada', 5, 1, 'Compra inicial', 'Primeira entrada'),
(4, 'entrada', 100, 1, 'Compra inicial', 'Primeira entrada'),
(1, 'saida', 2, 2, 'Venda', 'Vendido para cliente'),
(2, 'saida', 5, 2, 'Venda', 'Junto com os notebooks');

-- ===================================================
-- VERIFICAÇÃO
-- ===================================================

SELECT 'SETUP CONCLUÍDO NO RAILWAY!' as status;
SELECT COUNT(*) as total_usuarios FROM usuario;
SELECT COUNT(*) as total_produtos FROM produto;
SELECT COUNT(*) as total_locais FROM local_estoque;
SELECT COUNT(*) as total_movimentacoes FROM movimentacao;
