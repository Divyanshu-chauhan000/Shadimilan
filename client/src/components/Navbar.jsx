import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, UserCircle, LogOut, Menu, X, ChevronDown, Search, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setDropdownOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `relative px-1 py-2 font-medium transition-all duration-300 ${
            isActive(path)
                ? 'text-maroon'
                : 'text-gray-600 hover:text-maroon'
        }`;

    return (
        <nav className="nav-glass sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-18">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group" onClick={() => setMobileOpen(false)}>
                        <div className="relative">
                            <Heart 
                                className="h-8 w-8 text-maroon animate-heartbeat" 
                                fill="currentColor" 
                            />
                            <div className="absolute inset-0 bg-maroon/20 rounded-full blur-md animate-pulse-slow" />
                        </div>
                        <span className="text-2xl font-display font-bold tracking-tight">
                            <span className="text-maroon">Shadi</span>
                            <span className="gradient-text-gold">Milan</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link to="/browse" className={navLinkClass('/browse')}>
                                    Browse
                                    {isActive('/browse') && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-maroon to-gold rounded-full" />
                                    )}
                                </Link>
                                <Link to="/enquiries" className={navLinkClass('/enquiries')}>
                                    Enquiries
                                    {isActive('/enquiries') && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-maroon to-gold rounded-full" />
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-maroon/5 transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon to-primary-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-700 text-sm">{user.name?.split(' ')[0]}</span>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {dropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 z-50 animate-scale-in origin-top-right">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/my-profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-100 hover:text-maroon transition-colors"
                                                >
                                                    <UserCircle className="h-4 w-4 mr-3 text-gray-400" />
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-maroon font-medium transition-colors duration-300">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-gold shadow-gold text-sm px-5 py-2">
                                    Register Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-6 pt-2 border-t border-gray-100 animate-fade-in">
                        <div className="space-y-1">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-3 px-3 py-4 mb-2 bg-cream-100 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-primary-500 flex items-center justify-center text-white font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/browse" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-xl text-gray-700 hover:bg-cream-100 hover:text-maroon font-medium transition-colors">
                                        Browse Profiles
                                    </Link>
                                    <Link to="/enquiries" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-xl text-gray-700 hover:bg-cream-100 hover:text-maroon font-medium transition-colors">
                                        My Enquiries
                                    </Link>
                                    <Link to="/my-profile" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-xl text-gray-700 hover:bg-cream-100 hover:text-maroon font-medium transition-colors">
                                        My Profile
                                    </Link>
                                    <hr className="my-2 border-gray-100" />
                                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium flex items-center transition-colors">
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-xl text-gray-700 hover:bg-cream-100 hover:text-maroon font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-3 mt-2 btn-gold text-center">
                                        Register Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
