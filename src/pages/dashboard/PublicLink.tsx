import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { 
  Link2, 
  QrCode, 
  Share, 
  Copy, 
  Eye, 
  EyeOff, 
  Shield, 
  Globe,
  Settings,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Lock,
  Unlock,
  ExternalLink
} from 'lucide-react';
import { generateSecurePassword, validateSecurePassword } from '../../utils/validators.ts';
import { userService, apiUtils } from '../../services/api.ts';

interface PublicLinkInfo {
  has_public_link: boolean;
  has_public_password: boolean;
  link_url: string | null;
  owner_name: string;
}

export const PublicLink: React.FC = () => {
  const [linkInfo, setLinkInfo] = useState<PublicLinkInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Carregar informações do link público
  useEffect(() => {
    loadLinkInfo();
    // Tentar carregar senha do sessionStorage (caso tenha sido definida recentemente)
    const storedPassword = sessionStorage.getItem('medshare_temp_password');
    if (storedPassword) {
      setCurrentPassword(storedPassword);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLinkInfo = async () => {
    try {
      setInitialLoading(true);
      const response = await userService.getPublicLinkInfo();
      
      if (response.data.success && response.data.data) {
        setLinkInfo(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar informações do link:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const generateLink = async () => {
    setIsGenerating(true);
    setAlert(null);

    try {
      // Gerar senha segura automaticamente
      const securePassword = generateSecurePassword(12);
      
      const response = await userService.generatePublicLink({
        senha_acesso_publico: securePassword
      });

      if (response.data.success) {
        setCurrentPassword(securePassword); // Armazenar na state
        sessionStorage.setItem('medshare_temp_password', securePassword); // Persistir temporariamente
        setAlert({ type: 'success', message: 'Link público gerado com sucesso!' });
        await loadLinkInfo(); // Recarregar informações
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePassword = async () => {
    if (!newPassword.trim()) return;

    // Validar senha
    const validation = validateSecurePassword(newPassword);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    setLoading(true);
    setPasswordErrors([]);

    try {
      const response = await userService.generatePublicLink({
        senha_acesso_publico: newPassword.trim()
      });

      if (response.data.success) {
        setCurrentPassword(newPassword.trim()); // Atualizar senha atual
        sessionStorage.setItem('medshare_temp_password', newPassword.trim()); // Persistir temporariamente
        setAlert({ type: 'success', message: 'Senha atualizada com sucesso!' });
        setNewPassword('');
        setIsEditingPassword(false);
        await loadLinkInfo(); // Recarregar informações
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const disableLink = async () => {
    if (!window.confirm('Tem certeza que deseja desativar o link público? Isso impedirá o acesso às suas informações médicas via link.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await userService.disablePublicLink();
      
      if (response.data.success) {
        setCurrentPassword(''); // Limpar senha armazenada
        sessionStorage.removeItem('medshare_temp_password'); // Remover do sessionStorage
        setAlert({ type: 'success', message: 'Link público desativado com sucesso!' });
        await loadLinkInfo(); // Recarregar informações
      }
    } catch (error) {
      console.error('Erro ao desativar link:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string = 'Link') => {
    try {
      await navigator.clipboard.writeText(text);
      setAlert({ type: 'success', message: `${type} copiado para a área de transferência!` });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      setAlert({ type: 'error', message: `Erro ao copiar ${type.toLowerCase()} para área de transferência` });
    }
  };

  const downloadQRCode = async () => {
    try {
      const response = await userService.getQRCode();
      
      // Criar URL temporária para o blob
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      
      // Criar link temporário para download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medshare-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL temporária
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: 'QR Code baixado com sucesso!' });
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    }
  };

  const generateNewPassword = () => {
    const newSecurePassword = generateSecurePassword(12);
    setNewPassword(newSecurePassword);
    setPasswordErrors([]);
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Carregando configurações...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription className="text-sm">{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <Card>
        <CardHeader className="border-b p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Link2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg md:text-2xl font-bold">Link Público</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Gerencie o acesso público às suas informações médicas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!linkInfo?.has_public_link ? (
        /* Estado: Sem link gerado */
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="text-center py-8 md:py-12">
              <div className="mx-auto h-12 w-12 md:h-16 md:w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Link2 className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
                Link público não configurado
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Crie um link público para permitir acesso às suas informações médicas em emergências.
                <br className="hidden sm:block" />
                <strong>Uma senha segura será gerada automaticamente.</strong>
              </p>
              <Button 
                onClick={generateLink}
                disabled={isGenerating}
                size="sm"
                className="text-xs md:text-sm"
              >
                {isGenerating ? (
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                ) : (
                  <Share className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                )}
                Gerar Link Público
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Estado: Link ativo */
        <>
          {/* Informações do Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Link Público Ativo
              </CardTitle>
              <CardDescription>
                Seu link público está funcionando e pode ser usado em emergências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL do Link */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground">
                  URL do Link Público
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input 
                    value={linkInfo.link_url || ''} 
                    readOnly 
                    className="font-mono text-xs md:text-sm flex-1"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(linkInfo.link_url || '', 'Link')}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 sm:mr-0" />
                      <span className="sm:hidden">Copiar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(linkInfo.link_url || '', '_blank')}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 sm:mr-0" />
                      <span className="sm:hidden">Abrir</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Unlock className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    Protegido por senha
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Gerenciar Senha de Acesso
              </CardTitle>
              <CardDescription>
                Visualize ou altere a senha necessária para acessar suas informações médicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingPassword ? (
                <div className="space-y-4">
                  {/* Senha Atual */}
                  {currentPassword ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Senha Atual
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            readOnly
                            className="font-mono pr-20"
                          />
                          <div className="absolute right-2 top-2 flex gap-1">
                            <button
                              type="button"
                              className="p-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              title={showCurrentPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              type="button"
                              className="p-1 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(currentPassword, 'Senha')}
                              title="Copiar senha"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        💡 Esta senha foi gerada/alterada durante esta sessão e pode ser copiada
                      </p>
                    </div>
                  ) : (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Senha configurada:</strong> Existe uma senha protegendo seu link, mas por segurança ela não é exibida. 
                        Para visualizar uma nova senha, você pode alterá-la abaixo.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Botão para alterar */}
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        {currentPassword ? 'Senha visível' : 'Senha configurada'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentPassword 
                          ? 'Você pode copiar ou alterar a senha atual' 
                          : 'Altere a senha para poder visualizá-la e copiá-la'
                        }
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingPassword(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {currentPassword ? 'Alterar Senha' : 'Nova Senha'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nova Senha de Acesso
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Digite a nova senha"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={generateNewPassword}
                        title="Gerar senha segura"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Validação da senha */}
                    {passwordErrors.length > 0 && (
                      <div className="space-y-1">
                        {passwordErrors.map((error, index) => (
                          <p key={index} className="text-sm text-destructive">• {error}</p>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      <p><strong>Requisitos da senha:</strong></p>
                      <p>• Pelo menos 8 caracteres</p>
                      <p>• Pelo menos uma letra minúscula</p>
                      <p>• Pelo menos uma letra maiúscula</p>
                      <p>• Pelo menos um número</p>
                      <p>• Pelo menos um caractere especial</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={updatePassword}
                      disabled={loading || !newPassword.trim()}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="h-4 w-4 mr-2" />
                      )}
                      Atualizar Senha
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setNewPassword('');
                        setPasswordErrors([]);
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações do Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Compartilhamento
              </CardTitle>
              <CardDescription>
                Baixe o QR Code ou desative o link público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={downloadQRCode}
                  className="flex-1"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Baixar QR Code
                </Button>
                <Button
                  variant="destructive"
                  onClick={disableLink}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Desativar Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Informações de Segurança */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Segurança:</strong> Seu link público é protegido por senha e permite acesso apenas às informações médicas essenciais. 
          Compartilhe apenas com pessoas de confiança ou para uso em emergências.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PublicLink; 