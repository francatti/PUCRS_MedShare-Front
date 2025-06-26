// Configurações da aplicação
export const APP_CONFIG = {
  name: 'MedShare',
  version: '1.0.0',
  description: 'Sistema de Compartilhamento de Informações Médicas',
  author: 'Equipe MedShare - PUCRS',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
} as const;

// Configurações de autenticação
export const AUTH_CONFIG = {
  tokenKey: 'authToken',
  cookieExpiration: 1, // dias
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
} as const;

// Rotas da aplicação
export const ROUTES = {
  // Públicas
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Privadas
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MEDICAL_INFO: '/medical-info',
  EMERGENCY_CONTACTS: '/emergency-contacts',
  PUBLIC_LINK: '/public-link',
  SETTINGS: '/settings',
  
  // Públicas especiais
  PUBLIC_ACCESS: '/public/:uuid',
} as const;

// Configurações de UI
export const UI_CONFIG = {
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Animações
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  GENERIC_ERROR: 'Algo deu errado. Tente novamente.',
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  MEDICAL_INFO_UPDATED: 'Informações médicas atualizadas!',
  CONTACT_ADDED: 'Contato de emergência adicionado!',
  CONTACT_UPDATED: 'Contato de emergência atualizado!',
  CONTACT_DELETED: 'Contato de emergência removido!',
  PUBLIC_LINK_GENERATED: 'Link público gerado com sucesso!',
  QR_CODE_DOWNLOADED: 'QR Code baixado com sucesso!',
} as const;

// Configurações de validação
export const VALIDATION_CONFIG = {
  email: {
    min: 5,
    max: 255,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    min: 6,
    max: 128,
    requireNumbers: true,
    requireUppercase: false,
    requireSpecialChars: false,
  },
  name: {
    min: 2,
    max: 100,
  },
  phone: {
    min: 10,
    max: 20,
    regex: /^[\+]?[1-9][\d]{0,15}$/,
  },
  publicPassword: {
    min: 4,
    max: 50,
  },
} as const;

// Tipos sanguíneos disponíveis
export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

// Sexo/Gênero opções
export const GENDER_OPTIONS = [
  'Masculino',
  'Feminino',
  'Outro',
] as const;

// Parentesco opções
export const RELATIONSHIP_OPTIONS = [
  'Pai',
  'Mãe',
  'Irmão',
  'Irmã',
  'Cônjuge',
  'Filho',
  'Filha',
  'Avô',
  'Avó',
  'Tio',
  'Tia',
  'Primo',
  'Prima',
  'Amigo',
  'Outro',
] as const;

// Configurações de arquivos
export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  qrCodeFormat: 'png',
} as const;

export type BloodType = typeof BLOOD_TYPES[number];
export type GenderOption = typeof GENDER_OPTIONS[number];
export type RelationshipOption = typeof RELATIONSHIP_OPTIONS[number]; 