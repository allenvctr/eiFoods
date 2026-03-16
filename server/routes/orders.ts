import { Router } from 'express'
import Order, { type OrderStatus } from '../models/Order'
import Prato from '../models/Prato'
import Extra from '../models/Extra'
import Empresa, { getCurrentDateKey } from '../models/Empresa'
import PratoDoDia, { type DiaSemana } from '../models/PratoDoDia'

const router = Router()

const VALID_STATUSES: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']
const FORA_DO_DIA_TAXA = 50

const DAY_MAP: Record<number, DiaSemana> = {
  1: 'segunda',
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
}

async function getTodayPratoId(): Promise<string | null> {
  const dayOfWeek = new Date().getDay()
  const diaSemana = DAY_MAP[dayOfWeek]
  if (!diaSemana) return null

  const schedule = await PratoDoDia.findOne().populate('semana.prato')
  const entrada = schedule?.semana.find((d) => d.diaSemana === diaSemana)
  const prato = entrada?.prato as { _id?: string } | null
  return prato?._id ? String(prato._id) : null
}

// ── POST /api/orders ─────────────────────────────────────────────────────────
// Body: { items: [{ pratoId, customizations, extraIds: string[] }], deliveryDetails }
// O total é sempre recalculado no servidor
router.post('/', async (req, res, next) => {
  try {
    const { items, deliveryDetails, empresaCodigo } = req.body as {
      items: Array<{
        pratoId: string
        customizations: { free: string[]; salt: string }
        extraIds: string[]
      }>
      deliveryDetails: {
        name: string
        company?: string
        location: string
        contact: string
      }
      empresaCodigo?: string
    }

    // ── Validação básica dos dados de entrega ──
    if (!deliveryDetails?.name?.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório' })
    }
    if (!deliveryDetails?.location?.trim()) {
      return res.status(400).json({ error: 'Localização é obrigatória' })
    }
    if (!deliveryDetails?.contact?.trim()) {
      return res.status(400).json({ error: 'Contacto é obrigatório' })
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'O pedido deve ter pelo menos um item' })
    }

    let empresaId: string | undefined
    let empresaCodigoResolved: string | undefined
    let codigoParaConsumir: { empresaId: string; codigoId: string } | undefined
    let allowedPratosSet: Set<string> | null = null

    if (empresaCodigo?.trim()) {
      const code = empresaCodigo.trim().toUpperCase()
      const empresa = await Empresa.findOne({ ativo: true, codigos: { $elemMatch: { code } } })
      if (!empresa) return res.status(404).json({ error: 'Código de empresa inválido' })

      const codigo = empresa.codigos.find((c) => c.code === code)
      if (!codigo || !codigo.ativo) {
        return res.status(403).json({ error: 'Código da empresa inativo' })
      }

      const today = getCurrentDateKey()
      if (codigo.ultimoResetDia !== today) {
        codigo.usosDiaAtual = 0
        codigo.ultimoResetDia = today
      }

      if (codigo.usosDiaAtual >= codigo.maxUsosDia) {
        return res.status(403).json({ error: 'Código da empresa sem usos disponíveis hoje' })
      }

      const menuAtivo = empresa.menus.find((m) => m.ativo) ?? empresa.menus[0]
      if (!menuAtivo) {
        return res.status(400).json({ error: 'Empresa sem menu ativo' })
      }

      allowedPratosSet = new Set(menuAtivo.pratoIds.map((id) => String(id)))
      empresaId = String(empresa._id)
      empresaCodigoResolved = code
      codigoParaConsumir = { empresaId, codigoId: String(codigo._id) }

      if (allowedPratosSet.size === 0) {
        return res.status(400).json({ error: 'Menu da empresa sem pratos disponíveis' })
      }
    }

    const todayPratoId = await getTodayPratoId()
    let foraDoDiaCount = 0

    // ── Construir itens com preços do servidor ──
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const prato = await Prato.findById(item.pratoId)
        if (!prato) throw Object.assign(new Error(`Prato ${item.pratoId} não encontrado`), { status: 404 })

        if (allowedPratosSet && !allowedPratosSet.has(String(prato._id))) {
          throw Object.assign(new Error(`Prato ${prato.nome} não está no menu da empresa`), { status: 403 })
        }

        // Fetch extras and calculate their total
        const extraDocs = item.extraIds?.length
          ? await Extra.find({ _id: { $in: item.extraIds } })
          : []

        const extrasTotal = extraDocs.reduce((sum, e) => sum + e.preco, 0)
        const isForaDoDia = Boolean(todayPratoId) && String(prato._id) !== todayPratoId
        if (isForaDoDia) foraDoDiaCount += 1
        const foraDoDiaTaxa = isForaDoDia ? FORA_DO_DIA_TAXA : 0
        const itemTotal = prato.preco + extrasTotal + foraDoDiaTaxa

        return {
          pratoId:    prato._id,
          pratoNome:  prato.nome,
          pratoPreco: prato.preco,
          customizations: {
            free: item.customizations?.free ?? [],
            salt: item.customizations?.salt ?? 'Normal',
          },
          extras: extraDocs.map(e => ({ extraId: e._id, nome: e.nome, preco: e.preco })),
          isForaDoDia,
          foraDoDiaTaxa,
          total: itemTotal,
        }
      })
    )

    const taxaForaDoDia = foraDoDiaCount * FORA_DO_DIA_TAXA
    const total = orderItems.reduce((sum, i) => sum + i.total, 0)

    const order = await Order.create({
      empresaId,
      empresaCodigo: empresaCodigoResolved,
      items: orderItems,
      deliveryDetails: {
        name:     deliveryDetails.name,
        company:  deliveryDetails.company ?? '',
        location: deliveryDetails.location,
        contact:  deliveryDetails.contact,
      },
      foraDoDiaCount,
      taxaForaDoDia,
      total,
    })

    if (codigoParaConsumir) {
      const empresa = await Empresa.findById(codigoParaConsumir.empresaId)
      const codigo = empresa?.codigos.find((c) => String(c._id) === codigoParaConsumir.codigoId)
      if (empresa && codigo) {
        const today = getCurrentDateKey()
        if (codigo.ultimoResetDia !== today) {
          codigo.usosDiaAtual = 0
          codigo.ultimoResetDia = today
        }
        codigo.usosDiaAtual += 1
        await empresa.save()
      }
    }

    res.status(201).json(order)
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    if (e.status) return res.status(e.status).json({ error: e.message })
    next(err)
  }
})

// ── GET /api/orders ──────────────────────────────────────────────────────────
// Query: ?status=pending|preparing|ready|delivered|cancelled
router.get('/', async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = {}
    if (req.query['status'] && VALID_STATUSES.includes(req.query['status'] as OrderStatus)) {
      filter['status'] = req.query['status']
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
})

// ── GET /api/orders/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params['id'])
    if (!order) return res.status(404).json({ error: 'Encomenda não encontrada' })
    res.json(order)
  } catch (err) {
    next(err)
  }
})

// ── PATCH /api/orders/:id/status ─────────────────────────────────────────────
// Body: { status: OrderStatus }
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body as { status: OrderStatus }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Status inválido. Use: ${VALID_STATUSES.join(', ')}`,
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params['id'],
      { status },
      { returnDocument: 'after', runValidators: true }
    )
    if (!order) return res.status(404).json({ error: 'Encomenda não encontrada' })
    res.json(order)
  } catch (err) {
    next(err)
  }
})

export default router
