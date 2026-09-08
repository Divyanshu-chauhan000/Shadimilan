import { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Mail, LogOut, ChevronLeft, ChevronRight, Heart, Bell, Search, Menu } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Profiles', path: '/profiles', icon: FileText },
        { name: 'Enquiries', path: '/enquiries', icon: Mail },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getPageTitle = () => {
        const item = navItems.find(i => i.path === location.pathname);
        return item ? item.name : 'Dashboard';
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className={`h-16 flex items-center border-b border-admin-800/50 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
                <Heart className="h-7 w-7 text-accent-400 flex-shrink-0" fill="currentColor" />
                {!collapsed && (
                    <span className="ml-2.5 text-lg font-bold text-white tracking-wide">
                        Shadi<span className="text-accent-400">Milan</span>
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} ${collapsed ? '!mx-2 !px-0 justify-center' : ''}`}
                            title={collapsed ? item.name : undefined}
                        >
                            <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                            {!collapsed && item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className={`border-t border-admin-800/50 p-4 ${collapsed ? 'px-2' : ''}`}>
                {!collapsed && (
                    <div className="flex items-center mb-3 px-1">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{user?.name}</p>
                            <p className="text-admin-500 text-xs">Administrator</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`sidebar-link sidebar-link-inactive !text-admin-500 hover:!text-red-400 hover:!bg-red-500/10 ${collapsed ? '!mx-0 !px-0 justify-center' : ''}`}
                >
                    <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-admin-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={`${collapsed ? 'w-[68px]' : 'w-64'} bg-admin-900 text-white flex-col hidden md:flex transition-all duration-300 relative shadow-sidebar`}>
                <SidebarContent />
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-admin-900 border-2 border-admin-700 rounded-full flex items-center justify-center text-admin-400 hover:text-white hover:bg-accent-600 hover:border-accent-600 transition-all z-50"
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-admin-900 text-white flex flex-col animate-slide-in shadow-sidebar">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-admin-100 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-admin-50 text-admin-500"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
                            <p className="text-xs text-admin-400 hidden sm:block">{getGreeting()}, {user?.name?.split(' ')[0]}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="hidden lg:flex items-center bg-admin-50 rounded-lg px-3 py-2">
                            <Search className="h-4 w-4 text-admin-400 mr-2" />
                            <input type="text" placeholder="Search..." className="bg-transparent text-sm text-admin-600 placeholder:text-admin-400 outline-none w-40" />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-admin-50 text-admin-400 transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
                        </button>

                        {/* Avatar */}
                        <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-admin-100">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 lg:p-8">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
