import React, { createContext, useContext, useEffect, useState } from 'react';
import type {UserType, AuthContextType } from '../types';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // set default axios auth header if token exists
      try {
        // import axios lazily to avoid adding it as a top-level dependency here
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        // ignore if axios not available at this point
      }
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: UserType) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      delete axios.defaults.headers.common['Authorization'];
    } catch (e) {}
  };

  // Check if user is admin - handle both single role and roles array
  const isAdmin = user ? (
    user.role === 'admin' || 
    (Array.isArray(user.roles) && user.roles.includes('admin'))
  ) : false;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
};
