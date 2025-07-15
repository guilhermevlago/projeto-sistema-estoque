const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Rota de autenticação de usuário
 * POST /api/login
 * Verifica credenciais e retorna token JWT se válidas
 */
router.post('/', async (req, res) => {
  // Extrai usuário e senha do corpo da requisição
  const { usuario, senha } = req.body;
  
  // Validação básica dos campos obrigatórios
  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }
  
  try {
    // Busca o usuário no banco de dados pelo nome de usuário
    const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
    
    // Verifica se o usuário existe
    if (rows.length === 0) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });

    const user = rows[0];
    
    // Verifica se a senha fornecida corresponde à senha armazenada no banco de dados
    const senhaCorreta = senha === user.senha;

    // Verifica se a senha está correta
    if (!senhaCorreta) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });

    // Gera token JWT com dados do usuário e tempo de expiração
    const token = jwt.sign(
      { 
        id: user.id,        // ID do usuário para identificação
        perfil: user.perfil, // Perfil para controle de acesso
        nome: user.nome     // Nome para exibição na interface
      },
      process.env.JWT_SECRET, // Chave secreta para assinar o token
      { expiresIn: '8h' }     // Token válido por 8 horas
    );
    
    // Retorna o token e dados básicos do usuário
    res.json({ 
      token, 
      perfil: user.perfil, 
      nome: user.nome 
    });
    
  } catch (err) {
    // Captura e retorna erros do banco de dados ou outros erros internos
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;