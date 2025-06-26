import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext.tsx';
import { Loading } from '../common/Loading.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuthContext();

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return <Loading text="Verificando autenticação..." fullScreen />;
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderizar os children
  return <>{children}</>;
};

export default ProtectedRoute; 