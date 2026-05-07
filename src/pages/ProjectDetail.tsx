import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { useAuthStore } from '../store/authStore'
import { Project, Task, ProjectRole, User } from '../types'
import { ArrowLeft, Users, CheckSquare, Plus, Edit, Trash2, Settings, X } from 'lucide-react'
import { getProjectStatusColor, getStatusColor, getPriorityColor, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import CreateTaskModal from '../components/CreateTaskModal'
import EditProjectModal from '../components/EditProjectModal'
import ManageMembersModal from '../components/ManageMembersModal'

const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [project, setProject] = useState<Project | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [members, setMembers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
    const [showEditProjectModal, setShowEditProjectModal] = useState(false)
    const [showMembersModal, setShowMembersModal] = useState(false)

    useEffect(() => {
        if (projectId) {
            fetchProject()
            fetchTasks()
            fetchMembers()
        }
    }, [projectId])

    const fetchProject = async () => {
        try {
            const response = await projectService.getById(projectId!)
            setProject(response.data)
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch project')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await taskService.getByProject(projectId!)
            setTasks(response.data)
        } catch (error: any) {
            console.error('Failed to fetch tasks:', error)
        }
    }

    const fetchMembers = async () => {
        try {
            const response = await projectService.getMembers(projectId!)
            setMembers(response.data)
        } catch (error: any) {
            console.error('Failed to fetch members:', error)
        }
    }

    const handleDeleteProject = async () => {
        if (!project || !confirm('Are you sure you want to delete this project?')) return

        try {
            await projectService.delete(project._id)
            toast.success('Project deleted successfully')
            navigate('/projects')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete project')
        }
    }

    const isProjectAdmin = () => {
        if (!user || !project) return false
        if (user.role === 'ADMIN') return true

        const member = project.members.find((m) => {
            const userId = typeof m.user === 'string' ? m.user : m.user._id
            return userId === user._id
        })
        return member?.role === ProjectRole.PROJECT_ADMIN
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    if (!project) {
        return <div className="text-center py-12">Project not found</div>
    }

    return (
        <div className="space-y-6">
            <Link to="/projects" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
            </Link>

            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`badge ${getProjectStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                        {isProjectAdmin() && (
                            <>
                                <button
                                    onClick={() => setShowEditProjectModal(true)}
                                    className="btn btn-secondary flex items-center"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button onClick={handleDeleteProject} className="btn btn-danger flex items-center">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack.map((tech) => (
                            <span key={tech} className="badge bg-gray-100 text-gray-800">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <button
                        onClick={() => setShowMembersModal(true)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <Users className="w-5 h-5 mr-2" />
                        {members.length} Members
                    </button>
                    <div className="flex items-center text-gray-600">
                        <CheckSquare className="w-5 h-5 mr-2" />
                        {tasks.length} Tasks
                    </div>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                            GitHub →
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                            Live Demo →
                        </a>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Tasks</h2>
                    {isProjectAdmin() && (
                        <button
                            onClick={() => setShowCreateTaskModal(true)}
                            className="btn btn-primary flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Task
                        </button>
                    )}
                </div>

                {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">No tasks yet</div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <Link
                                key={task._id}
                                to={`/tasks/${task._id}`}
                                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`badge ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            <span className={`badge ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {task.dueDate && (
                                                <span className="text-xs text-gray-500">
                                                    Due: {formatDate(task.dueDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {showCreateTaskModal && (
                <CreateTaskModal
                    projectId={projectId}
                    onClose={() => setShowCreateTaskModal(false)}
                    onSuccess={() => {
                        setShowCreateTaskModal(false)
                        fetchTasks()
                    }}
                />
            )}

            {showEditProjectModal && project && (
                <EditProjectModal
                    project={project}
                    onClose={() => setShowEditProjectModal(false)}
                    onSuccess={() => {
                        setShowEditProjectModal(false)
                        fetchProject()
                    }}
                />
            )}

            {showMembersModal && (
                <ManageMembersModal
                    projectId={projectId!}
                    members={members}
                    isAdmin={isProjectAdmin()}
                    onClose={() => setShowMembersModal(false)}
                    onUpdate={() => {
                        fetchMembers()
                        fetchProject()
                    }}
                />
            )}
        </div>
    )
}

export default ProjectDetail
