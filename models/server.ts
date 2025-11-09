import express, { Express } from "express";
import cors  from "cors";  
         // /api/registro (u otros)


import { conectarLaDb } from "../database/config";


import auth from "../routes/auth";
import rutasProductos from "../routes/rutasProductos";


export class Server {
  app: Express;
 port: number;
  API_PREFIX = "/api";
pathAuth:string;
pathProductos:string

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;
this.pathAuth="/auth";
this.pathProductos="Productos";

    this.conectarDB();
        this.middlewares();
    this.routes();
  }

async conectarDB(): Promise<void> {
    await conectarLaDb();
  }

  // server.ts
private middlewares(): void {
  this.app.use(express.json()); 
 this.app.use(cors());

}

private routes(): void {
  this.app.get("/api/health", (_req, res) => res.type("text/plain").send("ok"));


  this.app.use(`${this.API_PREFIX}${this.pathAuth}`, auth);            // → /api/auth/...
    this.app.use(`${this.API_PREFIX}${this.pathProductos}`, rutasProductos)
}



  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor en puerto ${this.port}`);
    });

    
  }
}
