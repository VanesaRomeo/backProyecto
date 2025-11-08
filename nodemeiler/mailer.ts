// nodemailer/mailer.ts
import nodemailer from "nodemailer";

export const transporte = nodemailer.createTransport({
   service:"gmail",
    auth: {
        user:"gonza.dougan@gmail.com",
        pass:"apiy iudl avte urzn"
    },
    from:"nucbazappi3317@gmail.com"
}) 
export const enviarEmail = async (to:string,code:string,text:string):Promise<void> => {
    try {
        const mailOption = {
            from: "Ilovebooks!",
            to,
            subject: "tu codigo de verificación",
            text: `Tu código Ilovebooks es: ${code}`
        };

        await transporte.sendMail(mailOption);
        console.log("Correo electrónico enviado");
    } catch (error){
        console.error("Error al enviar el correo",error)
    }
}



