# Guia de Instalação Rápida

## Pré-requisitos:
- Node.js 
- MySQL 
- Git

## Passos:

### 1. Clone e instale dependências
```bash
git clone https://github.com/guilhermevlago/projeto-sistema-estoque.git
cd projeto-sistema-estoque
npm install
```

### 2. Configure o banco de dados
```bash
# No MySQL:
mysql -u root -p
source db/instalacao_completa.sql
```

### 3. Configure o arquivo .env
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações do MySQL
```

### 4. Execute o sistema
```bash
npm start
```

### 5. Acesse o sistema
- URL: http://localhost:3001
- Usuário: `admin`
- Senha: `admin123`

**Importante: altere a senha após o primeiro acesso!**

## Problemas comuns:

### MySQL não conecta
- Verifique se o serviço está executando
- Confira as credenciais no arquivo `.env`

### Porta ocupada
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### Token inválido
- Limpe o cache do navegador
- Faça login novamente

---

Para instruções detalhadas, consulte o README.md
