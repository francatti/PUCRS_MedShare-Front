import React from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Shield, Bell, Trash2, Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            <div>
              <CardTitle className="text-2xl font-bold">Configurações</CardTitle>
              <CardDescription>Gerencie suas preferências e configurações da conta</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Seção de Privacidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">Privacidade e Segurança</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Acesso público ativo</h4>
                  <p className="text-sm text-muted-foreground">Permite acesso às suas informações via link público</p>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0" 
                  />
                  <span className="ml-2 text-sm text-foreground">Ativar</span>
                </label>
              </div>
            </div>
          </div>

          {/* Seção de Notificações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">Notificações</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Email de acessos</h4>
                  <p className="text-sm text-muted-foreground">Receber email quando alguém acessar suas informações</p>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0" 
                  />
                  <span className="ml-2 text-sm text-foreground">Ativar</span>
                </label>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-medium text-destructive">Zona de Perigo</h3>
            </div>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive mb-2">Excluir conta</h4>
                    <p className="text-sm text-destructive/80 mb-4">
                      Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                    </p>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 