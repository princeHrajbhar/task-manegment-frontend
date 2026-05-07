import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { Project, ProjectStatus } from '../types'
import { Plus, Search } from 'lucide-react'
import { getProjectStatusColor, formatRelativeTime } from '../utils/helpers'
import toast from 'react-hot-toast'
import CreateProjectModal from '../components/CreateProjectModal'

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll()
            setProjects(response.data.projects || [])
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch projects')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredProjects = projects.filter((project) =>
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage your projects</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    New Project
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pl-10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="card hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900">{project.projectName}</h3>
                            <span className={`badge ${getProjectStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{project.members.length} members</span>
                            <span>{formatRelativeTime(project.updatedAt)}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">No projects found</p>
                </div>
            )}

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchProjects()
                    }}
                />
            )}
        </div>
    )
}

export default Projects
