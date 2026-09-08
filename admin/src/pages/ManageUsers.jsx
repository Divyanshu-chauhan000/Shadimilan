import { useState, useEffect } from 'react';
import api from '../services/api';
import { Ban, CheckCircle, Search, Users, Shield } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlockStatus = async (id, currentStatus, role) => {
        if (role === 'admin') return alert('Cannot block an admin');
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;

        try {
            await api.put(`/admin/users/${id}/block`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to toggle block status', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitialsColor = (name) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-emerald-500 to-emerald-600',
            'from-purple-500 to-violet-600',
            'from-amber-500 to-orange-500',
            'from-rose-500 to-pink-600',
            'from-cyan-500 to-teal-600',
        ];
        const idx = (name?.charCodeAt(0) || 0) % colors.length;
        return colors[idx];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="loader-spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="page-header">Manage Users</h1>
                        <p className="text-sm text-admin-500">{users.length} total users</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-9 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group">
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getInitialsColor(user.name)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-admin-500">{user.gender}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-sm text-gray-700">{user.email}</p>
                                        <p className="text-xs text-admin-500">{user.mobile}</p>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin'
                                            ? 'bg-accent-50 text-accent-700 border border-accent-200'
                                            : 'bg-admin-100 text-admin-600 border border-admin-200'
                                        }`}>
                                            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.isBlocked
                                            ? 'bg-danger-50 text-danger-600 border border-danger-100'
                                            : 'bg-success-50 text-success-600 border border-success-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isBlocked ? 'bg-danger-500' : 'bg-success-500'}`} />
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => toggleBlockStatus(user._id, user.isBlocked, user.role)}
                                                className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                                    user.isBlocked
                                                        ? 'text-success-600 hover:bg-success-50 border border-transparent hover:border-success-100'
                                                        : 'text-danger-600 hover:bg-danger-50 border border-transparent hover:border-danger-100'
                                                }`}
                                            >
                                                {user.isBlocked ? (
                                                    <><CheckCircle className="w-4 h-4 mr-1.5" /> Unblock</>
                                                ) : (
                                                    <><Ban className="w-4 h-4 mr-1.5" /> Block</>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="h-8 w-8 text-admin-300 mx-auto mb-3" />
                        <p className="text-admin-500 font-medium">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
