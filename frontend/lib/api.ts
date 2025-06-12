const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  score: number;
  champ: string;
  createdAt: string;
}

interface Champion {
  name: string;
  role: string;
  position: string;
  image: string;
  mana: string;
  region: string;
  date: string;
}

class ApiService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
          ...options.headers,
        },
        credentials: "include",
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Une erreur est survenue" };
      }

      return { data };
    } catch (error) {
      console.error("API Request failed:", error);
      return { error: "Erreur de connexion au serveur" };
    }
  }

  // Auth endpoints
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    return this.request("/auth/verify");
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request("/users/me");
  }

  async checkChampionAnswer(
    champ: Champion,
    points: number
  ): Promise<
    ApiResponse<{ correct: boolean; score: number; message: string }>
  > {
    return this.request("/users/check", {
      method: "POST",
      body: JSON.stringify({ champ, points }),
    });
  }

  async getNewChampion(): Promise<
    ApiResponse<{ champ: string; message: string }>
  > {
    return this.request("/users/new-champion", {
      method: "POST",
    });
  }

  async getLeaderboard(): Promise<ApiResponse<User[]>> {
    return this.request("/users");
  }
}

export const apiService = new ApiService();
export type { User, Champion, ApiResponse };
