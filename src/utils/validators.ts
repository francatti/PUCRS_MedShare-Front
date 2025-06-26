// Validadores para formulários

export const emailValidator = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidator = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const phoneValidator = (phone: string): boolean => {
  if (!phone) return true; // Campo opcional
  
  // Regex para telefones brasileiros
  const phoneRegex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}\s?-?\s?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const nameValidator = (name: string): boolean => {
  if (!name || name.trim().length < 2) return false;
  
  // Apenas letras, acentos e espaços
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return nameRegex.test(name.trim());
};

export const dateValidator = (date: string): boolean => {
  if (!date) return true; // Campo opcional
  
  const inputDate = new Date(date);
  const today = new Date();
  
  // Data deve ser válida e anterior à data atual
  return !isNaN(inputDate.getTime()) && inputDate < today;
};

export const bloodTypeValidator = (bloodType: string): boolean => {
  if (!bloodType) return true; // Campo opcional
  
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(bloodType);
};

export const medicalArrayValidator = (items: string[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!Array.isArray(items)) {
    errors.push('Deve ser uma lista válida');
    return { isValid: false, errors };
  }
  
  if (items.length > 50) {
    errors.push('Máximo de 50 itens permitidos');
  }
  
  items.forEach((item, index) => {
    if (typeof item !== 'string') {
      errors.push(`Item ${index + 1} deve ser um texto`);
    } else if (item.trim().length === 0) {
      errors.push(`Item ${index + 1} não pode estar vazio`);
    } else if (item.length > 500) {
      errors.push(`Item ${index + 1} muito longo (máximo 500 caracteres)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const publicPasswordValidator = (password: string): boolean => {
  return !!(password && password.length >= 6);
};

// Utilitário para limpar e normalizar strings
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

// Utilitário para formatar telefone brasileiro
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Utilitário para validar CPF (básico)
export const cpfValidator = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf[10])) return false;
  
  return true;
};

// Função para gerar senha segura automaticamente
export const generateSecurePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Garantir pelo menos um caractere de cada tipo
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Preencher o resto da senha
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralhar os caracteres
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// Validador de senha segura
export const validateSecurePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 