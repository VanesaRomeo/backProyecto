// api/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import serverless from "serverless-http";

const app = express();
const ORIGIN = process.env.CORS_ORIGIN || "*";
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, status: "healthy" }));
app.get("/", (_req, res) => res.send("API up"));

// cache de conexión para serverless
let mongoReady = false;
async function ensureMongo() {
  if (mongoReady || !MONGO_URI) return;
  await mongoose.connect(MONGO_URI);
  mongoReady = true;
}

const handler = serverless(app);

// Tipos opcionales: usá any y listo (no importes @vercel/node)
export default async function (req: any, res: any) {
  try { await ensureMongo(); } catch (e) { console.error("Mongo connect error:", e); }
  return handler(req, res);
}
