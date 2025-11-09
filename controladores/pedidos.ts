// controladores/pedidos.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import Pedido from "../models/ProductoPedido";
import { enviarConfirmacionCompra } from "../nodemeiler/mailer";


export const crearPedido = async (req: Request, res: Response) => {
  try {
    const userId = req.usuarioConfirmado?.id;   // <-- NO desde req.body
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });
    
const { price, shippingCost, total, items, shippingDetails } = req.body;
    
    if (
      typeof price !== "number" ||
      typeof shippingCost !== "number" ||
      typeof total !== "number" ||
      !Array.isArray(items) ||
      !shippingDetails?.email ||
      !shippingDetails?.nombre ||
      !shippingDetails?.telefono ||
      !shippingDetails?.direccion
    ) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    const data = {
      usuario: new Types.ObjectId(userId),
      precio: price,
      costo: shippingCost,
      total,
      status: "paid", // o "pending" si cobrás luego
      createdAt: new Date(),
      items: items.map((it: any) => ({
        id: it.id,
        titulo: it.titulo ?? it.title ?? it.nombre ?? "Producto",
        precio: it.precio ?? it.price,
        cantidad: it.cantidad ?? it.quantity ?? 1,
        desc: it.desc ?? "",
      })),
      detalles: {
        nombre: shippingDetails.nombre,
        telefono: shippingDetails.telefono,
        email: shippingDetails.email,       // <-- necesario para enviar el mail
        lugar: shippingDetails.lugar ?? "",
        direccion: shippingDetails.direccion,
        metodoPago: shippingDetails.metodoPago ?? "",
      },
    };

    const pedido = await Pedido.create(data);

    // enviar email
    await enviarConfirmacionCompra(shippingDetails.email, String(pedido._id), total);

    return res.status(201).json({ ok: true, pedido });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creando pedido" });
  }
};

export const getPedidos = async (req: Request, res: Response) => {
  try {
    const userId = req.usuarioConfirmado?.id;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const filtro = { usuario: new Types.ObjectId(userId) };
    const pedidos = await Pedido.find(filtro).lean();

    return res.json({ data: pedidos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error obteniendo pedidos" });
  }
};