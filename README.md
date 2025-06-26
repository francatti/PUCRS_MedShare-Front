# MedShare Frontend

Sistema acadêmico desenvolvido para a PUCRS que permite aos usuários armazenar informações médicas pessoais de forma segura e compartilhá-las publicamente através de links únicos com QR Code.

## 🎯 Sobre o Projeto

O **MedShare** é uma solução completa para situações de emergência onde informações médicas precisam ser acessadas rapidamente. O frontend foi desenvolvido com React.js, TypeScript e TailwindCSS, seguindo as melhores práticas de desenvolvimento e UX/UI.

## 🏗️ Arquitetura

### Stack Tecnológico
- **React.js 18** - Biblioteca principal para UI
- **TypeScript** - Tipagem estática para maior robustez
- **TailwindCSS** - Framework CSS utilitário
- **React Router Dom** - Roteamento client-side
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP para API
- **Headless UI** - Componentes acessíveis

### Estrutura de Diretórios

```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes básicos (Button, Input, etc)
│   └── layout/          # Componentes de layout (Navbar, Sidebar)
├── pages/               # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação
│   └── dashboard/      # Páginas do painel
├── contexts/           # Contextos React (Auth, etc)
├── services/           # Serviços da API
├── hooks/              # Hooks customizados
├── utils/              # Utilitários e helpers
└── types/              # Definições de tipos TypeScript
```

## 🚀 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação**
  - Login com JWT
  - Proteção de rotas
  - Context de autenticação
  - Logout automático

- **Dashboard Principal**
  - Overview das informações
  - Cards de status
  - Ações rápidas
  - Dicas de segurança

- **Layout Responsivo**
  - Navbar com navegação
  - Menu mobile
  - Footer informativo
  - Design system consistente

- **Componentes Reutilizáveis**
  - Sistema de botões
  - Inputs com validação
  - Cards e modais
  - Alertas e badges

### 🔄 Em Desenvolvimento
- Página de cadastro
- Formulário de informações médicas
- Gerenciamento de contatos de emergência
- Configuração de link público
- Página de perfil do usuário
- Recuperação de senha
- Acesso público via UUID

## 🎨 Design System

### Cores Principais
```css
--primary: #0ea5e9 (Sky Blue)
--secondary: #64748b (Slate)
--accent: #f2612d (Orange)
--success: #22c55e (Green)
--danger: #ef4444 (Red)
--warning: #f59e0b (Amber)
```

### Tipografia
- **Família Principal**: Inter (textos)
- **Família Títulos**: Poppins (headings)
- **Tamanhos**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Componentes Estilizados
- Botões com variantes (primary, secondary, outline, danger, success)
- Inputs com estados (normal, error, disabled)
- Cards com header, body e footer
- Alerts com diferentes tipos
- Badges e indicadores

## 🔐 Segurança

### Medidas Implementadas
- **Autenticação JWT** com cookies seguros
- **Proteção de rotas** automática
- **Interceptors Axios** para token management
- **Logout automático** em caso de token inválido
- **Validação client-side** com Zod
- **Sanitização de inputs** em formulários

### Configurações de Segurança
```typescript
// Configuração de cookies
Cookies.set('authToken', token, { 
  expires: 1, // 1 dia
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

## 📱 Responsividade

### Breakpoints TailwindCSS
- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

### Features Responsivas
- Navigation adaptável (mobile menu)
- Grid layouts flexíveis
- Tipografia escalável
- Spacing consistente
- Touch-friendly interfaces

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Backend do MedShare rodando

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/francatti/PUCRS_MedRH-Front.git
cd PUCRS_MedRH-Front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_ENV=development
```

4. **Execute a aplicação**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm build          # Build para produção
npm test           # Executa testes
npm run lint       # Executa linter
npm run format     # Formata código
```

## 🔧 Configuração de Desenvolvimento

### ESLint e Prettier
O projeto inclui configurações para:
- Linting automático
- Formatação de código
- Pre-commit hooks (futuro)

### Estrutura de Imports
```typescript
// Libs externas
import React from 'react';
import { Link } from 'react-router-dom';

// Contextos e hooks
import { useAuth } from '../../contexts/AuthContext';

// Componentes
import Button from '../../components/common/Button';

// Serviços e utils
import { userService } from '../../services/api';
```

## 🧪 Testes (Futuro)

### Estratégia de Testes
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress ou Playwright
- **E2E Tests**: Cypress
- **Visual Regression**: Chromatic

### Coverage Mínimo
- 80% para componentes críticos
- 60% para componentes utilitários
- 90% para services e utils

## 📦 Build e Deploy

### Build de Produção
```bash
npm run build
```

### Otimizações Incluídas
- Code splitting automático
- Tree shaking
- Minificação de assets
- Compressão gzip
- Cache busting

### Deploy Recomendado
- **Netlify** (recomendado para demo)
- **Vercel** (integração com Git)
- **AWS S3 + CloudFront**
- **Nginx** (servidor próprio)

## 🔗 Integração com Backend

### Base URL da API
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### Estrutura de Endpoints
```typescript
// Autenticação
POST /auth/login
POST /auth/register
POST /auth/forgot-password

// Usuário
GET /users/profile
PUT /users/profile
DELETE /users/account

// Informações médicas
GET /medical/info
PUT /medical/info

// Contatos de emergência
GET /emergency-contacts
POST /emergency-contacts
PUT /emergency-contacts/:id
DELETE /emergency-contacts/:id

// Público
POST /public/access/:uuid
```

## 📄 Licença

Este projeto é uma aplicação acadêmica desenvolvida para a PUCRS e não possui licença comercial.

## 👥 Contribuidores

- **Equipe MedShare** - Desenvolvimento
- **PUCRS** - Orientação acadêmica

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do backend
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se o backend está rodando
4. Consulte os logs do navegador (F12)

---

**MedShare** © 2025 - Projeto Acadêmico PUCRS 