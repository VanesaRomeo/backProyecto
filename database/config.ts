
import mongoose from "mongoose";

export const conectarLaDb = async () => {
  
 

  try {
    const uri = process.env.DB_URL;
   
   if (!uri) {
  
    throw new Error("DB_URL no configurada");
  } 
   await mongoose.connect(uri);
    console.log("Base de datos online");
    
  } catch (err: any) {
    console.error("Error conectando a Mongo:", err?.message || err);
    throw new Error("no se inicio correctamente la base de datos");
  }
};
