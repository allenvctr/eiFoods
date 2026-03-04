import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface IExtra extends Document {
  nome: string
  preco: number
  global: boolean   // true = aparece em todos os pratos; false = só em pratos que o referenciem
  ativo: boolean
  createdAt: Date
  updatedAt: Date
}

const ExtraSchema = new Schema<IExtra>(
  {
    nome:   { type: String, required: true, trim: true },
    preco:  { type: Number, required: true, min: 0 },
    global: { type: Boolean, default: true },
    ativo:  { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Extra: Model<IExtra> = mongoose.model<IExtra>('Extra', ExtraSchema)
export default Extra
