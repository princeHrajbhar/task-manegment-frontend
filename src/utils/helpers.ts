import { format, formatDistanceToNow } from 'date-fns'
import { TaskPriority, TaskStatus, ProjectStatus } from '../types'

export const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatRelativeTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.LOW:
            return 'bg-gray-100 text-gray-800'
        case TaskPriority.MEDIUM:
            return 'bg-blue-100 text-blue-800'
        case TaskPriority.HIGH:
            return 'bg-orange-100 text-orange-800'
        case TaskPriority.URGENT:
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TODO:
            return 'bg-gray-100 text-gray-800'
        case TaskStatus.IN_PROGRESS:
            return 'bg-blue-100 text-blue-800'
        case TaskStatus.COMPLETED:
            return 'bg-green-100 text-green-800'
        case TaskStatus.BLOCKED:
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const getProjectStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.ACTIVE:
            return 'bg-green-100 text-green-800'
        case ProjectStatus.IN_PROGRESS:
            return 'bg-blue-100 text-blue-800'
        case ProjectStatus.COMPLETED:
            return 'bg-purple-100 text-purple-800'
        case ProjectStatus.ARCHIVED:
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}
