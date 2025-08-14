// controllers/chamadosController.js
import * as Chamado from '../models/Chamado.js';

export const criar = async (req, res) => {
    try {
        const novoChamado = await Chamado.criar({
            ...req.body,
            usuario_id: req.usuarioId
        });
        res.status(201).json(novoChamado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};