import { useState } from 'react'
import { X } from 'lucide-react'
import { projectService } from '../services/projectService'
import { Project, ProjectStatus } from '../types'
import toast from 'react-hot-toast'

interface EditProjectModalProps {
    project: Project
    onClose: () => void
    onSuccess: () => void
}

const EditProjectModal = ({ project, onClose, onSuccess }: EditProjectModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        projectName: project.projectName,
        slug: project.slug,
        description: project.description || '',
        projectImage: project.projectImage || '',
        techStack: project.techStack.join(', '),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        status: project.status,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const techStack = formData.techStack
                .split(',')
                .map((tech) => tech.trim())
                .filter((tech) => tech.length > 0)

            await projectService.update(project._id, {
                projectName: formData.projectName,
                slug: formData.slug,
                description: formData.description || undefined,
                projectImage: formData.projectImage || undefined,
                techStack,
                githubUrl: formData.githubUrl || undefined,
                liveUrl: formData.liveUrl || undefined,
                status: formData.status,
            })

            toast.success('Project updated successfully')
            onSuccess()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update project')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            required
                            minLength={3}
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            className="input"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            required
                            minLength={3}
                            pattern="[a-z0-9-]+"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                            className="input"
                            placeholder="my-awesome-project"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows={3}
                            placeholder="Project description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.projectImage}
                            onChange={(e) => setFormData({ ...formData, projectImage: e.target.value })}
                            className="input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tech Stack * (comma separated)
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            className="input"
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="input"
                                placeholder="https://github.com/user/repo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Live URL
                            </label>
                            <input
                                type="url"
                                value={formData.liveUrl}
                                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                className="input"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                        </label>
                        <select
                            required
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                            className="input"
                        >
                            {Object.values(ProjectStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary">
                            {isLoading ? 'Updating...' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProjectModal
