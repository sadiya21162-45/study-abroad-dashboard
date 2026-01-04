import { create } from 'zustand';
import {user} from '@/types/user';
interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
  
  fetchUsers: (skip?: number, limit?: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
  
  fetchUsers: async (skip = 0, limit = 10) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      set({
        users: data.users,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },
  
  searchUsers: async (query: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      
      set({
        users: data.users,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },
  
  fetchUserById: async (id: number) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/users/${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const data = await response.json();
      
      set({
        currentUser: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },
  
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));