// routes/auth.ts
import { Router } from "express";
import { check } from "express-validator";
import { registro, logeo, verificarUsuario, reenviarCodigo } from "../controladores/controllers";
import { losErores } from "../middlewares/losErores";
import { jwtConfirmar } from "../middlewares/jwtConfirmar";
import User from "../models/users";

const auth = Router();

/**
 * Registro
 * POST /api/auth/registro
 */
auth.post(
  "/registro",

  [
    check("nombre").trim().isLength({ min: 1 }).withMessage("nombre requerido"),
    check("email").trim().isEmail().withMessage("email inválido"),
    check("contraseña").isLength({ min: 6 }).withMessage("contraseña mínima 6"),
    losErores,
  ],
  registro
);


/**
 * Login
 * POST /api/auth/login
 */
auth.post(
  "/login",
  [
    check("email", "email inválido").trim().normalizeEmail().isEmail(),
    check("contraseña", "contraseña requerida").notEmpty(),
    losErores,
  ],
  logeo
);

/**
 * Verificar cuenta
 * POST /api/auth/verify
 */
auth.post(
  "/verify",
  [
    check("email", "email inválido").trim().normalizeEmail().isEmail(),
    check("code", "código requerido").trim().notEmpty(),
    losErores,
  ],
  verificarUsuario
);

/**
 * Reenviar código
 * POST /api/auth/resend
 */
auth.post(
  "/resend",
  [
    check("email", "email inválido").trim().normalizeEmail().isEmail(),
    losErores,
  ],
  reenviarCodigo
);

/**
 * Perfil del usuario autenticado
 * GET /api/auth/me
 * Requiere: Authorization: Bearer <token>
 */
auth.get("/me", jwtConfirmar, async (req, res) => {
  try {
    const id = req.usuarioConfirmado!.id; // viene del middleware
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Gracias a toJSON del schema no se exponen campos sensibles
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ msg: "Error al obtener el perfil" });
  }
});

export default auth;
