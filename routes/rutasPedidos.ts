import { Router } from "express";
import { crearPedido, getPedidos } from "../controladores/pedidos";
import { jwtConfirmar } from "../middlewares/jwtConfirmar";
import { losErores } from "../middlewares/losErores";
import { check } from "express-validator";
import { verificado } from "../middlewares/verificado";

const rutasPedidos = Router();

// Ver pedidos (normalmente protegido)
rutasPedidos.get("/", jwtConfirmar, getPedidos);


// Crear pedido (checkout) protegido + validaciones
rutasPedidos.post(
  "/",
  [
    jwtConfirmar,
    verificado,
    check("price").optional().isNumeric().withMessage("price debe ser numérico"),
    check("precio").optional().isNumeric().withMessage("precio debe ser numérico"),

    // Permitir shippingCost o costo
    check("shippingCost").optional().isNumeric().withMessage("shippingCost debe ser numérico"),
    check("costo").optional().isNumeric().withMessage("costo debe ser numérico"),

    check("total", "total es obligatorio y numérico").isNumeric(),

    check("items", "items debe ser un array con al menos 1 elemento")
      .isArray({ min: 1 }),

    check("items.*.id", "items[].id numérico").isNumeric(),

 check("items.*.id", "items[].id requerido").exists().bail().isString(),



    // Permitir precio o price por item
    check("items.*.precio").optional().isNumeric(),
    check("items.*.price").optional().isNumeric(),

   check("items.*.cantidad").optional().isInt({ min: 1 }),


    // Datos de envío
    check("shippingDetails.nombre", "shippingDetails.nombre requerido").isString().notEmpty(),
    check("shippingDetails.telefono", "shippingDetails.telefono requerido").isString().notEmpty(),
    check("shippingDetails.direccion", "shippingDetails.direccion requerido").isString().notEmpty(),

    losErores,
  ],
  crearPedido
);

export default rutasPedidos;
