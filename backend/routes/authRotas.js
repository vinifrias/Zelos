import express from 'express';
import passport from '../config/ldap.js';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Debug: verifique os dados recebidos
    console.log('Dados recebidos:', { username, password });

    // 1. Busca o usuário no banco
    const usuario = await read('usuarios', `email = '${username}'`);
    console.log('Resultado da busca:', usuario);

    if (!usuario) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 2. Compara a senha
    const senhaValida = await compare(password, usuario.senha);
    console.log('Resultado da comparação:', senhaValida);

    if (!senhaValida) {
      console.log('Senha incorreta');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. Gera o token
    const token = jwt.sign(
      { 
        id: usuario.id,
        funcao: usuario.funcao 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // 4. Retorna resposta
    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.funcao
      }
    });

  } catch (error) {
    console.error('Erro completo no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// router.post('/login', (req, res, next) => {
//   // Middleware de autenticação com tratamento de erros
//   passport.authenticate('ldapauth', { session: true }, (err, user, info) => {
//     try {
//       if (err) {
//         console.error('Erro na autenticação:', err);
//         return res.status(500).json({ error: 'Erro interno no servidor' });
//       }
      
//       if (!user) {
//         console.warn('Falha na autenticação:', info?.message || 'Credenciais inválidas');
//         return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
//       }

//       // Loga o usuário manualmente para garantir a sessão
//       req.logIn(user, (loginErr) => {
//         if (loginErr) {
//           console.error('Erro ao criar sessão:', loginErr);
//           return res.status(500).json({ error: 'Erro ao criar sessão' });
//         }

//         console.log('Usuário autenticado:', user.username);
//         return res.json({ 
//           message: 'Autenticado com sucesso', 
//           user: {
//             username: user.username,
//             displayName: user.displayName,
//             email: user.mail
//           }
//         });
//       });
//     } catch (error) {
//       console.error('Erro inesperado:', error);
//       res.status(500).json({ error: 'Erro inesperado no servidor' });
//     }
//   })(req, res, next);
// });

// Rota de Logout
router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.username);
  
  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }
    
    // Destrói a sessão completamente
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }
      
      res.clearCookie('connect.sid'); // Remove o cookie de sessão
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Rota para verificar autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ 
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
});

export default router;