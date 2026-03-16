import mongoose, { type Document, type Model, Schema, type Types } from 'mongoose'

export interface IEmpresaMenu {
	_id: Types.ObjectId
	nome: string
	ativo: boolean
	pratoIds: Types.ObjectId[]
}

export interface IEmpresaCodigo {
	_id: Types.ObjectId
	code: string
	ativo: boolean
	maxUsosDia: number
	usosDiaAtual: number
	ultimoResetDia: string
}

export interface IEmpresa extends Document {
	nome: string
	ativo: boolean
	nrFuncionariosPagos: number
	menus: IEmpresaMenu[]
	codigos: IEmpresaCodigo[]
	createdAt: Date
	updatedAt: Date
}

export function getCurrentDateKey(): string {
	const now = new Date()
	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, '0')
	const d = String(now.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

const EmpresaMenuSchema = new Schema<IEmpresaMenu>(
	{
		nome: { type: String, required: true, trim: true },
		ativo: { type: Boolean, default: false },
		pratoIds: [{ type: Schema.Types.ObjectId, ref: 'Prato' }],
	},
	{ _id: true }
)

const EmpresaCodigoSchema = new Schema<IEmpresaCodigo>(
	{
		code: { type: String, required: true, trim: true, uppercase: true },
		ativo: { type: Boolean, default: true },
		maxUsosDia: { type: Number, required: true, min: 1, default: 1 },
		usosDiaAtual: { type: Number, required: true, min: 0, default: 0 },
		ultimoResetDia: { type: String, required: true, default: getCurrentDateKey },
	},
	{ _id: true }
)

const EmpresaSchema = new Schema<IEmpresa>(
	{
		nome: { type: String, required: true, trim: true },
		ativo: { type: Boolean, default: true },
		nrFuncionariosPagos: { type: Number, required: true, min: 1 },
		menus: { type: [EmpresaMenuSchema], default: [] },
		codigos: { type: [EmpresaCodigoSchema], default: [] },
	},
	{ timestamps: true }
)

// Enforce global uniqueness of employee codes across all companies.
EmpresaSchema.index({ 'codigos.code': 1 }, { unique: true })

const Empresa: Model<IEmpresa> = mongoose.model<IEmpresa>('Empresa', EmpresaSchema)

export default Empresa
