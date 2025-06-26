import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, userService, apiUtils } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && apiUtils.isAuthenticated();

  // Função para buscar dados do usuário
  const fetchUser = async (): Promise<void> => {
    try {
      if (apiUtils.isAuthenticated()) {
        const response = await userService.getProfile();
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      apiUtils.removeAuthToken();
      setUser(null);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Função para recarregar dados do usuário
  const refreshUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await fetchUser();
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiUtils.isAuthenticated()) {
          await fetchUser();
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        apiUtils.removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    setLoading,
    isAuthenticated,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 