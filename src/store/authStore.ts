import { create } from 'zustand'
import { User } from '../types'
import api from '../lib/api'

interface AuthState {
    user: User | null
    isLoading: boolean
    setUser: (user: User | null) => void
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,

    setUser: (user) => set({ user, isLoading: false }),

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        set({ user: response.data, isLoading: false })
    },

    register: async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password })
        set({ user: response.data, isLoading: false })
    },

    logout: async () => {
        await api.post('/auth/logout')
        set({ user: null })
    },

    fetchCurrentUser: async () => {
        try {
            const response = await api.get('/users/me')
            set({ user: response.data, isLoading: false })
        } catch (error) {
            set({ user: null, isLoading: false })
        }
    },
}))
