import nodemailer from "nodemailer";

export const transporte = nodemailer.createTransport({
   service:"gmail",
    auth: {
        user:"gonza.dougan@gmail.com",
        pass:"apiy iudl avte urzn"
    },
    from:"gonza.dougan@gmail.com"
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

export async function enviarConfirmacionCompra(to: string, pedidoId: string, total: number) {
  const html = `
    <div style="font-family: Arial, sans-serif">
      <h2>¡Compra realizada con éxito!</h2>
      <p>Tu número de pedido es <b>${pedidoId}</b>.</p>
      <p>Total pagado: <b>$${total.toFixed(2)}</b></p>
      <p>Gracias por elegirnos.</p>
    </div>
  `;
  await transporte.sendMail({
    from: "Ilovebooks! <no-reply@ilovebooks.com>",
    to,
    subject: "Confirmación de compra",
    html,
  });
}