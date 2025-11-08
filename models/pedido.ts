// models/pedido.ts
import { Model, Schema, model, Types } from "mongoose";

interface Detalles {
  nombre: string;
  telefono: string;      // antes 'celular'
  lugar?: string;        // opcional
  direccion: string;
  metodoPago?: string;   // opcional
}

interface Item {
  id: number;
  titulo: string;
  precio: number;
  cantidad: number;
  desc?: string;
}

export interface IPedidos {
  createdAt: Date;
  usuario: Types.ObjectId;
  precio: number;   // price del front
  costo: number;    // shippingCost del front
  total: number;
  status: string;
  items: Item[];    // plural
  detalles: Detalles;
}

const pedidoSchema = new Schema<IPedidos>(
  {
    createdAt: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },

    precio: { type: Number, required: true }, // mapea price
    costo: { type: Number, required: true },  // mapea shippingCost
    total: { type: Number, required: true },

    status: { type: String, default: "pending" },

    items: [
      {
        id: { type: Number, required: true },
        titulo: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        desc: { type: String, required: false },
      },
    ],

    detalles: {
      nombre: { type: String, required: true },
      telefono: { type: String, required: true },
      lugar: { type: String, required: false },
      direccion: { type: String, required: true },
      metodoPago: { type: String, required: false },
    },
  },
  { versionKey: false }
);

const Pedido: Model<IPedidos> = model<IPedidos>("Pedido", pedidoSchema);
export default Pedido;
