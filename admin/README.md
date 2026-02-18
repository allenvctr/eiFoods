# 🍜 eiFoods Admin

Aplicação de administração para o sistema eiFoods - gestão completa de restaurante com foco em delivery corporativo.

## 📋 Funcionalidades

### ✅ Dashboard
- Estatísticas em tempo real (pedidos, receita, etc.)
- Gráfico de receita dos últimos 7 dias
- Pratos mais populares
- Pedidos recentes

### 🍽️ Gestão de Pratos
- Criar, editar e excluir pratos
- Visualização em grid responsivo
- Busca por nome
- Informações detalhadas (emoji, preço, descrição)

### 📦 Gestão de Pedidos
- Visualizar todos os pedidos
- Filtrar por status (Pendente, Preparando, Pronto, Entregue)
- Atualizar status dos pedidos
- Detalhes completos (cliente, itens, customizações, endereço)
- Ações rápidas para avançar status

### ➕ Gestão de Extras
- Gerenciar itens extras pagos
- Criar, editar e excluir extras
- Visualização simplificada

### ⚙️ Configurações
- Informações do restaurante
- Configurações de entrega
- Estatísticas gerais
- Informações do sistema

## 🚀 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **React Router DOM** - Navegação
- **Vite** - Build tool
- **CSS Modules** - Estilos isolados

## 📦 Instalação

```bash
cd admin

# Instalar dependências necessárias
bun add react-router-dom lucide-react

# Instalar todas as dependências
bun install
```

## 🏃 Executar

```bash
# Modo desenvolvimento
bun run dev

# Build para produção
bun run build

# Preview da build
bun run preview
```

## 📁 Estrutura

```
admin/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── StatCard/
│   ├── context/         # Estado global
│   │   └── AdminContext.tsx
│   ├── data/            # Mock data
│   │   └── mockData.ts
│   ├── pages/           # Páginas principais
│   │   ├── Dashboard/
│   │   ├── Dishes/
│   │   ├── Orders/
│   │   ├── Extras/
│   │   └── Settings/
│   ├── types/           # Definições de tipos
│   │   └── admin.types.ts
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── public/
└── package.json
```

## 🎨 Design System

### Cores
- **Primary**: `#2563eb` (Azul)
- **Success**: `#16a34a` (Verde)
- **Warning**: `#f59e0b` (Amarelo)
- **Danger**: `#dc2626` (Vermelho)
- **Info**: `#8b5cf6` (Roxo)

### Componentes Base
- **Card**: Container com sombra e bordas arredondadas
- **Button**: Botões com variantes (primary, secondary, danger, success)
- **Badge**: Tags de status coloridas
- **StatCard**: Cards de estatísticas com ícones e trends

## 🔄 Fluxo de Estados dos Pedidos

```
Pendente → Preparando → Pronto → Entregue
```

## 📱 Responsividade

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Layout adaptativo com sidebar colapsável em mobile.

## 🔌 Integração com API (Futuro)

Atualmente usa mock data. Para integrar com API:

1. Substituir mock data por chamadas de API
2. Adicionar hooks customizados para fetching
3. Implementar loading states
4. Tratar erros de API

## 📝 Mock Data

A aplicação vem com dados simulados incluindo:
- 6 pratos pré-cadastrados
- 5 extras disponíveis
- 4 pedidos de exemplo
- Estatísticas do dashboard

## 🛠️ Desenvolvimento

### Adicionar Nova Página

1. Criar pasta em `/pages/NovaPage/`
2. Criar `NovaPage.tsx` e `NovaPage.module.css`
3. Adicionar rota no `App.tsx`
4. Adicionar item no menu da `Sidebar.tsx`

### Adicionar Novo Componente

1. Criar pasta em `/components/NovoComponente/`
2. Criar `NovoComponente.tsx` e `NovoComponente.module.css`
3. Exportar no `/components/index.ts`

## 🐛 Debug

```bash
# Ver erros de TypeScript
bun run build

# Lint
bun run lint
```

## 📄 Licença

MIT

## 👥 Autores

eiFoods Team - 2026


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
