import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { Project, Task } from '../types'
import { FolderKanban, CheckSquare, Users, TrendingUp } from 'lucide-react'
import { getProjectStatusColor, formatRelativeTime } from '../utils/helpers'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll({ limit: 5 })
            setProjects(response.data.projects || [])
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch projects')
        } finally {
            setIsLoading(false)
        }
    }

    const stats = [
        {
            name: 'Total Projects',
            value: projects.length,
            icon: FolderKanban,
            color: 'bg-blue-500',
        },
        {
            name: 'Active Tasks',
            value: '0',
            icon: CheckSquare,
            color: 'bg-green-500',
        },
        {
            name: 'Team Members',
            value: projects.reduce((acc, p) => acc + p.members.length, 0),
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            name: 'Completion Rate',
            value: '0%',
            icon: TrendingUp,
            color: 'bg-orange-500',
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.name} className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Projects */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                    <Link to="/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View All
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No projects yet</p>
                        <Link to="/projects" className="btn btn-primary mt-4 inline-block">
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <Link
                                key={project._id}
                                to={`/projects/${project._id}`}
                                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className={`badge ${getProjectStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {project.members.length} members
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Updated {formatRelativeTime(project.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
