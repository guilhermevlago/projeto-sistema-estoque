const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { autenticar, autorizar } = require('./middlewares/auth');

const app = express();

// ===== CORS CONFIGURADO PARA O RAILWAY =====
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ===== SERVE ARQUIVOS ESTÁTICOS - CORRIGIDO =====
app.use(express.static(path.join(__dirname, '../public')));

// ===== ROTA PARA PÁGINA INICIAL - CORRIGIDA =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ===== ROTA DE LOGIN (SEM PROTEÇÃO) =====
app.use('/api/login', require('./routes/login'));

// ===== ROTAS PROTEGIDAS =====
app.use('/api/usuarios', autenticar, autorizar([3]), require('./routes/usuarios'));
app.use('/api/produtos', autenticar, autorizar([1, 2, 3]), require('./routes/produtos'));
app.use('/api/movimentacoes', autenticar, autorizar([1, 2, 3]), require('./routes/movimentacoes'));
app.use('/api/locais', autenticar, autorizar([2, 3]), require('./routes/locais'));

// ===== ROTA DE SAÚDE =====
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ===== INICIAR SERVIDOR - BIND PARA RAILWAY =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
