import { Router, Request, Response } from "express";

// Si guardaste el catálogo en src/data/libros.ts:


const rutasProducto = Router();

// GET /api/productos
rutasProducto.get("/", (_req: Request, res: Response) => {
  // reemplazá por tu controller si querés: res.json(await Product.find())
  res.json();
});

export default rutasProducto;
