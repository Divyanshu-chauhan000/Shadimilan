import { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, X, Eye, FileText, Clock, CheckCircle, XCircle, MapPin, GraduationCap, Briefcase } from 'lucide-react';

const ManageProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchProfiles();
    }, [filter]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const query = filter !== 'all' ? `?status=${filter}` : '';
            const res = await api.get(`/admin/profiles${query}`);
            setProfiles(res.data);
        } catch (error) {
            console.error('Failed to fetch profiles', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/profiles/${id}/status`, { status });
            fetchProfiles();
        } catch (error) {
            console.error('Failed to update profile status', error);
        }
    };

    const filterTabs = [
        { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
        { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
        { value: 'all', label: 'All', icon: FileText, color: 'text-admin-600 bg-admin-50 border-admin-200' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="page-header">Manage Profiles</h1>
                        <p className="text-sm text-admin-500">Review and approve matrimonial profiles</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filterTabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = filter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                                isActive
                                    ? `${tab.color} shadow-sm`
                                    : 'bg-white text-admin-500 border-admin-200 hover:bg-admin-50'
                            }`}
                        >
                            <Icon className="h-4 w-4 mr-1.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="loader-spinner" />
                </div>
            ) : profiles.length === 0 ? (
                <div className="admin-card text-center py-16">
                    <FileText className="h-10 w-10 text-admin-300 mx-auto mb-3" />
                    <p className="text-admin-500 font-medium">No profiles found for this filter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
                    {profiles.map(profile => (
                        <div key={profile._id} className="admin-card overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
                            {/* Header */}
                            <div className="flex items-start p-5 border-b border-admin-100">
                                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-admin-100 mr-4 flex-shrink-0">
                                    <img
                                        src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.user?.name}&size=120&background=6366f1&color=fff&bold=true`}
                                        alt={profile.user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{profile.user?.name}</h3>
                                    <p className="text-xs text-admin-500 truncate">{profile.user?.email}</p>
                                    <div className="mt-2">
                                        <span className={`badge border ${getStatusStyle(profile.status)}`}>
                                            {profile.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 bg-admin-50/50 space-y-2 text-sm">
                                <div className="flex items-center text-admin-600">
                                    <MapPin className="h-3.5 w-3.5 mr-2 text-admin-400 flex-shrink-0" />
                                    <span className="truncate">{profile.residence?.city}, {profile.residence?.state}</span>
                                </div>
                                <div className="flex items-center text-admin-600">
                                    <GraduationCap className="h-3.5 w-3.5 mr-2 text-admin-400 flex-shrink-0" />
                                    <span className="truncate">{profile.education}</span>
                                </div>
                                <div className="flex items-center text-admin-600">
                                    <Briefcase className="h-3.5 w-3.5 mr-2 text-admin-400 flex-shrink-0" />
                                    <span className="truncate">{profile.occupation}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex border-t border-admin-100">
                                {profile.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(profile._id, 'approved')}
                                            className="flex-1 py-3 text-emerald-600 hover:bg-emerald-50 font-semibold flex justify-center items-center text-sm border-r border-admin-100 transition-colors"
                                        >
                                            <Check className="w-4 h-4 mr-1.5" /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(profile._id, 'rejected')}
                                            className="flex-1 py-3 text-red-600 hover:bg-red-50 font-semibold flex justify-center items-center text-sm border-r border-admin-100 transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-1.5" /> Reject
                                        </button>
                                    </>
                                )}
                                <a
                                    href={`http://localhost:5173/profile/${profile._id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${profile.status === 'pending' ? 'flex-1' : 'w-full'} py-3 text-accent-600 hover:bg-accent-50 font-semibold flex justify-center items-center text-sm transition-colors`}
                                >
                                    <Eye className="w-4 h-4 mr-1.5" /> View
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProfiles;
