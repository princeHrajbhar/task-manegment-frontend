import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { taskService } from '../services/taskService'
import { projectService } from '../services/projectService'
import { TaskPriority, Task, User } from '../types'
import toast from 'react-hot-toast'

interface EditTaskModalProps {
    task: Task
    onClose: () => void
    onSuccess: () => void
}

const EditTaskModal = ({ task, onClose, onSuccess }: EditTaskModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [members, setMembers] = useState<User[]>([])
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority,
        assignedTo: typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo._id,
        tags: task.tags.join(', '),
    })

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const projectId = typeof task.project === 'string' ? task.project : task.project._id
            const response = await projectService.getMembers(projectId)
            const memberUsers = response.data.map((m: any) => m.user)
            setMembers(memberUsers)
        } catch (error: any) {
            toast.error('Failed to fetch project members')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const tags = formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)

            await taskService.update(task._id, {
                title: formData.title,
                description: formData.description || undefined,
                dueDate: formData.dueDate || undefined,
                priority: formData.priority,
                assignedTo: formData.assignedTo,
                tags: tags.length > 0 ? tags : undefined,
            })

            toast.success('Task updated successfully')
            onSuccess()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update task')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            minLength={3}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Task title"
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
                            rows={4}
                            placeholder="Task description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign To *
                            </label>
                            <select
                                required
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                className="input"
                            >
                                <option value="">Select member</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <select
                                required
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                                className="input"
                            >
                                {Object.values(TaskPriority).map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="input"
                            placeholder="bug, feature, urgent"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary">
                            {isLoading ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditTaskModal
