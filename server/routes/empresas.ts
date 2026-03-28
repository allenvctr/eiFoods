import { Router } from 'express'
import mongoose from 'mongoose'
import Empresa, { getCurrentDateKey } from '../models/Empresa'
import Prato from '../models/Prato'

const router = Router()

function generateEmployeeCode(): string {
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
	let code = 'EMP-'
	for (let i = 0; i < 6; i += 1) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)]
	}
	return code
}

async function buildUniqueCodes(total: number): Promise<string[]> {
	const target = Math.max(1, total)
	const used = new Set<string>()

	while (used.size < target) {
		const candidate = generateEmployeeCode()
		if (used.has(candidate)) continue
		const exists = await Empresa.exists({ 'codigos.code': candidate })
		if (!exists) used.add(candidate)
	}

	return Array.from(used)
}

async function ensureAllMenuPratosExist(pratoIds: string[]) {
	if (!pratoIds.length) return true
	const count = await Prato.countDocuments({ _id: { $in: pratoIds } })
	return count === pratoIds.length
}

// GET /api/empresas
router.get('/', async (_req, res, next) => {
	try {
		const empresas = await Empresa.find().sort({ createdAt: -1 }).populate('menus.pratoIds')
		res.json(empresas)
	} catch (err) {
		next(err)
	}
})

// GET /api/empresas/:id
router.get('/:id', async (req, res, next) => {
	try {
		const empresa = await Empresa.findById(req.params['id']).populate('menus.pratoIds')
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// POST /api/empresas
router.post('/', async (req, res, next) => {
	try {
		const { nome, ativo = true, nrFuncionariosPagos, menuNome = 'Menu principal', pratoIds = [] } = req.body as {
			nome: string
			ativo?: boolean
			nrFuncionariosPagos: number
			menuNome?: string
			pratoIds?: string[]
		}

		if (!nome?.trim()) return res.status(400).json({ error: 'Nome da empresa é obrigatório' })
		if (!Number.isFinite(nrFuncionariosPagos) || nrFuncionariosPagos < 1) {
			return res.status(400).json({ error: 'nrFuncionariosPagos deve ser >= 1' })
		}

		const okPratos = await ensureAllMenuPratosExist(pratoIds)
		if (!okPratos) return res.status(400).json({ error: 'Um ou mais pratos informados não existem' })

		const codes = await buildUniqueCodes(nrFuncionariosPagos)
		const todayKey = getCurrentDateKey()

		const empresa = await Empresa.create({
			nome: nome.trim(),
			ativo,
			nrFuncionariosPagos,
			menus: [{ nome: menuNome, ativo: true, pratoIds }],
			codigos: codes.map((code) => ({ code, ativo: true, maxUsosDia: 1, usosDiaAtual: 0, ultimoResetDia: todayKey })),
		})

		await empresa.populate('menus.pratoIds')
		res.status(201).json(empresa)
	} catch (err) {
		if ((err as { code?: number }).code === 11000) {
			return res.status(409).json({ error: 'Conflito ao gerar códigos, tente novamente' })
		}
		next(err)
	}
})

// PUT /api/empresas/:id
router.put('/:id', async (req, res, next) => {
	try {
		const { nome, ativo, nrFuncionariosPagos } = req.body as {
			nome?: string
			ativo?: boolean
			nrFuncionariosPagos?: number
		}

		const update: Record<string, unknown> = {}
		if (nome !== undefined) {
			if (!nome.trim()) return res.status(400).json({ error: 'Nome inválido' })
			update['nome'] = nome.trim()
		}
		if (ativo !== undefined) update['ativo'] = ativo
		if (nrFuncionariosPagos !== undefined) {
			if (!Number.isFinite(nrFuncionariosPagos) || nrFuncionariosPagos < 1) {
				return res.status(400).json({ error: 'nrFuncionariosPagos deve ser >= 1' })
			}
			update['nrFuncionariosPagos'] = nrFuncionariosPagos
		}

		const empresa = await Empresa.findByIdAndUpdate(req.params['id'], update, {
			returnDocument: 'after',
			runValidators: true,
		}).populate('menus.pratoIds')

		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// DELETE /api/empresas/:id
router.delete('/:id', async (req, res, next) => {
	try {
		const empresa = await Empresa.findByIdAndDelete(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })
		res.json({ message: 'Empresa removida' })
	} catch (err) {
		next(err)
	}
})

// POST /api/empresas/:id/regenerate-codes
router.post('/:id/regenerate-codes', async (req, res, next) => {
	try {
		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		const codes = await buildUniqueCodes(empresa.nrFuncionariosPagos)
		const todayKey = getCurrentDateKey()
		empresa.codigos = codes.map((code) => ({
			_id: new mongoose.Types.ObjectId(),
			code,
			ativo: true,
			maxUsosDia: 1,
			usosDiaAtual: 0,
			ultimoResetDia: todayKey,
		}))

		await empresa.save()
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// POST /api/empresas/:id/add-codes
router.post('/:id/add-codes', async (req, res, next) => {
	try {
		const { quantidade } = req.body as { quantidade?: number }
		const qty = Number(quantidade)

		if (!Number.isInteger(qty) || qty < 1) {
			return res.status(400).json({ error: 'quantidade deve ser um inteiro >= 1' })
		}

		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		const codes = await buildUniqueCodes(qty)
		const todayKey = getCurrentDateKey()

		empresa.codigos.push(
			...codes.map((code) => ({
				_id: new mongoose.Types.ObjectId(),
				code,
				ativo: true,
				maxUsosDia: 1,
				usosDiaAtual: 0,
				ultimoResetDia: todayKey,
			}))
		)

		empresa.nrFuncionariosPagos += qty
		await empresa.save()
		await empresa.populate('menus.pratoIds')
		res.json(empresa)
	} catch (err) {
		if ((err as { code?: number }).code === 11000) {
			return res.status(409).json({ error: 'Conflito ao gerar códigos, tente novamente' })
		}
		next(err)
	}
})

// PATCH /api/empresas/:id/codigos/:codigoId/ativo
router.patch('/:id/codigos/:codigoId/ativo', async (req, res, next) => {
	try {
		const { ativo } = req.body as { ativo: boolean }
		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		const codigo = empresa.codigos.find((c) => String(c._id) === req.params['codigoId'])
		if (!codigo) return res.status(404).json({ error: 'Código não encontrado' })

		codigo.ativo = Boolean(ativo)
		await empresa.save()
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// POST /api/empresas/:id/menus
router.post('/:id/menus', async (req, res, next) => {
	try {
		const { nome, pratoIds = [], ativo = true } = req.body as {
			nome: string
			pratoIds?: string[]
			ativo?: boolean
		}
		if (!nome?.trim()) return res.status(400).json({ error: 'Nome do menu é obrigatório' })

		const okPratos = await ensureAllMenuPratosExist(pratoIds)
		if (!okPratos) return res.status(400).json({ error: 'Um ou mais pratos informados não existem' })

		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		if (ativo) {
			empresa.menus.forEach((m) => {
				m.ativo = false
			})
		}

		empresa.menus.push({ nome: nome.trim(), pratoIds, ativo } as never)
		await empresa.save()
		await empresa.populate('menus.pratoIds')
		res.status(201).json(empresa)
	} catch (err) {
		next(err)
	}
})

// PUT /api/empresas/:id/menus/:menuId
router.put('/:id/menus/:menuId', async (req, res, next) => {
	try {
		const { nome, pratoIds, ativo } = req.body as {
			nome?: string
			pratoIds?: string[]
			ativo?: boolean
		}

		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		const menu = empresa.menus.find((m) => String(m._id) === req.params['menuId'])
		if (!menu) return res.status(404).json({ error: 'Menu não encontrado' })

		if (nome !== undefined) {
			if (!nome.trim()) return res.status(400).json({ error: 'Nome do menu inválido' })
			menu.nome = nome.trim()
		}

		if (pratoIds !== undefined) {
			const okPratos = await ensureAllMenuPratosExist(pratoIds)
			if (!okPratos) return res.status(400).json({ error: 'Um ou mais pratos informados não existem' })
			menu.pratoIds = pratoIds.map((id) => new mongoose.Types.ObjectId(id))
		}

		if (ativo !== undefined) {
			if (ativo) {
				empresa.menus.forEach((m) => {
					m.ativo = false
				})
			}
			menu.ativo = ativo
		}

		await empresa.save()
		await empresa.populate('menus.pratoIds')
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// DELETE /api/empresas/:id/menus/:menuId
router.delete('/:id/menus/:menuId', async (req, res, next) => {
	try {
		const empresa = await Empresa.findById(req.params['id'])
		if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

		const menuIndex = empresa.menus.findIndex((m) => String(m._id) === req.params['menuId'])
		if (menuIndex < 0) return res.status(404).json({ error: 'Menu não encontrado' })

		const deletedWasActive = empresa.menus[menuIndex]?.ativo ?? false
		empresa.menus.splice(menuIndex, 1)

		if (deletedWasActive && empresa.menus[0]) {
			empresa.menus[0].ativo = true
		}

		await empresa.save()
		await empresa.populate('menus.pratoIds')
		res.json(empresa)
	} catch (err) {
		next(err)
	}
})

// GET /api/empresas/codigo/:code
router.get('/codigo/:code', async (req, res, next) => {
	try {
		const code = req.params['code']?.trim().toUpperCase()
		if (!code) return res.status(400).json({ error: 'Código inválido' })

		const empresa = await Empresa.findOne({ ativo: true, codigos: { $elemMatch: { code } } }).populate('menus.pratoIds')
		if (!empresa) return res.status(404).json({ error: 'Código não encontrado' })

		const codigo = empresa.codigos.find((c) => c.code === code)
		if (!codigo || !codigo.ativo) {
			return res.status(403).json({ error: 'Código inativo' })
		}

		const today = getCurrentDateKey()
		if (codigo.ultimoResetDia !== today) {
			codigo.usosDiaAtual = 0
			codigo.ultimoResetDia = today
			await empresa.save()
		}

		if (codigo.usosDiaAtual >= codigo.maxUsosDia) {
			return res.status(403).json({ error: 'Código sem usos disponíveis para hoje' })
		}

		const menuAtivo = empresa.menus.find((m) => m.ativo) ?? empresa.menus[0]
		if (!menuAtivo) {
			return res.status(400).json({ error: 'Empresa sem menu configurado' })
		}

		res.json({
			empresaId: empresa._id,
			empresaNome: empresa.nome,
			codigoId: codigo._id,
			codigo: codigo.code,
			usosRestantesHoje: Math.max(0, codigo.maxUsosDia - codigo.usosDiaAtual),
			menu: menuAtivo,
		})
	} catch (err) {
		next(err)
	}
})

export default router
