/**
 * Script de seed para popular a base de dados com dados iniciais de teste.
 * Uso: bun run seed.ts
 */
import mongoose from 'mongoose'
import 'dotenv/config'
import Extra from './models/Extra'
import Prato from './models/Prato'
import PratoDoDia from './models/PratoDoDia'

const PLACEHOLDER_IMAGE = {
  url: 'https://placehold.co/400x300?text=Prato',
  publicId: 'placeholder',
}

async function seed() {
  const uri = process.env['MONGO_URI']
  if (!uri) throw new Error('MONGO_URI não definida no .env')

  await mongoose.connect(uri, { dbName: process.env['MONGO_DB_NAME'] ?? 'marmita_db' })
  console.log('[Seed] Conectado ao MongoDB')

  // Limpar coleções existentes
  await Promise.all([Extra.deleteMany({}), Prato.deleteMany({}), PratoDoDia.deleteMany({})])
  console.log('[Seed] Coleções limpas')

  // ── Extras ──────────────────────────────────────────────────────────────────
  const extras = await Extra.insertMany([
    { nome: 'Frango extra',  preco: 50, global: true },
    { nome: 'Salada',        preco: 25, global: true },
    { nome: 'Refrigerante',  preco: 40, global: true },
    { nome: 'Arroz extra',   preco: 20, global: true },
    { nome: 'Camarão',       preco: 80, global: false }, // exclusivo — será atribuído manualmente
  ])
  console.log(`[Seed] ${extras.length} extras criados`)

  const camarao = extras.find(e => e.nome === 'Camarão')!

  // ── Pratos ──────────────────────────────────────────────────────────────────
  const pratos = await Prato.insertMany([
    {
      nome: 'Arroz + Frango Assado + Batata',
      descricao: 'Frango assado no forno acompanhado de arroz branco e batata frita',
      preco: 250,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: true,
      extrasProprios: [],
    },
    {
      nome: 'Arroz + Frango Grelhado + Salada',
      descricao: 'Frango grelhado temperado com limão e ervas, arroz e salada fresca',
      preco: 280,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: true,
      extrasProprios: [],
    },
    {
      nome: 'Massa + Frango + Legumes',
      descricao: 'Massa esparguete com frango desfiado e legumes salteados',
      preco: 300,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: false,
      extrasProprios: [],
    },
    {
      nome: 'Arroz de Marisco',
      descricao: 'Arroz cremoso com camarão, amêijoa e berbigão',
      preco: 450,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: true,
      extrasProprios: [camarao._id],  // camarão extra disponível apenas neste prato
    },
    {
      nome: 'Xima + Frango + Molho de Amendoim',
      descricao: 'Xima tradicional com frango estufado e molho de amendoim caseiro',
      preco: 220,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: false,
      extrasProprios: [],
    },
    {
      nome: 'Matapa com Caril',
      descricao: 'Matapa de folhas de mandioca com caril de coco e camarão',
      preco: 350,
      imagem: PLACEHOLDER_IMAGE,
      disponivel: true,
      extrasProprios: [camarao._id],
    },
  ])
  console.log(`[Seed] ${pratos.length} pratos criados`)

  // ── Prato do Dia — agendamento semanal ──────────────────────────────────────
  const disponivel = pratos.filter(p => p.disponivel)
  await PratoDoDia.create({
    semana: [
      { diaSemana: 'segunda', prato: disponivel[0]?._id ?? null },
      { diaSemana: 'terca',   prato: disponivel[1]?._id ?? null },
      { diaSemana: 'quarta',  prato: disponivel[2]?._id ?? null },
      { diaSemana: 'quinta',  prato: disponivel[3]?._id ?? null },
      { diaSemana: 'sexta',   prato: disponivel[0]?._id ?? null },
      { diaSemana: 'sabado',  prato: disponivel[1]?._id ?? null },
    ],
  })
  console.log('[Seed] Agendamento semanal criado')

  console.log('[Seed] ✓ Feito!')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('[Seed Error]', err)
  process.exit(1)
})
