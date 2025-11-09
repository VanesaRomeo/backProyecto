// import { Server } from "./models/server";
// import dotenv from "dotenv"

// dotenv.config();

// const server = new Server();

// server.listen()


 
import { Server } from './models/server';

// NO llamar listen() en Vercel
const srv = new Server();
export default srv.app; // Express app como handler serverless
