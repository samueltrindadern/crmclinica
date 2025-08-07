import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { database } from '../services/database';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário logado no localStorage
    const savedUser = localStorage.getItem('checkup-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await database.authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('checkup-user', JSON.stringify(authenticatedUser));
        toast.success('Login realizado com sucesso!');
        return true;
      } else {
        toast.error('E-mail ou senha incorretos');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('checkup-user');
    toast.success('Logout realizado com sucesso!');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const user = await database.getUser(email);
      if (user) {
        // Simula envio de e-mail de recuperação
        toast.success('E-mail de recuperação enviado!');
        return true;
      } else {
        toast.error('E-mail não encontrado');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao enviar e-mail de recuperação');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}