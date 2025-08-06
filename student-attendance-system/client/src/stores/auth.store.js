import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
          
          return { success: true, user };
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
          };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      getProfile: async () => {
        try {
          const response = await api.get('/auth/me');
          const { user } = response.data;
          
          set({
            user,
            isAuthenticated: true,
          });
          
          return { success: true, user };
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return { 
            success: false, 
            message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์' 
          };
        }
      },

      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;