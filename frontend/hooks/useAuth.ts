import { useState, useEffect, createContext, useContext } from "react";
import { apiService, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await apiService.verifyToken();
    if (response.data) {
      setUser(response.data.user);
    } else {
      localStorage.removeItem("token");
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await apiService.register(username, email, password);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await apiService.getCurrentUser();
    if (response.data) {
      setUser(response.data);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };
}

export { AuthContext };
