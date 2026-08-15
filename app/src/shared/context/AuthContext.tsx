import { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../../domains/auth/types';
import { setAccessToken } from '../lib/axios';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync axios token when state changes
    setAccessToken(accessToken);
  }, [accessToken]);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    setAccessTokenState(token);
  };

  const logout = () => {
    setUser(null);
    setAccessTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, setUser, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
