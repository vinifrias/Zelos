// models/Usuario.js
import { create, read, update } from '../config/database.js';

export const buscarPorEmail = async (email) => {
    return await read('usuarios', `email = '${email}'`);
};

export const criarUsuario = async (dados) => {
    return await create('usuarios', dados);
};