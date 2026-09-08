import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Users, FileText, Clock, Mail, TrendingUp, ArrowUpRight, Heart, Activity, Shield } from 'lucide-react';

/* Animated counter */
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started || !value) return;
        let start;
        const duration = 1200;
        const animate = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setDisplay(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [started, value]);

    return <span ref={ref}>{display.toLocaleString()}</span>;
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProfiles: 0,
        pendingProfiles: 0,
        totalEnquiries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="loader-spinner" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            change: '+12%',
        },
        {
            title: 'Total Profiles',
            value: stats.totalProfiles,
            icon: FileText,
            gradient: 'from-emerald-500 to-emerald-600',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            change: '+8%',
        },
        {
            title: 'Pending Approval',
            value: stats.pendingProfiles,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-500',
            bgLight: 'bg-amber-50',
            textColor: 'text-amber-600',
            change: 'Action needed',
        },
        {
            title: 'Total Enquiries',
            value: stats.totalEnquiries,
            icon: Mail,
            gradient: 'from-purple-500 to-violet-600',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600',
            change: '+24%',
        },
    ];

    const quickActions = [
        { title: 'Approve Profiles', desc: 'Review and approve pending matrimonial profiles', icon: Shield, link: '/profiles', color: 'text-emerald-600 bg-emerald-50' },
        { title: 'Manage Users', desc: 'View, block, or unblock registered users', icon: Users, link: '/users', color: 'text-blue-600 bg-blue-50' },
        { title: 'View Enquiries', desc: 'Monitor all interest requests between users', icon: Heart, link: '/enquiries', color: 'text-rose-600 bg-rose-50' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Welcome Banner */}
            <div className="admin-card p-6 mb-8 bg-gradient-to-r from-accent-600 to-accent-500 border-none text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">Welcome to ShadiMilan Admin</h2>
                    <p className="text-white/70 text-sm">Manage your matrimonial platform with ease. Here's what's happening today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-children">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="admin-card p-5 group hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <span className={`text-xs font-semibold ${stat.textColor} ${stat.bgLight} px-2 py-1 rounded-full flex items-center`}>
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-admin-500 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">
                                <AnimatedNumber value={stat.value} />
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-accent-500" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <a key={action.title} href={action.link} className="admin-card p-5 group hover:-translate-y-0.5 transition-all duration-300 block">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-admin-300 group-hover:text-accent-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                                <p className="text-sm text-admin-500">{action.desc}</p>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* System Status */}
            <div className="admin-card p-5">
                <h3 className="text-sm font-bold text-admin-500 uppercase tracking-wider mb-4">System Status</h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm text-admin-600">Server Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm text-admin-600">Database Connected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm text-admin-600">All Services Running</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
