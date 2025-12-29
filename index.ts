import { Server } from "./models/server";
import dotenv from "dotenv";

dotenv.config();

const server = new Server();


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3002;
  server.app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
}

export default server.app;
