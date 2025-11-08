import {model, Model, Schema, Types} from "mongoose"
import { ROLES } from "../helpers/constantes"


export interface IUser {
  _id?: Types.ObjectId;
  nombre: string;
  email: string;
  contraseña: string;
  rol?: string | null;
  code?: string | null;
   codeExpires?: Date | null;
  verified?: Boolean;
}

const SchemaDelUser = new Schema<IUser> ({

    nombre:{
        type: String,
        required: [true, "campoo bligatorio"],
        trim: true,
    },
    email:{
        type: String,
        required: [true, "campoo bligatorio"],
   trim: true,
      lowercase: true,
      unique: true,
      },
     contraseña:{
        type: String,
        required: [true, "campo obligatorio"],
    },
    rol:{
        type: String,
        default:ROLES.user
    },
      code:{
        type: String,
           default: null,
      
    },
     codeExpires: {
      type: Date,
      default: null,
    },
      verified:{
        type: Boolean,
        default: false,
        
    },
})


SchemaDelUser.methods.toJSON = function () {
  const { __v, contraseña, _id, code, codeExpires, ...user } = this.toObject();
  // opcional: user.id = _id;
  return user;
}

const User : Model<IUser> = model<IUser>("User", SchemaDelUser);

export default User;