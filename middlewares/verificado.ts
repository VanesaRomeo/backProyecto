// middlewares/verificado.ts
import { NextFunction, Request, Response } from "express";
import User from "../models/users"; // ajustá la ruta si tu modelo se llama distinto

export const verificado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.usuarioConfirmado?.id;         // <-- viene de jwtConfirmar
    if (!id) return res.status(401).json({ msg: "No autenticado" });

    const user = await User.findById(id).select("verified");
    if (!user) return res.status(401).json({ msg: "Usuario no encontrado" });
    if (!user.verified) {
      return res.status(401).json({ msg: "El usuario no está correctamente verificado" });
    }

    next();
  } catch (e) {
    console.error("verificado error:", e);
    res.status(500).json({ msg: "Error en verificación" });
  }
};
