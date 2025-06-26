import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Instância principal do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instância para API pública (sem interceptors de redirecionamento)
const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      Cookies.remove('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de dados
export interface User {
  id: number;
  email: string;
  nome: string;
  sobrenome: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  data_nascimento?: string;
  telefone?: string;
  link_publico_uuid?: string;
  data_cadastro: string;
  data_atualizacao: string;
}

export interface MedicalInfo {
  id: number;
  usuario_id: number;
  tipo_sanguineo?: string;
  alergias: string[];
  medicamentos: string[];
  doencas: string[];
  cirurgias: string[];
  data_atualizacao: string;
}

export interface EmergencyContact {
  id: number;
  usuario_id: number;
  nome_contato: string;
  parentesco?: string;
  telefone_contato: string;
}

export interface PublicProfile {
  nome: string;
  sobrenome: string;
  nome_completo: string;
  sexo?: string;
  data_nascimento?: string;
  idade?: number;
  telefone?: string;
  informacoes_medicas: {
    tipo_sanguineo?: string;
    alergias: string[];
    medicamentos: string[];
    doencas: string[];
    cirurgias: string[];
  };
  contatos_emergencia: EmergencyContact[];
  data_acesso: string;
}

// Interfaces para requests
export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  email: string;
  senha: string;
  nome: string;
  sobrenome: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  data_nascimento?: string;
  telefone?: string;
  consentimento: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  nova_senha: string;
}

export interface UpdateProfileData {
  nome?: string;
  sobrenome?: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  data_nascimento?: string;
  telefone?: string;
}

export interface UpdatePasswordData {
  senha_atual: string;
  nova_senha: string;
}

export interface UpdateMedicalData {
  tipo_sanguineo?: string;
  alergias?: string[];
  medicamentos?: string[];
  doencas?: string[];
  cirurgias?: string[];
}

export interface CreateEmergencyContactData {
  nome_contato: string;
  parentesco?: string;
  telefone_contato: string;
}

export interface UpdateEmergencyContactData {
  nome_contato?: string;
  parentesco?: string;
  telefone_contato?: string;
}

export interface PublicLinkData {
  senha_acesso_publico: string;
}

export interface PublicAccessData {
  senha: string;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

// Serviços de autenticação
export const authService = {
  login: (data: LoginData): Promise<AxiosResponse<ApiResponse<{token: string; user: User}>>> => 
    api.post('/auth/login', data),
  
  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<{token: string; user: User}>>> => 
    api.post('/auth/register', data),
  
  forgotPassword: (data: ForgotPasswordData): Promise<AxiosResponse<ApiResponse>> => 
    api.post('/auth/forgot-password', data),
  
  resetPassword: (data: ResetPasswordData): Promise<AxiosResponse<ApiResponse>> => 
    api.post('/auth/reset-password', data),

  verifyResetToken: (token: string): Promise<AxiosResponse<ApiResponse>> => 
    api.get(`/auth/verify-reset-token/${token}`),
  
  logout: () => {
    Cookies.remove('authToken');
    window.location.href = '/login';
  },
};

// Serviços de usuário
export const userService = {
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.get('/users/profile'),
  
  updateProfile: (data: UpdateProfileData): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put('/users/profile', data),

  updatePassword: (data: UpdatePasswordData): Promise<AxiosResponse<ApiResponse>> => 
    api.put('/users/password', data),
  
  generatePublicLink: (data: PublicLinkData): Promise<AxiosResponse<ApiResponse<{ link_publico_uuid: string; link_url: string }>>> => 
    api.post('/users/generate-public-link', data),

  getPublicLinkInfo: (): Promise<AxiosResponse<ApiResponse<{ has_public_link: boolean; has_public_password: boolean; link_url: string | null; owner_name: string }>>> => 
    api.get('/users/public-link-info'),

  disablePublicLink: (): Promise<AxiosResponse<ApiResponse>> => 
    api.delete('/users/public-link'),
  
  getQRCode: (): Promise<AxiosResponse<Blob>> => 
    api.get('/users/qr-code', { responseType: 'blob' }),
  
  deleteAccount: (senha: string): Promise<AxiosResponse<ApiResponse>> => 
    api.delete('/users/account', { data: { senha } }),
};

// Serviços de informações médicas
export const medicalService = {
  getMedicalInfo: (): Promise<AxiosResponse<ApiResponse<MedicalInfo>>> => 
    api.get('/medical/info'),
  
  updateMedicalInfo: (data: UpdateMedicalData): Promise<AxiosResponse<ApiResponse<MedicalInfo>>> => 
    api.put('/medical/info', data),

  clearMedicalInfo: (): Promise<AxiosResponse<ApiResponse>> => 
    api.delete('/medical/info'),
};

// Serviços de contatos de emergência
export const emergencyContactService = {
  getContacts: (): Promise<AxiosResponse<ApiResponse<EmergencyContact[]>>> => 
    api.get('/emergency-contacts'),

  getContact: (id: number): Promise<AxiosResponse<ApiResponse<EmergencyContact>>> => 
    api.get(`/emergency-contacts/${id}`),
  
  createContact: (data: CreateEmergencyContactData): Promise<AxiosResponse<ApiResponse<EmergencyContact>>> => 
    api.post('/emergency-contacts', data),
  
  updateContact: (id: number, data: UpdateEmergencyContactData): Promise<AxiosResponse<ApiResponse<EmergencyContact>>> => 
    api.put(`/emergency-contacts/${id}`, data),

  deleteContact: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/emergency-contacts/${id}`),
};

// Serviços de acesso público
export const publicService = {
  checkPublicLink: (uuid: string): Promise<AxiosResponse<ApiResponse<{ exists: boolean; owner_name: string; has_password: boolean }>>> => 
    publicApi.get(`/public/check/${uuid}`),

  getPublicProfileStats: (uuid: string): Promise<AxiosResponse<ApiResponse<{ nome: string; sobrenome: string; nome_completo: string; idade: number | null; total_contatos_emergencia: number; tem_informacoes_medicas: boolean; necessita_senha: boolean }>>> => 
    publicApi.get(`/public/stats/${uuid}`),

  getPublicProfile: (uuid: string, data: PublicAccessData): Promise<AxiosResponse<ApiResponse<PublicProfile>>> => 
    publicApi.post(`/public/profile/${uuid}`, data),
};

// Utilitários de API
export const apiUtils = {
  setAuthToken: (token: string) => {
    Cookies.set('authToken', token, { 
      expires: 7, // 7 dias
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  removeAuthToken: () => {
    Cookies.remove('authToken');
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('authToken');
  },

  handleApiError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors?.length > 0) {
      return error.response.data.errors[0].message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Erro inesperado. Tente novamente.';
  }
};

export default api; 