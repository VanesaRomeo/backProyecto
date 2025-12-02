
import { Server } from "../models/server";
const srv = new Server();
export default srv.app; // << Vercel necesita export default de un handler
