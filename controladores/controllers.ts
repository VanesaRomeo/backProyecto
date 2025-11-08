// controladores/controllers.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Randomstring from "randomstring";

import User from "../models/users";
import { ROLES } from "../helpers/constantes";
import { enviarEmail } from "../nodemeiler/mailer"; // <-- verifica la ruta
import crearToken from "../helpers/crearToken";

/**
 * POST /api/auth/registro
 */
export const registro = async (req: Request, res: Response) => {
  try {
    // 1) normalizar
    const nombre = (req.body.nombre ?? "").toString().trim();
    const email = (req.body.email ?? "").toString().toLowerCase().trim();
    const contraseña = (req.body.contraseña ?? "").toString();

    // 2) existe?
    const yaExiste = await User.findOne({ email });
    if (yaExiste) {
      return res.status(409).json({ msg: "email ya registrado" });
    }

    // 3) hash
    const sal = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(contraseña, sal);

    // 4) crear doc
    const user = new User({
      nombre,
      email,
      contraseña: hash,
      rol: ROLES.user,
      verified: false,
      code: Randomstring.generate({ length: 6, charset: "numeric" }),
      codeExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    // 5) admin opcional por header
    if (req.headers["administrador"] === process.env.CLAVEDELADMIN) {
      user.rol = ROLES.admin;
    }

    // 6) guardar
    await user.save();

    // 7) mail (no romper si falla)
    try {
      await enviarEmail(user.email, user.code!, "registro");
    } catch (e) {
      console.error("No se pudo enviar el email:", e);
    }

    // 8) respuesta
    return res.status(201).json({
      usuario: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        verified: user.verified,
      },
    });
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({ msg: "email ya registrado" });
    }
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * POST /api/auth/login
 */
export const logeo = async (req: Request, res: Response) => {
  try {
    const email = (req.body.email || "").toString().toLowerCase().trim();
    const contraseña = (req.body.contraseña || "").toString();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email/contraseña inválidos" });

    const okPass = bcrypt.compareSync(contraseña, user.contraseña);
    if (!okPass) return res.status(400).json({ msg: "Email/contraseña inválidos" });

    // Si NO está verificado: generar/guardar código y pedir verificación
    if (!user.verified) {
      const code = Randomstring.generate({ length: 6, charset: "numeric" });
      user.code = code;
      user.codeExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      try {
        await enviarEmail(user.email, code, "login");
      } catch (e) {
        console.error("No se pudo enviar email de login:", e);
      }

      return res.status(200).json({
        needsVerify: true,
        email: user.email,
        msg: "Te enviamos un código de verificación al email.",
      });
    }

    // Verificado → token
    const elToken = await crearToken(user.id);
    return res.json({ user, elToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Error. Vuelva a intentarlo" });
  }
};

/**
 * POST /api/auth/verify
 */
export const verificarUsuario = async (req: Request, res: Response) => {
  try {
    const email = (req.body.email || "").toString().toLowerCase().trim();
    const code = (req.body.code || "").toString().trim();

    const user = await User.findOne({
      email,
      verified: false,
      code,
      codeExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ msg: "Código inválido o vencido" });

    user.verified = true;
    user.code = null;
    user.codeExpires = null;
    await user.save();

    const elToken = await crearToken(user.id);
    return res.json({
      msg: "Cuenta verificada correctamente",
      usuario: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        verified: true,
      },
      elToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Error al verificar" });
  }
};

/**
 * POST /api/auth/resend
 */
export const reenviarCodigo = async (req: Request, res: Response) => {
  try {
    const email = (req.body.email || "").toString().toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    if (user.verified) return res.status(400).json({ msg: "El usuario ya está verificado" });

    const codigo = Randomstring.generate({ length: 6, charset: "numeric" });
    user.code = codigo;
    user.codeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    if (process.env.NODE_ENV !== "production") {
      console.log("DEV verify code para", user.email, "=>", user.code);
    }

    try {
      await enviarEmail(email, codigo, "resend");
    } catch (e) {
      console.error("No se pudo reenviar el email:", e);
    }

    return res.json({ msg: "Se envió un nuevo código" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Error al reenviar código" });
  }
};
