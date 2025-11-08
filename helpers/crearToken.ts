// helpers/crearToken.ts
import jwt from "jsonwebtoken";

const crearToken = (id: string): string => {
  return jwt.sign({ id }, process.env.CLAVESECRETA as string, {
    expiresIn: "60d",
  });
};

export default crearToken;
