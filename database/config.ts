// import mongoose from "mongoose";

// export const conectarLaDb = async():Promise<void> =>{

//     try {
//         const laUrlDb = process.env.DB_URL;

//         if(!laUrlDb) {
//             throw new Error("Url incorrecta")
//         }

//         await mongoose.connect(laUrlDb);

//         console.log("Base de datos online")

// }
//  catch(error){
//         console.log(error)
//         throw new Error("no se inicio corractamente la base de datos")}

// }

// database/config.ts
import mongoose from "mongoose";

export const conectarLaDb = async () => {
  const uri = process.env.DB_URL;
  if (!uri) {
    console.error("Falta DB_URL en .env");
    throw new Error("DB_URL no configurada");
  }

  try {
    await mongoose.connect(uri); 
    console.log("Base de datos online");
  } catch (err: any) {
    console.error("Error conectando a Mongo:", err?.message || err);
    throw new Error("no se inicio correctamente la base de datos");
  }
};
