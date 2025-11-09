// middleware/jwtConfirmar.ts
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      usuarioConfirmado?: {
        id: string;
      };
    }
  }
}

export const jwtConfirmar = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. leer token. vamos a buscarlo en Authorization: "Bearer <token>"
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "Falta token (Authorization header ausente)" });
    }

    // debería venir como "Bearer asdasdasd.qweqwe.qweqwe"
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ msg: "Formato de token inválido" });
    }

    // 2. verificar token con tu misma clave secreta
    const secreto = process.env.CLAVESECRETA;
    if (!secreto) {
      
      console.error("No existe CLAVESECRETA en process.env");
      return res.status(500).json({ msg: "Config del servidor incompleta" });
    }

    const decoded = jwt.verify(token, secreto) as JwtPayload;

 
    if (!decoded || !decoded.id) {
      return res.status(401).json({ msg: "Token inválido (sin id)" });
    }

    // 3. guardamos el id en req para usarlo después en los controladores
    req.usuarioConfirmado = {
      id: decoded.id as string,
    };

    // 4. seguir al siguiente middleware / controlador
    next();
  } catch (err) {
    console.error("jwtConfirmar error:", err);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
