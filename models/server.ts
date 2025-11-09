// server.ts
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import { conectarLaDb } from "../database/config";
import auth from "../routes/auth";
import rutasProductos from "../routes/rutasProductos";

export class Server {
  app: Express;
  port: number;
  API_PREFIX = "/api";
  pathAuth: string;
  pathProductos: string;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;
    this.pathAuth = "/auth";
    this.pathProductos = "/productos"; // 👈 minúsculas y con barra

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  async conectarDB(): Promise<void> {
    await conectarLaDb();
  }

  private middlewares(): void {
    this.app.use(express.json());

    // ✅ CORS bien configurado (local + tu front en producción)
    const allowedOrigins = [
      "http://localhost:5173",
      "https://tu-frontend.vercel.app", // ⬅️ reemplazá por tu dominio real del FRONT
    ];

    const corsOptions: CorsOptions = {
      origin(origin, cb) {
        if (!origin) return cb(null, true); // permite curl/postman/SSR
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    this.app.use(cors(corsOptions));
    this.app.options("*", cors(corsOptions)); // ✅ responde preflights
  }

  private routes(): void {
    this.app.get(`${this.API_PREFIX}/health`, (_req, res) =>
      res.type("text/plain").send("ok")
    );

    // /api/auth/*
    this.app.use(`${this.API_PREFIX}${this.pathAuth}`, auth);

    // /api/productos/*
    this.app.use(`${this.API_PREFIX}${this.pathProductos}`, rutasProductos);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor en puerto ${this.port}`);
    });
  }
}
