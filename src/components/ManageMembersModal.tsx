import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Shield } from 'lucide-react'
import { projectService } from '../services/projectService'
import { userService } from '../services/userService'
import { ProjectRole, User } from '../types'
import toast from 'react-hot-toast'

interface ManageMembersModalProps {
    projectId: string
    members: any[]
    isAdmin: boolean
    onClose: () => void
    onUpdate: () => void
}

const ManageMembersModal = ({ projectId, members, isAdmin, onClose, onUpdate }: ManageMembersModalProps) => {
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [showAddMember, setShowAddMember] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState('')
    const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.PROJECT_MEMBER)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isAdmin) {
            fetchAllUsers()
        }
    }, [isAdmin])

    const fetchAllUsers = async () => {
        try {
            const response = await userService.getAll()
            setAllUsers(response.data)
        } catch (error: any) {
            toast.error('Failed to fetch users')
        }
    }

    const availableUsers = allUsers.filter(
        (user) => !members.some((member) => {
            const memberUser = member.user as User
            return memberUser._id === user._id
        })
    )

    const handleAddMember = async () => {
        if (!selectedUserId) {
            toast.error('Please select a user')
            return
        }

        setIsLoading(true)
        try {
            await projectService.addMember(projectId, {
                userId: selectedUserId,
                role: selectedRole,
            })
            toast.success('Member added successfully')
            setShowAddMember(false)
            setSelectedUserId('')
            setSelectedRole(ProjectRole.PROJECT_MEMBER)
            onUpdate()
        } catch (error: any) {
            toast.error(error.message || 'Failed to add member')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return

        try {
            await projectService.removeMember(projectId, memberId)
            toast.success('Member removed successfully')
            onUpdate()
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove member')
        }
    }

    const handleChangeRole = async (memberId: string, currentRole: ProjectRole) => {
        const newRole = currentRole === ProjectRole.PROJECT_ADMIN
            ? ProjectRole.PROJECT_MEMBER
            : ProjectRole.PROJECT_ADMIN

        if (!confirm(`Change role to ${newRole}?`)) return

        try {
            await projectService.updateMemberRole(projectId, memberId, { role: newRole })
            toast.success('Member role updated successfully')
            onUpdate()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update member role')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Manage Project Members</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {isAdmin && (
                        <div className="mb-6">
                            {!showAddMember ? (
                                <button
                                    onClick={() => setShowAddMember(true)}
                                    className="btn btn-primary flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Member
                                </button>
                            ) : (
                                <div className="card bg-gray-50">
                                    <h3 className="font-semibold text-gray-900 mb-4">Add New Member</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select User
                                            </label>
                                            <select
                                                value={selectedUserId}
                                                onChange={(e) => setSelectedUserId(e.target.value)}
                                                className="input"
                                            >
                                                <option value="">Choose a user...</option>
                                                {availableUsers.map((user) => (
                                                    <option key={user._id} value={user._id}>
                                                        {user.username} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
                                                className="input"
                                            >
                                                <option value={ProjectRole.PROJECT_MEMBER}>Member</option>
                                                <option value={ProjectRole.PROJECT_ADMIN}>Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={handleAddMember}
                                            disabled={isLoading || !selectedUserId}
                                            className="btn btn-primary"
                                        >
                                            {isLoading ? 'Adding...' : 'Add Member'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddMember(false)
                                                setSelectedUserId('')
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Current Members ({members.length})
                        </h3>
                        <div className="space-y-3">
                            {members.map((member) => {
                                const memberUser = member.user as User
                                const isOwner = member.role === ProjectRole.PROJECT_ADMIN

                                return (
                                    <div
                                        key={memberUser._id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <span className="text-primary-600 font-semibold">
                                                        {memberUser.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{memberUser.username}</p>
                                                    <p className="text-sm text-gray-600">{memberUser.email}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className={`badge ${member.role === ProjectRole.PROJECT_ADMIN
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {member.role === ProjectRole.PROJECT_ADMIN ? 'Admin' : 'Member'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleChangeRole(memberUser._id, member.role)}
                                                    className="btn btn-secondary flex items-center"
                                                    title="Change role"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                {!isOwner && (
                                                    <button
                                                        onClick={() => handleRemoveMember(memberUser._id)}
                                                        className="btn btn-danger flex items-center"
                                                        title="Remove member"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {members.length === 0 && (
                        <div className="text-center py-12 text-gray-600">
                            No members yet. Add some members to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageMembersModal
