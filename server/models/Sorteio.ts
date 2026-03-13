import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface ISorteioParticipante {
  id: string
  ref: string
  nome: string
  empresa: string
  contacto: string
  inscritoEm: Date
}

export interface ISorteioInscricao {
  id: string
  nome: string
  empresa: string
  contacto: string
  criadoEm: Date
}

export interface ISorteioVencedor {
  participanteId: string
  ref: string
  nome: string
  empresa: string
  contacto: string
  data: Date
  pratoNome: string | null
  premioValor: number | null
}

export interface ISorteio extends Document {
  inscricoesPendentes: ISorteioInscricao[]
  participantes: ISorteioParticipante[]
  vencedorAtual: ISorteioVencedor | null
  historico: ISorteioVencedor[]
  updatedAt: Date
}

const InscricaoSchema = new Schema<ISorteioInscricao>(
  {
    id: { type: String, required: true },
    nome: { type: String, required: true },
    empresa: { type: String, default: '—' },
    contacto: { type: String, default: '—' },
    criadoEm: { type: Date, default: Date.now },
  },
  { _id: false }
)

const ParticipanteSchema = new Schema<ISorteioParticipante>(
  {
    id: { type: String, required: true },
    ref: { type: String, required: true },
    nome: { type: String, required: true },
    empresa: { type: String, default: '—' },
    contacto: { type: String, default: '—' },
    inscritoEm: { type: Date, default: Date.now },
  },
  { _id: false }
)

const VencedorSchema = new Schema<ISorteioVencedor>(
  {
    participanteId: { type: String, required: true },
    ref: { type: String, required: true },
    nome: { type: String, required: true },
    empresa: { type: String, required: true },
    contacto: { type: String, required: true },
    data: { type: Date, default: Date.now },
    pratoNome: { type: String, default: null },
    premioValor: { type: Number, default: null },
  },
  { _id: false }
)

const SorteioSchema = new Schema<ISorteio>(
  {
    inscricoesPendentes: { type: [InscricaoSchema], default: [] },
    participantes: { type: [ParticipanteSchema], default: [] },
    vencedorAtual: { type: VencedorSchema, default: null },
    historico: { type: [VencedorSchema], default: [] },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const Sorteio: Model<ISorteio> = mongoose.model<ISorteio>('Sorteio', SorteioSchema)
export default Sorteio
