// User Types
export enum UserRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

export interface User {
    _id: string
    username: string
    email: string
    role: UserRole
    createdAt: string
    updatedAt: string
}

// Project Types
export enum ProjectRole {
    PROJECT_ADMIN = 'PROJECT_ADMIN',
    PROJECT_MEMBER = 'PROJECT_MEMBER',
}

export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED',
}

export interface ProjectMember {
    user: User | string
    role: ProjectRole
    joinedAt: string
}

export interface Project {
    _id: string
    projectName: string
    slug: string
    description?: string
    projectImage?: string
    owner: User | string
    members: ProjectMember[]
    techStack: string[]
    githubUrl?: string
    liveUrl?: string
    status: ProjectStatus
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

// Task Types
export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    BLOCKED = 'BLOCKED',
}

export interface Task {
    _id: string
    title: string
    description?: string
    dueDate?: string
    priority: TaskPriority
    status: TaskStatus
    project: Project | string
    assignedTo: User | string
    assignedBy: User | string
    tags: string[]
    attachments: string[]
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

// API Response Types
export interface ApiResponse<T = any> {
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    projects?: T[]
    tasks?: T[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

// Form Types
export interface LoginForm {
    email: string
    password: string
}

export interface RegisterForm {
    username: string
    email: string
    password: string
    role?: UserRole
}

export interface CreateProjectForm {
    projectName: string
    slug: string
    description?: string
    projectImage?: string
    techStack: string[]
    githubUrl?: string
    liveUrl?: string
    status?: ProjectStatus
}

export interface CreateTaskForm {
    title: string
    description?: string
    dueDate?: string
    priority: TaskPriority
    projectId: string
    assignedTo: string
    tags?: string[]
    attachments?: string[]
}

export interface UpdateTaskStatusForm {
    status: TaskStatus
}

export interface AddMemberForm {
    userId: string
    role?: ProjectRole
}

export interface UpdateMemberRoleForm {
    role: ProjectRole
}
