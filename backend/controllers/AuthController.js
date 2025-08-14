import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const loginController = async (req, res) => {
  const { username, password } = req.body;

  const senhaValida = await compare(password, usuario.senha);
  console.log('Detalhes da comparação:', {
    senhaDigitada: password,
    hashNoBanco: usuario.senha,
    resultado: senhaValida,
    comparandoCom: await bcrypt.hash(password, 10) // Gera um novo hash para comparação visual
  });

  try {
    // 1. Busca o usuário com prepared statement
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [username]
    );

    if (rows.length === 0) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = rows[0];
    console.log('Usuário encontrado:', {
      id: usuario.id,
      email: usuario.email,
      senhaHash: usuario.senha
    });

    // 2. Comparação de senha
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    console.log('Resultado da comparação:', senhaValida);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. Geração do token
    const token = jwt.sign(
      { id: usuario.id, funcao: usuario.funcao },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

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
    console.error('Erro completo:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

export { loginController };