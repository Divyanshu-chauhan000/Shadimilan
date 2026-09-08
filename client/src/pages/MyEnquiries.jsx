import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Mail, ArrowRight, CheckCircle, XCircle, Heart, Clock, Eye, Inbox, Send } from 'lucide-react';

const MyEnquiries = () => {
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('received');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await api.get('/enquiry/me');
            setSent(res.data.sent);
            setReceived(res.data.received);
        } catch (error) {
            console.error('Failed to fetch enquiries', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/enquiry/${id}/status`, { status });
            fetchEnquiries();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="loader-spinner" />
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
            seen: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Eye, label: 'Seen' },
            accepted: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Accepted' },
            rejected: { bg: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, label: 'Declined' },
        };
        const s = styles[status] || styles.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.bg}`}>
                <Icon className="h-3 w-3 mr-1" /> {s.label}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto page-enter">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center">
                    <Heart className="h-8 w-8 mr-3 text-maroon" fill="currentColor" />
                    My <span className="gradient-text ml-2">Enquiries</span>
                </h1>
                <p className="text-gray-500 mt-1 ml-11">Manage your sent and received interests</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-cream-100 rounded-xl p-1 mb-8 max-w-md">
                <button
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeTab === 'received'
                            ? 'bg-white text-maroon shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('received')}
                >
                    <Inbox className="h-4 w-4 mr-2" />
                    Received
                    {received.length > 0 && (
                        <span className={`ml-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            activeTab === 'received' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            {received.length}
                        </span>
                    )}
                </button>
                <button
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeTab === 'sent'
                            ? 'bg-white text-maroon shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('sent')}
                >
                    <Send className="h-4 w-4 mr-2" />
                    Sent
                    {sent.length > 0 && (
                        <span className={`ml-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            activeTab === 'sent' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            {sent.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4" key={activeTab}>
                {activeTab === 'received' ? (
                    received.length === 0 ? (
                        <div className="premium-card text-center py-16">
                            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-display font-bold text-gray-500 mb-2">No interests received yet</h3>
                            <p className="text-gray-400 text-sm">When someone shows interest, it will appear here</p>
                        </div>
                    ) : (
                        received.map(enq => (
                            <div key={enq._id} className="premium-card p-5 md:p-6 animate-fade-in hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-maroon to-primary-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {enq.sender?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-display font-bold text-lg text-gray-900">{enq.sender?.name}</span>
                                                {getStatusBadge(enq.status)}
                                            </div>
                                            <p className="text-gray-500 text-sm">{enq.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">Received on {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 md:flex-shrink-0 ml-16 md:ml-0">
                                        {(enq.status === 'pending' || enq.status === 'seen') && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(enq._id, 'accepted')}
                                                    className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1.5" /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(enq._id, 'rejected')}
                                                    className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4 mr-1.5" /> Decline
                                                </button>
                                            </>
                                        )}
                                        {enq.status === 'accepted' && (
                                            <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-200 text-sm">
                                                <Mail className="h-4 w-4 inline mr-1.5" />
                                                {enq.sender?.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    sent.length === 0 ? (
                        <div className="premium-card text-center py-16">
                            <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-display font-bold text-gray-500 mb-2">No interests sent yet</h3>
                            <p className="text-gray-400 text-sm mb-4">Browse profiles and send your first interest</p>
                            <Link to="/browse" className="btn-primary text-sm">Browse Profiles</Link>
                        </div>
                    ) : (
                        sent.map(enq => (
                            <div key={enq._id} className="premium-card p-5 md:p-6 animate-fade-in hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {enq.receiver?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1 text-sm text-gray-500">
                                                Sent to
                                                <Link to={`/profile/${enq.receiver?._id}`} className="font-display font-bold text-lg text-maroon hover:text-maroon-dark transition-colors flex items-center ml-1">
                                                    {enq.receiver?.name}
                                                    <ArrowRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </div>
                                            <p className="text-gray-500 text-sm italic">"{enq.message}"</p>
                                            <p className="text-xs text-gray-400 mt-1">Sent on {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="ml-16 md:ml-0">
                                        {getStatusBadge(enq.status)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default MyEnquiries;
