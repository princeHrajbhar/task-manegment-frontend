import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { taskService } from '../services/taskService'
import { useAuthStore } from '../store/authStore'
import { Task, TaskStatus, User } from '../types'
import { ArrowLeft, Calendar, User as UserIcon, AlertCircle, Trash2, Edit } from 'lucide-react'
import { getStatusColor, getPriorityColor, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import EditTaskModal from '../components/EditTaskModal'

const TaskDetail = () => {
    const { taskId } = useParams<{ taskId: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [task, setTask] = useState<Task | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        if (taskId) {
            fetchTask()
        }
    }, [taskId])

    const fetchTask = async () => {
        try {
            const response = await taskService.getById(taskId!)
            setTask(response.data)
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch task')
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (!task) return

        setIsUpdatingStatus(true)
        try {
            await taskService.updateStatus(task._id, { status: newStatus })
            setTask({ ...task, status: newStatus })
            toast.success('Task status updated')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status')
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleDelete = async () => {
        if (!task || !confirm('Are you sure you want to delete this task?')) return

        try {
            await taskService.delete(task._id)
            toast.success('Task deleted successfully')
            navigate(`/projects/${typeof task.project === 'string' ? task.project : task.project._id}`)
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete task')
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    if (!task) {
        return <div className="text-center py-12">Task not found</div>
    }

    const assignedUser = typeof task.assignedTo === 'string' ? null : task.assignedTo
    const assignedByUser = typeof task.assignedBy === 'string' ? null : task.assignedBy
    const project = typeof task.project === 'string' ? null : task.project
    const canUpdateStatus = user && assignedUser && user._id === assignedUser._id
    const isAdmin = user?.role === 'ADMIN'

    return (
        <div className="space-y-6">
            <Link
                to={project ? `/projects/${project._id}` : '/tasks'}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {project ? 'Project' : 'Tasks'}
            </Link>

            <div className="card">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`badge ${getStatusColor(task.status)}`}>
                                {task.status}
                            </span>
                            <span className={`badge ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="btn btn-secondary flex items-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger flex items-center">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {task.description && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600">{task.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {task.dueDate && (
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Due Date</p>
                                <p className="text-gray-900">{formatDate(task.dueDate)}</p>
                            </div>
                        </div>
                    )}

                    {assignedUser && (
                        <div className="flex items-start">
                            <UserIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Assigned To</p>
                                <p className="text-gray-900">{assignedUser.username}</p>
                                <p className="text-sm text-gray-500">{assignedUser.email}</p>
                            </div>
                        </div>
                    )}

                    {assignedByUser && (
                        <div className="flex items-start">
                            <UserIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Assigned By</p>
                                <p className="text-gray-900">{assignedByUser.username}</p>
                            </div>
                        </div>
                    )}

                    {project && (
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Project</p>
                                <Link to={`/projects/${project._id}`} className="text-primary-600 hover:text-primary-700">
                                    {project.projectName}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {task.tags && task.tags.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag, index) => (
                                <span key={index} className="badge bg-blue-100 text-blue-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Attachments</h3>
                        <div className="space-y-2">
                            {task.attachments.map((url, index) => (
                                <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-primary-600 hover:text-primary-700 text-sm"
                                >
                                    {url}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {(canUpdateStatus || isAdmin) && (
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(TaskStatus).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={isUpdatingStatus || task.status === status}
                                    className={`btn ${task.status === status
                                        ? 'btn-primary'
                                        : 'btn-secondary'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showEditModal && task && (
                <EditTaskModal
                    task={task}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false)
                        fetchTask()
                    }}
                />
            )}
        </div>
    )
}

export default TaskDetail
