import express, { Express } from "express";
import cors, { CorsOptions } from "cors";  
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

  const corsOptions: CorsOptions = {
    origin(origin, cb) {
      if (!origin) return cb(null, true);            // permite Postman/curl
      if (ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,                                // solo si usás cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

 this.app.use(cors(corsOptions));       // primero
this.app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204); // preflight OK
  next();
});
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
