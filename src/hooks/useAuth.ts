import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.tsx';
import { authService, apiUtils } from '../services/api.ts';
import { LoginData, RegisterData, ForgotPasswordData, ResetPasswordData } from '../services/api.ts';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  const { user, setUser, loading, setLoading } = context;
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      const { token, user: userData } = response.data;
      
      apiUtils.setAuthToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      const { token, user: newUser } = response.data;
      
      apiUtils.setAuthToken(token);
      setUser(newUser);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.forgotPassword(data);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.resetPassword(data);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyResetToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.verifyResetToken(token);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    apiUtils.removeAuthToken();
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    logout,
    clearError,
    isAuthenticated: !!user
  };
}; 