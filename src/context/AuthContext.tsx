// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axiosConfig';
import { User, AuthData } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: AuthData) => Promise<void>;
  register: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get the current user from the /auth/me endpoint
        const response = await api.get('/auth/me');
        if (response.data) {
          // User is authenticated, set the user data
          setUser(response.data);
          // Optionally update localStorage for non-sensitive data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any stale data if authentication fails
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (data: AuthData) => {
    try {
      await api.post('/auth/signin', data);
      // After login, fetch the user data from /auth/me
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: AuthData) => {
    try {
      await api.post('/auth/signup', data);
      // After registration, automatically log in
      await login(data);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};