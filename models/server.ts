import express, { Express } from "express";
import cors from "cors";

import { conectarLaDb } from "../database/config";
import auth from "../routes/auth";
import rutasProductos from "../routes/rutasProductos";

export class Server {
  public app: Express;
  private port: number;
  private API_PREFIX = "/api";
  private pathAuth = "/auth";
  private pathProductos = "/productos"; // usa minúsculas y agrega "/" al inicio

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  private async conectarDB(): Promise<void> {
    await conectarLaDb();
  }

  private middlewares(): void {
    // CORS antes de las rutas
    const allowed = [
      "http://localhost:5173",
      
    ];

    this.app.use(cors({
      origin: allowed,
      methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
      allowedHeaders: ["Content-Type","Authorization"],
      credentials: true,
    }));

    // Responder preflight
    this.app.options("*", cors({
      origin: allowed,
      methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
      allowedHeaders: ["Content-Type","Authorization"],
      credentials: true,
    }));

    this.app.use(express.json());
  }

  private routes(): void {
    // Salud consistente con el prefijo
    this.app.get(`${this.API_PREFIX}/health`, (_req, res) =>
      res.type("text/plain").send("ok")
    );

    this.app.use(`${this.API_PREFIX}${this.pathAuth}`, auth);            // /api/auth/...
    this.app.use(`${this.API_PREFIX}${this.pathProductos}`, rutasProductos); // /api/productos/...
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor en puerto ${this.port}`);
    });
  }
}
