import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  User, 
  Heart, 
  Phone, 
  Droplet,
  Pill,
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  Stethoscope,
  Users
} from 'lucide-react';
import { publicService, apiUtils, PublicProfile as PublicProfileData } from '../../services/api.ts';

export const PublicProfile: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [checkingLink, setCheckingLink] = useState(true);
  const [linkExists, setLinkExists] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [hasPassword, setHasPassword] = useState(false);

  // Verificar se o link existe ao carregar a página
  useEffect(() => {
    if (uuid) {
      checkPublicLink();
    }
  }, [uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkPublicLink = async () => {
    try {
      setCheckingLink(true);
      const response = await publicService.checkPublicLink(uuid!);
      
      if (response.data.success && response.data.data) {
        setLinkExists(response.data.data.exists);
        setOwnerName(response.data.data.owner_name);
        setHasPassword(response.data.data.has_password);
      } else {
        setLinkExists(false);
      }
    } catch (error) {
      console.error('Erro ao verificar link:', error);
      setLinkExists(false);
      setAlert({ 
        type: 'error', 
        message: 'Erro ao verificar a validade do link' 
      });
    } finally {
      setCheckingLink(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setAlert({ type: 'error', message: 'Por favor, digite a senha' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await publicService.getPublicProfile(uuid!, {
        senha: password.trim()
      });

      if (response.data.success && response.data.data) {
        setProfileData(response.data.data);
        setAuthenticated(true);
        setAlert({ type: 'success', message: 'Acesso autorizado com sucesso' });
      }
    } catch (error) {
      console.error('Erro ao acessar perfil:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAge = (age: number | null | undefined) => {
    if (!age) return 'Não informado';
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading inicial para verificar link
  if (checkingLink) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Verificando link...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Se o link não existe
  if (!linkExists) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              MedShare
            </h1>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Link Não Encontrado
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              O link que você está tentando acessar não existe ou foi desativado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se autenticado, mostrar perfil
  if (authenticated && profileData) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            {/* Header de Emergência */}
            <CardHeader className="bg-destructive text-destructive-foreground">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle className="text-xl font-bold">Informações Médicas de Emergência</CardTitle>
              </div>
              <CardDescription className="text-destructive-foreground/80">
                Perfil de {profileData.nome_completo}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Informações Pessoais */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Nome Completo:</span>
                      <p className="text-foreground font-medium">{profileData.nome_completo}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Idade:</span>
                      <p className="text-foreground font-medium">{formatAge(profileData.idade)}</p>
                    </div>
                    {profileData.sexo && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Sexo:</span>
                        <p className="text-foreground font-medium">{profileData.sexo}</p>
                      </div>
                    )}
                    {profileData.telefone && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Telefone:</span>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <p className="text-foreground font-medium">{profileData.telefone}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Informações Médicas */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <CardTitle className="text-lg">Informações Médicas</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Tipo Sanguíneo:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Droplet className="h-4 w-4 text-red-600" />
                        {profileData.informacoes_medicas.tipo_sanguineo ? (
                          <Badge variant="destructive" className="text-lg font-bold">
                            {profileData.informacoes_medicas.tipo_sanguineo}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Não informado</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Alergias:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profileData.informacoes_medicas.alergias.length > 0 ? (
                          profileData.informacoes_medicas.alergias.map((alergia, index) => (
                            <Badge key={index} variant="destructive">{alergia}</Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhuma alergia conhecida</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Medicamentos:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profileData.informacoes_medicas.medicamentos.length > 0 ? (
                          profileData.informacoes_medicas.medicamentos.map((medicamento, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              <Pill className="h-3 w-3" />
                              {medicamento}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhum medicamento regular</span>
                        )}
                      </div>
                    </div>

                    {profileData.informacoes_medicas.doencas.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Doenças/Condições:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.informacoes_medicas.doencas.map((doenca, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {doenca}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profileData.informacoes_medicas.cirurgias.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Cirurgias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.informacoes_medicas.cirurgias.map((cirurgia, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              {cirurgia}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contatos de Emergência */}
              {profileData.contatos_emergencia.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">Contatos de Emergência</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profileData.contatos_emergencia.map((contato, index) => (
                        <Card key={contato.id} className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{contato.nome_contato}</h4>
                                {contato.parentesco && (
                                  <p className="text-sm text-muted-foreground">{contato.parentesco}</p>
                                )}
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="h-3 w-3 text-green-600" />
                                  <p className="text-sm font-medium text-green-600">{contato.telefone_contato}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alert se não há contatos */}
              {profileData.contatos_emergencia.length === 0 && (
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum contato de emergência cadastrado para este usuário.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            {/* Footer */}
            <CardContent className="bg-muted/50 border-t">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <p>
                  Acesso realizado em {formatDate(profileData.data_acesso)} • MedShare
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de autenticação
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            MedShare
          </h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Acesso a Informações Médicas
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Digite a senha para acessar as informações médicas de emergência de <strong>{ownerName}</strong>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso Protegido
            </CardTitle>
            <CardDescription>
              Esta página contém informações médicas sensíveis
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {alert && (
              <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                {alert.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    required
                    className="pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !password.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Acessar Informações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações de segurança */}
        <Alert className="mt-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Segurança:</strong> Esta página é protegida e registra acessos para fins de segurança. 
            Use apenas em situações de emergência médica.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PublicProfile; 