import express, { Express } from "express";
import cors from "cors";
         // /api/registro (u otros)


import { conectarLaDb } from "../database/config";
import rutasPedidos from "../routes/rutasPedidos";

import auth from "../routes/auth";
import rutasProductos from "../routes/rutasProductos";


export class Server {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  private async conectarDB(): Promise<void> {
    await conectarLaDb();
  }

  // server.ts
private middlewares(): void {
  this.app.use(express.json()); // 👈 mover acá, primero

  const ORIGINS = (process.env.CLIENT_URLS || "http://localhost:5173")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  this.app.use(cors({
    origin: ORIGINS,
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  }));
}

private routes(): void {
  this.app.get("/api/health", (_req, res) => res.type("text/plain").send("ok"));


  this.app.use("/api/auth", auth);
  this.app.use("/api/pedidos", rutasPedidos);
  this.app.use("/api", rutasProductos);
}



  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor en puerto ${this.port}`);
    });

    
  }
}
