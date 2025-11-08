import User, { IUser } from "../models/users";
import { enviarEmail } from "../nodemeiler/mailer";

export const elEmailExiste = async (email: string):Promise<void> => {

	const encontrado = await User.findOne({ email });
  if (encontrado && encontrado.verified) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
  if (encontrado && !encontrado.verified) {
    
    // throw new Error(`Usuario ya registrado pero no verificado. Usá "reenviar código".`);

    await enviarEmail(email, encontrado.code as string, "resend");
    throw new Error(`Usuario registrado sin verificar. Reenviamos el código a ${email}.`);
  }
}
