// controladores/pedidos.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import Pedido from "../models/pedido";

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const userId = req.body.usuarioConfirmado?.id; // setéalo en tu middleware JWT
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const { price, shippingCost, total, items, shippingDetails } = req.body;

    // Validación mínima defensiva
    if (
      typeof price !== "number" ||
      typeof shippingCost !== "number" ||
      typeof total !== "number" ||
      !Array.isArray(items) ||
      !shippingDetails
    ) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    const data = {
      usuario: new Types.ObjectId(userId),
      precio: price,
      costo: shippingCost,
      total,
      status: "pending",
      createdAt: new Date(),
      items: items.map((it: any) => ({
        id: it.id,
        titulo: it.titulo,
        precio: it.price ?? it.precio, // acepta price o precio
        cantidad: it.cantidad,
        desc: it.desc ?? "",
      })),
      detalles: {
        nombre: shippingDetails.nombre,
        telefono: shippingDetails.telefono,     // front: telefono
        lugar: shippingDetails.lugar ?? "",     // opcional
        direccion: shippingDetails.direccion,
        metodoPago: shippingDetails.metodoPago ?? "",
      },
    };

    const pedido = await Pedido.create(data);
    return res.status(201).json({ pedido });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creando pedido" });
  }
};

export const getPedidos = async (req: Request, res: Response) => {
  try {
    const userId = req.body.usuarioConfirmado?.id; // o desde req.user
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const filtro = { usuario: new Types.ObjectId(userId) };
    const pedidos = await Pedido.find(filtro).lean();

    return res.json({ data: pedidos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error obteniendo pedidos" });
  }
};
