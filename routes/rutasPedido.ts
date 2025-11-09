import { Router } from "express";
import { jwtConfirmar } from "../middlewares/jwtConfirmar";
import { verificado } from "../middlewares/verificado";
import { crearPedido, getPedidos } from "../controladores/pedidos"; // 👈 renombrá el archivo si hoy se llama productosLibros

const rutasPedidos = Router();

rutasPedidos.post("/", [jwtConfirmar, verificado], crearPedido);
rutasPedidos.get("/",  [jwtConfirmar, verificado], getPedidos);

export default rutasPedidos;
