import { Router } from 'express'
import Order, { type OrderStatus } from '../models/Order'
import Prato from '../models/Prato'
import Extra from '../models/Extra'

const router = Router()

const VALID_STATUSES: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']

// ── POST /api/orders ─────────────────────────────────────────────────────────
// Body: { items: [{ pratoId, customizations, extraIds: string[] }], deliveryDetails }
// O total é sempre recalculado no servidor
router.post('/', async (req, res, next) => {
  try {
    const { items, deliveryDetails } = req.body as {
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

    // ── Construir itens com preços do servidor ──
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const prato = await Prato.findById(item.pratoId)
        if (!prato) throw Object.assign(new Error(`Prato ${item.pratoId} não encontrado`), { status: 404 })

        // Fetch extras and calculate their total
        const extraDocs = item.extraIds?.length
          ? await Extra.find({ _id: { $in: item.extraIds } })
          : []

        const extrasTotal = extraDocs.reduce((sum, e) => sum + e.preco, 0)
        const itemTotal   = prato.preco + extrasTotal

        return {
          pratoId:    prato._id,
          pratoNome:  prato.nome,
          pratoPreco: prato.preco,
          customizations: {
            free: item.customizations?.free ?? [],
            salt: item.customizations?.salt ?? 'Normal',
          },
          extras: extraDocs.map(e => ({ extraId: e._id, nome: e.nome, preco: e.preco })),
          total: itemTotal,
        }
      })
    )

    const total = orderItems.reduce((sum, i) => sum + i.total, 0)

    const order = await Order.create({
      items: orderItems,
      deliveryDetails: {
        name:     deliveryDetails.name,
        company:  deliveryDetails.company ?? '',
        location: deliveryDetails.location,
        contact:  deliveryDetails.contact,
      },
      total,
    })

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
