// middlewares/rolesMiddleware.js
export const adminOnly = (req, res, next) => {
    if (req.usuarioFuncao !== 'admin') {
        return res.status(403).json({ erro: 'Acesso restrito' });
    }
    next();
};