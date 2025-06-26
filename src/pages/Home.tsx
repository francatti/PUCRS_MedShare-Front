import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { 
  Shield, 
  Users, 
  Link as LinkIcon, 
  Smartphone, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Star
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
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
            <span className="text-2xl font-semibold text-foreground">MedShare</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Button asChild>
              <Link to="/register">
                Criar Conta
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="h-3 w-3 mr-1" />
          Projeto Acadêmico PUCRS
        </Badge>
        
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Suas Informações Médicas
          <br />
          <span className="text-primary">Sempre Acessíveis</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          O MedShare permite que você armazene com segurança suas informações médicas 
          e as compartilhe em situações de emergência através de um link público ou QR Code.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/register">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">
              Já tenho conta
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-lg">
            Três passos simples para ter suas informações médicas sempre disponíveis
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>1. Cadastre suas informações</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Adicione suas informações médicas, alergias, medicamentos e contatos de emergência de forma segura.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>2. Gere um link público</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Crie um link público protegido por senha que pode ser acessado em emergências.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>3. Compartilhe com QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Baixe o QR Code e mantenha-o consigo para acesso rápido às suas informações médicas.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Segurança e Privacidade
            </h2>
            <p className="text-xl text-muted-foreground">
              Suas informações médicas são protegidas com criptografia de nível bancário
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Criptografia AES-256</h3>
                  <p className="text-muted-foreground">
                    Suas informações médicas são criptografadas antes de serem armazenadas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Acesso Controlado</h3>
                  <p className="text-muted-foreground">
                    Links públicos protegidos por senha que você define
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Conformidade LGPD</h3>
                  <p className="text-muted-foreground">
                    Sistema desenvolvido em conformidade com a Lei Geral de Proteção de Dados
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Pronto para começar?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Crie sua conta gratuita e tenha suas informações médicas sempre acessíveis
        </p>
        <Button size="lg" asChild>
          <Link to="/register">
            Criar Conta Gratuita
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">MedShare</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Projeto acadêmico - PUCRS
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 MedShare. Sistema para compartilhamento seguro de informações médicas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 