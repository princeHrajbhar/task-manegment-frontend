import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { Task, TaskStatus, TaskPriority, Project } from '../types'
import { Search, Filter } from 'lucide-react'
import { getStatusColor, getPriorityColor, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const Tasks = () => {
    const { user } = useAuthStore()
    const [tasks, setTasks] = useState<Task[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch all projects first
            const projectsResponse = await projectService.getAll()
            const projectsList = projectsResponse.data.projects || []
            setProjects(projectsList)

            // Fetch tasks for all projects
            const allTasks: Task[] = []
            for (const project of projectsList) {
                try {
                    const tasksResponse = await taskService.getByProject(project._id)
                    allTasks.push(...tasksResponse.data)
                } catch (error) {
                    console.error(`Failed to fetch tasks for project ${project._id}`)
                }
            }
            setTasks(allTasks)
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch tasks')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    const myTasks = filteredTasks.filter((task) => {
        const assignedUser = typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo._id
        return assignedUser === user?._id
    })

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
                <p className="text-gray-600 mt-1">View and manage all your tasks</p>
            </div>

            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'ALL')}
                            className="input"
                        >
                            <option value="ALL">All Status</option>
                            {Object.values(TaskStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
                            className="input"
                        >
                            <option value="ALL">All Priority</option>
                            {Object.values(TaskPriority).map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">My Tasks ({myTasks.length})</h2>
                    {myTasks.length === 0 ? (
                        <p className="text-gray-600 text-sm">No tasks assigned to you</p>
                    ) : (
                        <div className="space-y-2">
                            {myTasks.map((task) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">All Tasks ({filteredTasks.length})</h2>
                    {filteredTasks.length === 0 ? (
                        <p className="text-gray-600 text-sm">No tasks found</p>
                    ) : (
                        <div className="space-y-2">
                            {filteredTasks.map((task) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const TaskCard = ({ task }: { task: Task }) => {
    const project = typeof task.project === 'string' ? null : task.project
    const assignedUser = typeof task.assignedTo === 'string' ? null : task.assignedTo

    return (
        <Link
            to={`/tasks/${task._id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`badge ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                        {project && (
                            <span className="badge bg-gray-100 text-gray-800">
                                {project.projectName}
                            </span>
                        )}
                        {assignedUser && (
                            <span className="text-xs text-gray-500">
                                @{assignedUser.username}
                            </span>
                        )}
                        {task.dueDate && (
                            <span className="text-xs text-gray-500">
                                Due: {formatDate(task.dueDate)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Tasks
