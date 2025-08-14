import express from 'express';
import { create, readAll } from '../config/database.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Listar chamados (exemplo básico)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chamados = await readAll('chamados');
    res.json(chamados);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar chamados" });
  }
});

// Criar chamado (sem validações complexas)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo, descricao, patrimonio, tipo_id } = req.body;
    const chamadoId = await create('chamados', { 
      titulo, 
      descricao, 
      patrimonio, 
      tipo_id,
      usuario_id: req.usuarioId,
      status: 'pendente'
    });
    res.status(201).json({ id: chamadoId });
  } catch (error) {
    res.status(400).json({ erro: "Dados inválidos" });
  }
});

export default router;