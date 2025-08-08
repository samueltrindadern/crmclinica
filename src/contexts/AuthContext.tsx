import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';
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
    // Verifica se há usuário logado no Supabase
    const checkUser = async () => {
      try {
        const currentUser = await supabaseService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const currentUser = await supabaseService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await supabaseService.signInWithEmail(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
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
    supabaseService.signOut().then(() => {
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await supabaseService.resetPassword(email);
      toast.success('E-mail de recuperação enviado!');
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
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