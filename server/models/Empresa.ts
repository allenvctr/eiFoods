import mongoose, { type Document, type Model, Schema, type Types } from 'mongoose'
import { getCurrentDateKeyMaputo } from '../lib/businessTime'

export interface IEmpresaMenu {
	_id: Types.ObjectId
	nome: string
	ativo: boolean
	pratoIds: Types.ObjectId[]
}

export interface IEmpresa extends Document {
	nome: string
	ativo: boolean
	nrFuncionariosPagos: number
	menus: IEmpresaMenu[]
	codigo: string
	codigoAtivo: boolean
	maxUsosDia: number
	usosDiaAtual: number
	ultimoResetDia: string
	createdAt: Date
	updatedAt: Date
}

export function getCurrentDateKey(): string {
	return getCurrentDateKeyMaputo()
}

const EmpresaMenuSchema = new Schema<IEmpresaMenu>(
	{
		nome: { type: String, required: true, trim: true },
		ativo: { type: Boolean, default: false },
		pratoIds: [{ type: Schema.Types.ObjectId, ref: 'Prato' }],
	},
	{ _id: true }
)

const EmpresaSchema = new Schema<IEmpresa>(
	{
		nome: { type: String, required: true, trim: true },
		ativo: { type: Boolean, default: true },
		nrFuncionariosPagos: { type: Number, required: true, min: 1 },
		menus: { type: [EmpresaMenuSchema], default: [] },
		codigo: { type: String, required: true, trim: true, uppercase: true, unique: true },
		codigoAtivo: { type: Boolean, default: true },
		maxUsosDia: { type: Number, required: true, min: 1, default: 1 },
		usosDiaAtual: { type: Number, required: true, min: 0, default: 0 },
		ultimoResetDia: { type: String, required: true, default: getCurrentDateKey },
	},
	{ timestamps: true }
)

const Empresa: Model<IEmpresa> = mongoose.model<IEmpresa>('Empresa', EmpresaSchema)

export default Empresa
