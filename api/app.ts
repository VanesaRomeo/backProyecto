// src/index.ts
import serverless from "serverless-http";
import { Server } from "../models/server";


const srv = new Server();

// Vercel necesita un default export con el handler
export default serverless(srv.app);
