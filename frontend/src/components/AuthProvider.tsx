import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of routes that require authentication
const protectedRoutes = ['/map', '/forum', '/profile'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      setUserName('User'); // Set a default user name or fetch it from the backend if needed
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const login = (token: string) => {
    localStorage.setItem('jwtToken', token);
    setIsAuthenticated(true);
    setUserName('User'); // Set a default user name or fetch it from the backend if needed
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUserName(null);
    navigate('/', { replace: true });
  };

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};