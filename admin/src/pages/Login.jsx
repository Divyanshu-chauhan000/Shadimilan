import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Shield, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            await login({ email, password });
            navigate('/');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-admin-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" />
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/25">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
                    <p className="text-admin-400 text-sm">ShadiMilan Control Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl animate-fade-in-up">
                    {errorMsg && (
                        <div className="bg-danger-500/10 border border-danger-500/20 text-danger-500 px-4 py-3 rounded-lg mb-6 text-sm text-center animate-fade-in">
                            {errorMsg}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-admin-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@shadimilan.com"
                                    className="w-full px-4 pl-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-admin-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-admin-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-admin-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-admin-500 hover:text-admin-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-xl font-semibold shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:from-accent-700 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Authenticating...</>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-admin-600 text-xs mt-8 animate-fade-in">
                    <Heart className="inline h-3 w-3 text-accent-500 mr-1" fill="currentColor" />
                    ShadiMilan Admin Panel v2.0
                </p>
            </div>
        </div>
    );
};

export default Login;
