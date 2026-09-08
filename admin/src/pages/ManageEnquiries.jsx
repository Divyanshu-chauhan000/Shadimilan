import { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, ArrowRight, Clock, Eye, CheckCircle, XCircle, Search } from 'lucide-react';

const ManageEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await api.get('/admin/enquiries');
            setEnquiries(res.data);
        } catch (error) {
            console.error('Failed to fetch enquiries', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' };
            case 'seen': return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Eye, label: 'Seen' };
            case 'accepted': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Accepted' };
            case 'rejected': return { bg: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' };
            default: return { bg: 'bg-admin-100 text-admin-600 border-admin-200', icon: Clock, label: status };
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        e.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.receiver?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="page-header">Manage Enquiries</h1>
                        <p className="text-sm text-admin-500">{enquiries.length} total enquiries</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-400" />
                    <input
                        type="text"
                        placeholder="Search by name..."
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
                                <th>Date</th>
                                <th>Sender</th>
                                <th className="text-center">
                                    <span className="sr-only">Direction</span>
                                </th>
                                <th>Receiver</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-100">
                            {filteredEnquiries.map((enq) => {
                                const statusConfig = getStatusConfig(enq.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <tr key={enq._id} className="group">
                                        <td>
                                            <p className="text-sm text-admin-600">
                                                {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {enq.sender?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{enq.sender?.name}</p>
                                                    <p className="text-xs text-admin-500">{enq.sender?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="w-8 h-px bg-admin-200" />
                                                <ArrowRight className="h-4 w-4 text-accent-400 mx-1" />
                                                <div className="w-8 h-px bg-admin-200" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {enq.receiver?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{enq.receiver?.name}</p>
                                                    <p className="text-xs text-admin-500">{enq.receiver?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge border ${statusConfig.bg}`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredEnquiries.length === 0 && (
                    <div className="text-center py-12">
                        <Mail className="h-8 w-8 text-admin-300 mx-auto mb-3" />
                        <p className="text-admin-500 font-medium">No enquiries found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageEnquiries;
