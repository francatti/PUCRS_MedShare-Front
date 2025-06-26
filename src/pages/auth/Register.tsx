import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { 
  emailValidator, 
  passwordValidator, 
  nameValidator, 
  dateValidator, 
  phoneValidator,
  formatPhone 
} from '../../utils/validators.ts';
import { User, Mail, Lock, Phone, Calendar, Shield, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormData {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro' | '';
  data_nascimento: string;
  telefone: string;
  consentimento: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    sexo: '',
    data_nascimento: '',
    telefone: '',
    consentimento: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nome
    if (!nameValidator(formData.nome)) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres e conter apenas letras';
    }

    // Validar sobrenome
    if (!nameValidator(formData.sobrenome)) {
      newErrors.sobrenome = 'Sobrenome deve ter pelo menos 2 caracteres e conter apenas letras';
    }

    // Validar email
    if (!emailValidator(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    const passwordValidation = passwordValidator(formData.senha);
    if (!passwordValidation.isValid) {
      newErrors.senha = passwordValidation.errors[0];
    }

    // Validar confirmação de senha
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    // Validar data de nascimento (opcional)
    if (formData.data_nascimento && !dateValidator(formData.data_nascimento)) {
      newErrors.data_nascimento = 'Data de nascimento inválida';
    }

    // Validar telefone (opcional)
    if (formData.telefone && !phoneValidator(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    // Validar consentimento
    if (!formData.consentimento) {
      newErrors.consentimento = 'É necessário aceitar os termos e condições';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));

    if (errors.telefone) {
      setErrors(prev => ({
        ...prev,
        telefone: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const registerData = {
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
        sexo: formData.sexo || undefined,
        data_nascimento: formData.data_nascimento || undefined,
        telefone: formData.telefone || undefined,
        consentimento: formData.consentimento
      };

      const result = await register(registerData);

      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">MedShare</h1>
          <h2 className="mt-6 text-2xl font-semibold text-foreground">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              faça login se já possui uma conta
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Crie sua conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta no MedShare
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium text-foreground">
                    Nome *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nome"
                      type="text"
                      className="pl-10"
                      placeholder="João"
                      value={formData.nome}
                      onChange={handleInputChange('nome')}
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-sm text-destructive">{errors.nome}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="sobrenome" className="text-sm font-medium text-foreground">
                    Sobrenome *
                  </label>
                  <Input
                    id="sobrenome"
                    type="text"
                    placeholder="Silva"
                    value={formData.sobrenome}
                    onChange={handleInputChange('sobrenome')}
                  />
                  {errors.sobrenome && (
                    <p className="text-sm text-destructive">{errors.sobrenome}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="joao@email.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Senhas */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="senha" className="text-sm font-medium text-foreground">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={handleInputChange('senha')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-sm text-destructive">{errors.senha}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange('confirmarSenha')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-sm text-destructive">{errors.confirmarSenha}</p>
                  )}
                </div>
              </div>

              {/* Campos opcionais */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Informações Adicionais (Opcional)</h3>
                
                {/* Sexo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sexo</label>
                  <Select value={formData.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sexo && (
                    <p className="text-sm text-destructive">{errors.sexo}</p>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-2">
                  <label htmlFor="data_nascimento" className="text-sm font-medium text-foreground">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="data_nascimento"
                      type="date"
                      className="pl-10"
                      value={formData.data_nascimento}
                      onChange={handleInputChange('data_nascimento')}
                    />
                  </div>
                  {errors.data_nascimento && (
                    <p className="text-sm text-destructive">{errors.data_nascimento}</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-sm font-medium text-foreground">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      type="tel"
                      className="pl-10"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-sm text-destructive">{errors.telefone}</p>
                  )}
                </div>
              </div>

              {/* Consentimento */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    id="consentimento"
                    type="checkbox"
                    className="mt-1"
                    checked={formData.consentimento}
                    onChange={handleInputChange('consentimento')}
                  />
                  <label htmlFor="consentimento" className="text-sm text-foreground">
                    Eu aceito os{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      termos de uso
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      política de privacidade
                    </a>
                  </label>
                </div>
                {errors.consentimento && (
                  <p className="text-sm text-destructive">{errors.consentimento}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;