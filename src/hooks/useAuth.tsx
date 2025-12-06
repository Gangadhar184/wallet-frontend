import { createContext, useContext, useState, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '@/services/authService';
import type { AuthContextType, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import type { AxiosError } from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize auth state from localStorage synchronously (no useEffect needed)
function getInitialAuthState(): AuthResponse | null {
  return authService.getAuthData();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(getInitialAuthState);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      authService.setAuthData(data);
      setUser(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      authService.setAuthData(data);
      setUser(data);
      toast.success('Registration successful! Welcome bonus added.');
      navigate('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = () => {
    authService.clearAuthData();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        login,
        register,
        logout,
      }}
    >
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

