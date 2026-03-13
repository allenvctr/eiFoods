import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'

import swaggerUi from 'swagger-ui-express'
import pratosRouter from './routes/pratos.ts'
import extrasRouter from './routes/extras.ts'
import pratoDoDiaRouter from './routes/pratoDoDia.ts'
import ordersRouter from './routes/orders.ts'
import sorteioRouter from './routes/sorteio.ts'
import swaggerSpec from './lib/swagger.ts'

const app = express()
const PORT = process.env['PORT'] ?? 3000

// ── Middleware ──────────────────────────────────────────────────────────────

const allowedOrigins = (process.env['CORS_ORIGIN'] ?? '').split(',').map(o => o.trim()).filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// HTTP request logger
const isDev = (process.env['NODE_ENV'] ?? 'development') === 'development'
app.use(morgan(isDev ? 'dev' : 'combined'))

// ── Routes ──────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected'
  res.json({ status: 'ok', db: dbStatus, timestamp: new Date().toISOString() })
})

app.use('/api/pratos', pratosRouter)
app.use('/api/extras', extrasRouter)
app.use('/api/prato-do-dia', pratoDoDiaRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/sorteio', sorteioRouter)

// ── API Docs (Swagger UI) ────────────────────────────────────────────────────

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec))

// ── 404 ─────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// ── Global error handler ────────────────────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: err.message ?? 'Erro interno do servidor' })
})

// ── Database + Server ───────────────────────────────────────────────────────

async function start() {
  const uri = process.env['MONGO_URI']
  if (!uri) throw new Error('MONGO_URI não definida no .env')

  await mongoose.connect(uri, { dbName: process.env['MONGO_DB_NAME'] ?? 'marmita_db' })
  console.log('[DB] MongoDB conectado')

  app.listen(PORT, () => {
    console.log(`[Server] Servidor a correr em http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('[Fatal]', err)
  process.exit(1)
})