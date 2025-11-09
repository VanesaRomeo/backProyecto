import { Router } from "express";
import Pedido from "../models/ProductoPedido";
// si ya tenés modelo; si no, usá tu fuente de datos

const rutasProductos = Router();

rutasProductos.get("/", async (_req, res) => {
  const productos = await Pedido.find().lean(); // o tu fuente (array, etc.)
  res.json({ productos });
});

export default rutasProductos;
