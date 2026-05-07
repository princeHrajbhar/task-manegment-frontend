import { useState } from 'react'
import { X } from 'lucide-react'
import { projectService } from '../services/projectService'
import { ProjectStatus } from '../types'
import { generateSlug } from '../utils/helpers'
import toast from 'react-hot-toast'

interface Props {
    onClose: () => void
    onSuccess: () => void
}

const CreateProjectModal = ({ onClose, onSuccess }: Props) => {
    const [formData, setFormData] = useState({
        projectName: '',
        slug: '',
        description: '',
        techStack: '',
        status: ProjectStatus.ACTIVE,
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await projectService.create({
                ...formData,
                techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
            })
            toast.success('Project created successfully')
            onSuccess()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create project')
        } finally {
            setIsLoading(false)
        }
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            projectName: name,
            slug: generateSlug(name),
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Create New Project</h2>
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
                            value={formData.projectName}
                            onChange={(e) => handleNameChange(e.target.value)}
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
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="input"
                            placeholder="my-awesome-project"
                        />
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
                            placeholder="Project description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tech Stack (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            className="input"
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
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
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProjectModal
