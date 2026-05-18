import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { User, LoginDto, RegisterDto } from '../types';
import { authApi } from '../services/auth.api';
import { STORAGE_KEYS } from '../constants';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
      })
      .catch(() => {
        // Token invalid/expired — clear storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (dto: LoginDto): Promise<void> => {
    const result = await authApi.login(dto);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
    setUser(result.user);
    toast.success(`Welcome back, ${result.user.name}!`);
  }, []);

  const register = useCallback(async (dto: RegisterDto): Promise<void> => {
    const result = await authApi.register(dto);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
    setUser(result.user);
    toast.success(`Welcome aboard, ${result.user.name}!`);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    toast.success('Signed out successfully');
  }, []);

  const updateUser = useCallback((updatedUser: User): void => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
