import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
              expiresInMins: 30,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          
          set({
            token: data.accessToken,
            user: data,
            isAuthenticated: true,
          });
          
          // Store token in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.accessToken);
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },
      
      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },
      
      setUser: (user: any) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);