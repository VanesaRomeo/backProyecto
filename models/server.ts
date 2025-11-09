// src/models/server.ts
import express, { Express } from "express";
import cors from "cors";

import { conectarLaDb } from "../database/config";
import auth from "../routes/auth";
import rutasProductos from "../routes/rutasProductos";
import rutasPedidos from "../routes/rutasPedido";

export class Server {
  public app: Express;
  private port: number;
  private API_PREFIX = "/api";
  private pathAuth = "/auth";
  private pathProductos = "/productos"; // /api/productos
private pathPedidos = "/pedidos";

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3002;

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  private async conectarDB(): Promise<void> {
    await conectarLaDb();
  }

  private middlewares(): void {
   const allowed = (process.env.CORS_ORIGINS || "*")
  .split(",")
  .map(s => s.trim());

this.app.use(cors({
  origin: allowed,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

this.app.options("*", cors({
  origin: allowed,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

    this.app.use(express.json());
  }

  private routes(): void {
    this.app.get(`${this.API_PREFIX}/health`, (_req, res) =>
      res.type("text/plain").send("ok")
    );

    this.app.use(`${this.API_PREFIX}${this.pathAuth}`, auth);
    this.app.use(`${this.API_PREFIX}${this.pathProductos}`, rutasProductos);
     this.app.use(`${this.API_PREFIX}${this.pathPedidos}`, rutasPedidos);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor en puerto ${this.port}`);
    });
  }
}
