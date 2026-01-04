import { create } from 'zustand';
import { Product } from '@/types/product';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
  selectedCategory: string;
  
  fetchProducts: (skip?: number, limit?: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  setSelectedCategory: (category: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
  selectedCategory: 'all',
  
  fetchProducts: async (skip = 0, limit = 10) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      set({
        products: data.products,
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
  
  searchProducts: async (query: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      
      const data = await response.json();
      
      set({
        products: data.products,
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
  
  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      
      set({
        currentProduct: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },
  
  fetchCategories: async () => {
    try {
      const response = await fetch(
        'https://dummyjson.com/products/categories'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      set({ categories: data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
  
  fetchProductsByCategory: async (category: string) => {
    set({ loading: true, error: null, selectedCategory: category });
    
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }
      
      const data = await response.json();
      
      set({
        products: data.products,
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
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));