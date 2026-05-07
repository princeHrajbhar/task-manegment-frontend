import api from '../lib/api'
import { Task, CreateTaskForm, UpdateTaskStatusForm, ApiResponse } from '../types'

export const taskService = {
    // Get tasks by project
    getByProject: async (projectId: string) => {
        return api.get<any, ApiResponse<Task[]>>(`/tasks/project/${projectId}`)
    },

    // Get single task
    getById: async (taskId: string) => {
        return api.get<any, ApiResponse<Task>>(`/tasks/${taskId}`)
    },

    // Create task
    create: async (data: CreateTaskForm) => {
        return api.post<any, ApiResponse<Task>>('/tasks', data)
    },

    // Update task
    update: async (taskId: string, data: Partial<CreateTaskForm>) => {
        return api.patch<any, ApiResponse<Task>>(`/tasks/${taskId}`, data)
    },

    // Delete task
    delete: async (taskId: string) => {
        return api.delete<any, ApiResponse>(`/tasks/${taskId}`)
    },

    // Update task status
    updateStatus: async (taskId: string, data: UpdateTaskStatusForm) => {
        return api.patch<any, ApiResponse<Task>>(`/tasks/${taskId}/status`, data)
    },
}
