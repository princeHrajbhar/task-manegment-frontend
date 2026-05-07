import { useAuthStore } from '../store/authStore'
import { User, Mail, Shield } from 'lucide-react'

const Profile = () => {
    const { user } = useAuthStore()

    if (!user) return null

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

            <div className="card max-w-2xl">
                <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                        <User className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Username:</span>
                        <span>{user.username}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Email:</span>
                        <span>{user.email}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <Shield className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Role:</span>
                        <span className={`badge ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                        <span className="font-medium mr-2">Member since:</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
