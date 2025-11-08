import { Server } from "./models/server";
import dotenv from "dotenv"

dotenv.config();

const server = new Server();

server.listen()






// import jwt from "jsonwebtoken"

// interface IObjetoAGuardar {
//     id:number,
//     username:string,
//     isAdmin:boolean
// }

// const objetoAGuardar :IObjetoAGuardar = {
//     id: 1,
//     username:"empanada",
//     isAdmin:true

// }

// //Clave secreta

// const miClaveSecreta="empanadaVoladora"

// // Firma

// // const tokenFIrmado = jwt.sign(objetoAGuardar,miClaveSecreta);
// // console.log(tokenFIrmado);


// const generarJWT = (dato:IObjetoAGuardar) => {

//     return new Promise((resolve,reject) => {
//       jwt.sign(dato,miClaveSecreta,{
//         expiresIn:"50s"
//       },
//       (err,token) => {
//         if(err){
//             console.log(err);
//             reject("Se picó... no funcionó")
//         } else {
//             console.log("Esta todo bien!");
//             resolve(token)
//         }
//       }
//     )
//     })
  
// }

// (async () => {
//     const respuesta = await generarJWT(objetoAGuardar);
//     console.log(respuesta)
// }) ()

// //guardamos un token anterior con un tiempo de vencimiento y comprobamos que al principio verifica bien y luego arroja error por token vencido
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbXBhbmFkYSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1OTAwNDU3NCwiZXhwIjoxNzU5MDA0NjI0fQ.qvowQhgLKTL0hPz61CnAEnLT01tfw6idF-EOadISiR0"

// const dataVerificada = jwt.verify(token,miClaveSecreta)
// console.log("La info está verificada", dataVerificada);

// // index.ts
// import "dotenv/config";
// import { Server } from "./models/server";
// console.log("Arrancando...")

// const server = new Server();
// server.listen(); // <- fundamental


