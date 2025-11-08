import { Router } from "express";
import { jwtConfirmar } from "../middlewares/jwtConfirmar"; // <<-- tu archivo real
import { verificado } from "../middlewares/verificado";     // <<-- tu archivo real
import { libros } from "../data/productos"                // <<-- el mock que creaste recien

const rutasProductos = Router();

// Provisorio: devuelve el mock. Protegido con tu JWT + verificado.
rutasProductos.get("/productos", jwtConfirmar, verificado, (_req, res) => {
  res.json(libros);
});

export default rutasProductos;
