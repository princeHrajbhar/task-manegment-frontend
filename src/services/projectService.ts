import api from '../lib/api'
import { Project, CreateProjectForm, AddMemberForm, UpdateMemberRoleForm, ApiResponse, PaginatedResponse } from '../types'

export const projectService = {
    // Get all projects
    getAll: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
        return api.get<any, ApiResponse<PaginatedResponse<Project>>>('/projects', { params })
    },

    // Get single project
    getById: async (projectId: string) => {
        return api.get<any, ApiResponse<Project>>(`/projects/${projectId}`)
    },

    // Create project
    create: async (data: CreateProjectForm) => {
        return api.post<any, ApiResponse<Project>>('/projects', data)
    },

    // Update project
    update: async (projectId: string, data: Partial<CreateProjectForm>) => {
        return api.patch<any, ApiResponse<Project>>(`/projects/${projectId}`, data)
    },

    // Delete project
    delete: async (projectId: string) => {
        return api.delete<any, ApiResponse>(`/projects/${projectId}`)
    },

    // Get project members
    getMembers: async (projectId: string) => {
        return api.get<any, ApiResponse<any[]>>(`/projects/${projectId}/members`)
    },

    // Add member
    addMember: async (projectId: string, data: AddMemberForm) => {
        return api.post<any, ApiResponse<Project>>(`/projects/${projectId}/members`, data)
    },

    // Update member role
    updateMemberRole: async (projectId: string, memberId: string, data: UpdateMemberRoleForm) => {
        return api.patch<any, ApiResponse<Project>>(`/projects/${projectId}/members/${memberId}/role`, data)
    },

    // Remove member
    removeMember: async (projectId: string, memberId: string) => {
        return api.delete<any, ApiResponse<Project>>(`/projects/${projectId}/members/${memberId}`)
    },
}
