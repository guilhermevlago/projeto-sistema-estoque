# Sistema de Controle de Estoque

Este é o meu projeto de TCC do curso de ### 3. Configurar o banco de dados

Acesse o MySQL e execute o script:
```bash
mysql -u root -p
source db/instalacao_completa.sql
```

Alternativamente, pode importar o arquivo `db/instalacao_completa.sql` pelo phpMyAdmin ou MySQL Workbench.

**Importante:** O script já cria o usuário administrador automaticamente, então você pode pular para o próximo passo.e Sistemas do SENAI.

É um sistema web para controle de estoque - permite cadastrar produtos, fazer entradas e saídas, gerar relatórios, etc.

## Demo online

O sistema está Railway para demonstração: https://projeto-estoque-production.up.railway.app/

*Obs: a hospedagem é temporária durante o período de teste gratuito do Railway*

## Tecnologias utilizadas

### Backend
- Node.js - runtime do servidor
- Express - framework web
- MySQL - banco de dados
- JWT - para autenticação e controle de acesso
- bcryptjs - para criptografia de senhas (não implementei completamente)
- CORS - para evitar problemas de origem cruzada

### Frontend
- HTML, CSS, JavaScript
- Bootstrap 5
- Chart.js - para os gráficos
- jsPDF

## Funcionalidades

### Níveis de usuário
Implementei 3 níveis de acesso:
- **Operador:** pode consultar e fazer movimentações básicas
- **Supervisor:** pode cadastrar produtos e gerar relatórios  
- **Administrador:** acesso completo, incluindo gestão de usuários

### Gestão de produtos
- Cadastro completo (nome, categoria, preço, etc.)
- Controle de estoque atual e mínimo
- Sistema de produtos do tipo "kit"
- Controle de localização física

### Movimentações
- Registro de entradas (compras, recebimentos)
- Registro de saídas (vendas, perdas, transferências)
- Histórico completo de movimentações
- Rastreamento de responsáveis por cada operação

### Relatórios e dashboard
- Dashboard com gráficos estatísticos
- Análise de produtos com maior movimentação
- Exportação para PDF e CSV
- Filtros por período

### Locais de estoque
- Cadastro de locais de armazenamento
- Sistema de ativação/desativação

## Como executar localmente

### Pré-requisitos
- Node.js (estou usando a versão 16)
- MySQL 
- Git

### 1. Clonar o repositório
```bash
git clone https://github.com/guilhermevlago/projeto-sistema-estoque.git
cd projeto-sistema-estoque
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar o banco de dados

Acesse o MySQL e execute o script:
```bash
mysql -u root -p
source db/gerar_controle_estoque.sql
```

Alternativamente, pode importar o arquivo `db/gerar_controle_estoque.sql` pelo phpMyAdmin ou MySQL Workbench.

Depois crie um usuário administrador:
```sql
USE contro_estoque;

INSERT INTO usuario (nome, usuario, senha, perfil) 
VALUES ('Administrador', 'admin', 'admin123', 3);
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha_do_mysql
DB_NAME=contro_estoque
DB_PORT=3306

JWT_SECRET=sua_chave_secreta_aqui

PORT=3001
```

**Importante:** 
- Substitua `sua_senha_do_mysql` pela sua senha do MySQL
- A JWT_SECRET pode ser qualquer string (não precisa ser muito complexa para testes)

### 5. Executar o sistema

```bash
npm start
```

Acesse: http://localhost:3001

### 6. Primeiro acesso

- Usuário: admin
- Senha: admin123

**Lembre-se de alterar a senha após o primeiro login!**

## Estrutura do projeto

```
projeto-sistema-estoque/
├── api/                     # Servidor Node.js
│   ├── db/
│   │   └── pool.js         # Conexão com MySQL
│   ├── middlewares/
│   │   └── auth.js         # Controle de login
│   ├── routes/             # Rotas da API
│   │   ├── locais.js
│   │   ├── login.js
│   │   ├── movimentacoes.js
│   │   ├── produtos.js
│   │   └── usuarios.js
│   └── index.js            # Arquivo principal
├── db/
│   ├── gerar_controle_estoque.sql  # Script básico (apenas estrutura)
│   └── instalacao_completa.sql    # Script completo com dados de teste
├── public/                 # Páginas web
│   ├── css/
│   ├── html/
│   ├── js/
│   └── index.html         # Página de login
├── package.json
└── README.md
```

## Endpoints da API

### Autenticação
- `POST /api/login` - Fazer login

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto específico
- `POST /api/produtos` - Cadastrar produto (Supervisor/Admin)
- `PUT /api/produtos/:id` - Editar produto (Supervisor/Admin)
- `DELETE /api/produtos/:id` - Excluir produto (Admin)

### Movimentações
- `GET /api/movimentacoes` - Visualizar histórico
- `POST /api/movimentacoes` - Registrar entrada/saída

### Usuários
- `GET /api/usuarios` - Listar usuários (Admin)
- `POST /api/usuarios` - Criar usuário (Admin)
- `PUT /api/usuarios/:id` - Editar usuário (Admin)
- `DELETE /api/usuarios/:id` - Excluir usuário (Admin)

### Locais
- `GET /api/locais` - Visualizar locais
- `POST /api/locais` - Criar local
- `PUT /api/locais/:id` - Editar local
- `DELETE /api/locais/:id` - Excluir local

## Problemas conhecidos

Alguns bugs que não consegui resolver a tempo para a apresentação:

- Layout responsivo ainda não está 100% otimizado para mobile
- Exclusão de produtos com movimentações pode gerar erro (falta implementar cascade no banco)

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o MySQL está executando
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `contro_estoque` foi criado

### Problemas com token JWT
- Limpe o localStorage do navegador
- Faça login novamente

### Porta em uso
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <numero> /F
```

## Sobre o projeto

Este é meu projeto de TCC do curso de Desenvolvimento de Sistemas do SENAI. Foi bastante desafiador mas aprendi muito no processo!

Sei que não está perfeito - ainda há várias melhorias que gostaria de implementar - mas para um projeto acadêmico cumpre bem o objetivo de demonstrar os conhecimentos adquiridos durante o curso.

O sistema é funcional para pequenas empresas que precisam de um controle básico de estoque. Para uso em produção, mas sei que ainda necessita de algumas melhorias na segurança e otimizações de performance.

Feedbacks e sugestões são sempre bem-vindos!

### Observações técnicas:

- Algumas funcionalidades ficaram para uma versão futura por limitação de tempo
- Para uso em produção, recomendo implementar hash nas senhas (bcryptjs já está instalado)
- O código pode ser otimizado em alguns pontos, mas priorizo a clareza para fins educacionais

### Melhorias planejadas:
- [ ] Implementação de hash para senhas
- [ ] Mais opções de relatórios
- [ ] Sistema de backup automático  
- [ ] Notificações para estoque baixo
- [ ] Melhor responsividade mobile

---

**Guilherme Vlago** - SENAI 2025