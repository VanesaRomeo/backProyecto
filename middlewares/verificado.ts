import { NextFunction, Request, Response } from "express";

export const verificado = (req: Request, res: Response, next: NextFunction) => {

    const { verificar } = req.body.usuarioConfirmado;

    if (!verificar) {
        res.status(401).json({
            msg: "El usuario no está correctamente verificado"
        })
        return
    }

    next();
}