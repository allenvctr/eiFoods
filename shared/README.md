# 📦 eiFoods Shared

Módulo compartilhado com tipos, constantes, validadores e utilitários reutilizáveis.

## 📁 Estrutura

```
shared/
├── index.ts          # Entry point - re-exporta tudo
├── types.ts          # Definições de tipos TypeScript
├── constants.ts      # Constantes da aplicação
├── validators.ts     # Funções de validação
├── utils.ts          # Funções utilitárias
└── README.md         # Este arquivo
```

## 🔷 Types (`types.ts`)

### Interfaces Principais

#### `Prato`
```typescript
interface Prato {
  id: number
  nome: string
  preco: number
  emoji: string
  descricao: string
}
```

#### `Extra`
```typescript
interface Extra {
  id: string
  nome: string
  preco: number
}
```

#### `Customizacoes`
```typescript
interface Customizacoes {
  free: OpcaoGratuita[]
  paid: Extra | null
  salt: OpcaoSal
}
```

#### `OrderItem`
```typescript
interface OrderItem {
  prato: Prato
  customizations: Customizacoes
  total: number
}
```

#### `DeliveryDetails`
```typescript
interface DeliveryDetails {
  name: string
  company: string
  location: string
  contact: string
}
```

#### `OrderState`
```typescript
interface OrderState {
  selectedDish: Prato | null
  customizations: Customizacoes
  orderItems: OrderItem[]
  deliveryDetails: DeliveryDetails
}
```

### Types Auxiliares

- `OpcaoGratuita` - Opções gratuitas de customização
- `OpcaoSal` - Níveis de sal
- `OrderAction` - Ações do reducer
- `AppConfig` - Configurações da app
- `OrderContextType` - Tipo do contexto

## 🔢 Constants (`constants.ts`)

### Opções de Menu
```typescript
OPCOES_GRATUITAS  // Opções gratuitas
OPCOES_SAL        // Níveis de sal
```

### Validação
```typescript
PHONE_REGEX           // Regex para telefone moçambicano
MIN_NAME_LENGTH       // Tamanho mínimo do nome (3)
MIN_LOCATION_LENGTH   // Tamanho mínimo da localização (5)
```

### UI
```typescript
BREAKPOINTS           // { mobile: 480, tablet: 768, ... }
ANIMATION_DURATION    // { fast: 150, normal: 220, slow: 300 }
MAX_ORDER_ITEMS       // Máximo de itens (20)
```

### Rotas
```typescript
ROUTES  // { HOME: '/', MENU: '/menu', ... }
```

### Mensagens
```typescript
ERROR_MESSAGES    // Mensagens de erro
SUCCESS_MESSAGES  // Mensagens de sucesso
```

## ✅ Validators (`validators.ts`)

### Funções de Validação

#### `isValidPhone(phone: string): boolean`
Valida número de telefone moçambicano.

#### `validateName(name: string): string`
Valida o campo nome. Retorna mensagem de erro ou string vazia.

#### `validateLocation(location: string): string`
Valida o campo localização.

#### `validateContact(contact: string): string`
Valida o campo contacto.

#### `validateDeliveryDetails(details: DeliveryDetails): ValidationResult`
Valida todos os detalhes de entrega de uma vez.

```typescript
const result = validateDeliveryDetails(details)
if (!result.isValid) {
  console.log(result.errors) // { name?: string, location?: string, ... }
}
```

## 🛠️ Utils (`utils.ts`)

### Cálculos

#### `calculateItemTotal(prato: Prato, extra?: Extra | null): number`
Calcula o total de um item (prato + extras).

#### `calculateOrderTotal(items: OrderItem[]): number`
Calcula o total do pedido.

### Formatação

#### `formatPrice(price: number, showCurrency = true): string`
Formata um preço em MZN.
```typescript
formatPrice(250)        // "250 MZN"
formatPrice(250, false) // "250"
```

#### `getCustomizationSummary(customizations: Customizacoes): string`
Gera resumo das customizações.
```typescript
getCustomizationSummary(custom) // "Com Molho · Com Piripiri · + Frango extra"
```

### WhatsApp

#### `formatWhatsAppMessage(...): string`
Gera URL formatada para WhatsApp com o pedido completo.

### Arrays & Objects

- `isEmpty<T>(arr: T[]): boolean` - Verifica se array está vazio
- `removeAtIndex<T>(arr: T[], index: number): T[]` - Remove item por índice (imutável)
- `updateAtIndex<T>(arr: T[], index, newItem): T[]` - Atualiza item por índice (imutável)

### Strings

- `capitalize(str: string): string` - Capitaliza primeira letra
- `truncate(str: string, maxLength: number): string` - Trunca string

## 📖 Como Usar

### Importação Simples

```typescript
// Importar tudo do index
import { 
  Prato, 
  OrderItem, 
  validateName, 
  formatPrice,
  ROUTES,
  ERROR_MESSAGES 
} from '@/shared'
```

### Importação Específica

```typescript
// Importar de arquivos específicos
import type { Prato, OrderState } from '@/shared/types'
import { OPCOES_SAL, BREAKPOINTS } from '@/shared/constants'
import { validateDeliveryDetails } from '@/shared/validators'
import { calculateOrderTotal, formatPrice } from '@/shared/utils'
```

## 💡 Exemplos de Uso

### Validação de Formulário

```typescript
import { validateDeliveryDetails, ERROR_MESSAGES } from '@/shared'

const result = validateDeliveryDetails(formData)
if (!result.isValid) {
  setErrors(result.errors)
}
```

### Cálculo de Totais

```typescript
import { calculateItemTotal, calculateOrderTotal } from '@/shared'

const itemTotal = calculateItemTotal(prato, extra)
const orderTotal = calculateOrderTotal(orderItems)
```

### Formatação de Mensagem WhatsApp

```typescript
import { formatWhatsAppMessage } from '@/shared'

const whatsappUrl = formatWhatsAppMessage(
  orderItems,
  deliveryDetails,
  '258841234567'
)
```

### Uso de Constantes

```typescript
import { ROUTES, BREAKPOINTS, ERROR_MESSAGES } from '@/shared'

navigate(ROUTES.MENU)

if (window.innerWidth <= BREAKPOINTS.mobile) {
  // Lógica mobile
}

console.error(ERROR_MESSAGES.EMPTY_CART)
```

## 🎯 Benefícios

- ✅ **Type Safety** - Tipos fortes em toda a aplicação
- ✅ **DRY** - Não repita código
- ✅ **Testável** - Funções puras fáceis de testar
- ✅ **Manutenível** - Mudanças centralizadas
- ✅ **Documentado** - JSDoc em todas as funções
- ✅ **Reutilizável** - Pode ser usado em client/admin/mobile

## 🔄 Versionamento

Este módulo segue versionamento semântico:
- **Major**: Mudanças breaking (ex: remover tipos)
- **Minor**: Novas features (ex: adicionar validadores)
- **Patch**: Bug fixes e melhorias

---

**Versão Atual:** 1.0.0  
**Última Atualização:** 18 de Fevereiro de 2026
