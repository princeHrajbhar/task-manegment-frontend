import { useEffect, useState } from 'react'
import { userService } from '../services/userService'
import { User, UserRole } from '../types'
import { Shield, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const Users = () => {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll()
            setUsers(response.data)
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch users')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-1">Manage system users</p>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`badge ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role === UserRole.ADMIN ? (
                                                <><Shield className="w-3 h-3 inline mr-1" />Admin</>
                                            ) : (
                                                <><UserIcon className="w-3 h-3 inline mr-1" />Member</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Users
