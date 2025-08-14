// models/Chamado.js
import { create, readAll, read, update } from '../config/database.js';

export const criarChamado = async (dados) => {
    // Validação de patrimônio duplicado
    const chamadoExistente = await read(
        'chamados', 
        `patrimonio = '${dados.patrimonio}' AND status IN ('pendente', 'em_andamento')`
    );
    if (chamadoExistente) throw new Error('Já existe chamado aberto para este patrimônio');
    
    return await create('chamados', dados);
};