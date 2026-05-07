import api from '../lib/api'
import { User, UserRole, ApiResponse } from '../types'

export const userService = {
    // Get all users
    getAll: async () => {
        return api.get<any, ApiResponse<User[]>>('/users')
    },

    // Get current user
    getCurrentUser: async () => {
        return api.get<any, ApiResponse<User>>('/users/me')
    },

    // Delete user
    delete: async (userId: string) => {
        return api.delete<any, ApiResponse>(`/users/${userId}`)
    },

    // Change user role
    changeRole: async (userId: string, role: UserRole) => {
        return api.patch<any, ApiResponse<User>>(`/users/${userId}/role`, { role })
    },
}
