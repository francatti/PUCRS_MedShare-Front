import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { useAuthContext } from '../../contexts/AuthContext.tsx';
import { userService } from '../../services/api.ts';
import { User, Mail, Phone, Calendar, Lock, Edit, Save, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ProfileFormData {
  nome: string;
  sobrenome: string;
  email: string;
  sexo: string;
  data_nascimento: string;
  telefone: string;
}

interface PasswordFormData {
  senha_atual: string;
  nova_senha: string;
  confirmar_senha: string;
}

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    nome: '',
    sobrenome: '',
    email: '',
    sexo: '',
    data_nascimento: '',
    telefone: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (user) {
      const newProfileData = {
        nome: user.nome || '',
        sobrenome: user.sobrenome || '',
        email: user.email || '',
        sexo: user.sexo || '',
        data_nascimento: user.data_nascimento || '',
        telefone: user.telefone || ''
      };
      setProfileData(newProfileData);
    }
  }, [user]);

  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      // Verificar se os dados obrigatórios existem
      if (!profileData || !profileData.nome || !profileData.sobrenome) {
        setAlert({ type: 'error', message: 'Nome e sobrenome são obrigatórios' });
        setLoading(false);
        return;
      }

      const updateData = {
        nome: profileData.nome.trim(),
        sobrenome: profileData.sobrenome.trim(),
        sexo: profileData.sexo && profileData.sexo !== '' ? profileData.sexo as 'Masculino' | 'Feminino' | 'Outro' : undefined,
        data_nascimento: profileData.data_nascimento && profileData.data_nascimento !== '' ? profileData.data_nascimento : undefined,
        telefone: profileData.telefone && profileData.telefone !== '' ? profileData.telefone.trim() : undefined
      };

      const response = await userService.updateProfile(updateData);
      
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Perfil atualizado com sucesso!' });
        
        // Compatibilidade com ambas estruturas de resposta (data ou user)
        const updatedUserData = response.data.data || (response.data as any).user;
        
        if (updatedUserData) {
          updateUser(updatedUserData);
          
          // Atualizar estado local com dados retornados do servidor
          setProfileData({
            nome: updatedUserData.nome || '',
            sobrenome: updatedUserData.sobrenome || '',
            email: updatedUserData.email || '',
            sexo: updatedUserData.sexo || '',
            data_nascimento: updatedUserData.data_nascimento || '',
            telefone: updatedUserData.telefone || ''
          });
        }
        
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      
      let errorMessage = 'Erro ao atualizar perfil';
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar erros de validação específicos
        const validationErrors = error.response.data.errors.map((err: any) => 
          `${err.field}: ${err.message}`
        ).join(', ');
        errorMessage = `Erro de validação: ${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setAlert({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setAlert(null);

    // Validar se as senhas coincidem
    if (passwordData.nova_senha !== passwordData.confirmar_senha) {
      setAlert({ type: 'error', message: 'As novas senhas não coincidem' });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await userService.updatePassword({
        senha_atual: passwordData.senha_atual,
        nova_senha: passwordData.nova_senha
      });

      if (response.data.success) {
        setAlert({ type: 'success', message: 'Senha alterada com sucesso!' });
        setPasswordData({
          senha_atual: '',
          nova_senha: '',
          confirmar_senha: ''
        });
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erro ao alterar senha' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        nome: user.nome || '',
        sobrenome: user.sobrenome || '',
        email: user.email || '',
        sexo: user.sexo || '',
        data_nascimento: user.data_nascimento || '',
        telefone: user.telefone || ''
      });
    }
    setIsEditing(false);
    setAlert(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Alert */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription className="text-sm">{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <Card>
        <CardHeader className="border-b p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg md:text-2xl font-bold">Perfil</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Gerencie suas informações pessoais
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informações do Perfil */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <User className="h-4 w-4 md:h-5 md:w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Suas informações básicas de perfil
              </CardDescription>
            </div>
            <div className="flex gap-2 md:gap-3">
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)} size="sm" className="text-xs md:text-sm">
                  <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleProfileSubmit} className="space-y-4 md:space-y-6">
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground">
                  Nome *
                </label>
                <Input
                  value={profileData.nome}
                  onChange={(e) => handleProfileChange('nome', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground">
                  Sobrenome *
                </label>
                <Input
                  value={profileData.sobrenome}
                  onChange={(e) => handleProfileChange('sobrenome', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  className="pl-10"
                  placeholder="seu@email.com"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            {/* Sexo */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Sexo
              </label>
              <Select 
                value={profileData.sexo} 
                onValueChange={(value) => handleProfileChange('sexo', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={profileData.data_nascimento}
                  onChange={(e) => handleProfileChange('data_nascimento', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={profileData.telefone}
                  onChange={(e) => handleProfileChange('telefone', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Botões de ação */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 md:pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleCancelEdit} size="sm" className="text-xs md:text-sm">
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} size="sm" className="text-xs md:text-sm">
                  {loading && <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />}
                  <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Salvar </span>Alterações
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Lock className="h-4 w-4 md:h-5 md:w-5" />
            Segurança
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Altere sua senha de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Senha Atual
              </label>
              <Input
                type="password"
                value={passwordData.senha_atual}
                onChange={(e) => handlePasswordChange('senha_atual', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Nova Senha
              </label>
              <Input
                type="password"
                value={passwordData.nova_senha}
                onChange={(e) => handlePasswordChange('nova_senha', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground">
                Confirmar Nova Senha
              </label>
              <Input
                type="password"
                value={passwordData.confirmar_senha}
                onChange={(e) => handlePasswordChange('confirmar_senha', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 md:pt-6 border-t">
              <Button type="submit" disabled={passwordLoading} size="sm" className="text-xs md:text-sm">
                {passwordLoading && <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />}
                Alterar Senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 