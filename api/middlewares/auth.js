const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação
 * Verifica se o token JWT fornecido no cabeçalho Authorization é válido
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para prosseguir para o próximo middleware
 */
function autenticar(req, res, next) {
  // Extrai o cabeçalho Authorization da requisição
  const authHeader = req.headers.authorization;
  
  // Verifica se o cabeçalho Authorization foi fornecido
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

  // Extrai o token do formato "Bearer <token>"
  const [, token] = authHeader.split(' ');
  
  // Verifica se o token foi extraído corretamente
  if (!token) return res.status(401).json({ error: 'Token mal formatado.' });

  // Verifica a validade do token JWT usando a chave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Se houve erro na verificação, o token é inválido
    if (err) return res.status(401).json({ error: 'Token inválido.' });
    
    // Se o token é válido, adiciona os dados do usuário à requisição
    req.user = user;
    
    // Prossegue para o próximo middleware ou rota
    next();
  });
}

/**
 * Middleware de autorização
 * Verifica se o usuário tem o perfil necessário para acessar o recurso
 * @param {Array} perfisPermitidos - Array com os perfis que podem acessar o recurso
 * @returns {Function} Middleware que verifica a autorização
 * 
 * Perfis do sistema:
 * - 1: Operador (acesso limitado - apenas consultas)
 * - 2: Supervisor (acesso intermediário - pode cadastrar e editar)
 * - 3: Administrador (acesso total - pode fazer tudo, incluir usuários)
 */
function autorizar(perfisPermitidos) {
  return (req, res, next) => {
    // Verifica se o perfil do usuário está na lista de perfis permitidos
    if (!perfisPermitidos.includes(req.user.perfil)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    
    // Se o usuário tem permissão, prossegue para o próximo middleware ou rota
    next();
  };
}

// Exporta as funções para uso em outras partes da aplicação
module.exports = { autenticar, autorizar };