import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Phone, Clock, CheckCircle, AlertCircle, ExternalLink, QrCode } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { userService, medicalService, emergencyContactService } from '../../services/api.ts';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';

interface DashboardStats {
  hasPublicLink: boolean;
  hasMedicalInfo: boolean;
  emergencyContactsCount: number;
  lastUpdate: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    hasPublicLink: false,
    hasMedicalInfo: false,
    emergencyContactsCount: 0,
    lastUpdate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [medicalResponse, contactsResponse] = await Promise.all([
          medicalService.getMedicalInfo().catch(() => null),
          emergencyContactService.getContacts(),
        ]);

        // Verificar se as informações médicas foram realmente preenchidas
        const checkMedicalInfoComplete = (data: any) => {
          if (!data) return false;
          
          const hasBloodType = !!data.tipo_sanguineo;
          const hasAllergies = data.alergias && data.alergias.length > 0;
          const hasMedicines = data.medicamentos && data.medicamentos.length > 0;
          const hasDiseases = data.doencas && data.doencas.length > 0;
          const hasSurgeries = data.cirurgias && data.cirurgias.length > 0;
          
          // Considera completo se pelo menos tipo sanguíneo OU algum outro campo estiver preenchido
          return hasBloodType || hasAllergies || hasMedicines || hasDiseases || hasSurgeries;
        };

        setStats({
          hasPublicLink: !!user?.link_publico_uuid,
          hasMedicalInfo: checkMedicalInfoComplete(medicalResponse?.data?.data),
          emergencyContactsCount: contactsResponse?.data?.data?.length || 0,
          lastUpdate: medicalResponse?.data?.data?.data_atualizacao || '',
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const downloadQRCode = async () => {
    try {
      const response = await userService.getQRCode();
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medshare-qr-${user?.nome?.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Bem-vindo(a), {user?.nome}!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center ${
                  stats.hasPublicLink ? 'bg-green-100' : 'bg-muted'
                }`}>
                  <ExternalLink className={`h-5 w-5 md:h-6 md:w-6 ${
                    stats.hasPublicLink ? 'text-green-600' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Link Público</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-lg md:text-2xl font-bold">
                    {stats.hasPublicLink ? 'Ativo' : 'Inativo'}
                  </p>
                    {stats.hasPublicLink ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                        Configurado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <AlertCircle className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center ${
                  stats.hasMedicalInfo ? 'bg-blue-100' : 'bg-muted'
                }`}>
                  <FileText className={`h-5 w-5 md:h-6 md:w-6 ${
                    stats.hasMedicalInfo ? 'text-blue-600' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Info. Médicas</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-lg md:text-2xl font-bold">
                    {stats.hasMedicalInfo ? 'Completo' : 'Pendente'}
                  </p>
                    {stats.hasMedicalInfo ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                        <CheckCircle className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                        Preenchido
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <AlertCircle className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                        Incompleto
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
            </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Contatos Emergência</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-lg md:text-2xl font-bold">{stats.emergencyContactsCount}</p>
                    <Badge variant="outline" className="text-xs">
                      {stats.emergencyContactsCount > 0 ? 'Cadastrados' : 'Nenhum'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {stats.lastUpdate 
                      ? new Date(stats.lastUpdate).toLocaleDateString('pt-BR') 
                      : 'Nunca'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                Informações Médicas
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Gerencie suas informações médicas de forma segura
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm">Status:</span>
                  {stats.hasMedicalInfo ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      Completo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Incompleto
                    </Badge>
                  )}
                    </div>
                <Button asChild className="w-full" size="sm">
                  <Link to="/medical">
                    <span className="text-xs md:text-sm">
                      {stats.hasMedicalInfo ? 'Editar Informações' : 'Adicionar Informações'}
                    </span>
                </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
                Contatos de Emergência
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Cadastre pessoas para serem contatadas em emergências
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm">Cadastrados:</span>
                  <Badge variant="outline" className="text-xs">
                    {stats.emergencyContactsCount} contato{stats.emergencyContactsCount !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link to="/emergency-contacts">
                    <span className="text-xs md:text-sm">Gerenciar Contatos</span>
                  </Link>
                </Button>
                    </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                Link Público
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configure e gerencie seu link público de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm">Status:</span>
                  {stats.hasPublicLink ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Inativo
                    </Badge>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link to="/public-link">
                    <span className="text-xs md:text-sm">
                      {stats.hasPublicLink ? 'Gerenciar Link' : 'Criar Link'}
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
                    </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-sm md:text-base font-semibold text-blue-900">
                  Suas informações estão seguras
                </h3>
                <p className="text-blue-800 text-xs md:text-sm leading-relaxed">
                  Todas as informações médicas são criptografadas com AES-256 e só podem ser acessadas 
                  por você ou pessoas autorizadas via link público com senha.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 