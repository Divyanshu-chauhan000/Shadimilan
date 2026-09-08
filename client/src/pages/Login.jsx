import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
}).required();

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            await login(data);
            navigate('/browse');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-premium border border-gray-100 animate-fade-in">
                
                {/* Left — Decorative Panel */}
                <div className="hidden lg:flex flex-col justify-center items-center animated-gradient-bg relative overflow-hidden p-12">
                    {/* Floating hearts */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <Heart
                                key={i}
                                className="absolute text-white animate-float"
                                style={{
                                    left: `${Math.random() * 80 + 10}%`,
                                    top: `${Math.random() * 80 + 10}%`,
                                    width: Math.random() * 16 + 10,
                                    height: Math.random() * 16 + 10,
                                    opacity: Math.random() * 0.12 + 0.03,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${Math.random() * 3 + 4}s`,
                                }}
                                fill="currentColor"
                            />
                        ))}
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                            <Heart className="h-10 w-10 text-gold-light animate-heartbeat" fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-4">Welcome Back!</h2>
                        <p className="text-white/70 text-lg max-w-xs mx-auto leading-relaxed">
                            Your perfect match is waiting. Login to continue your beautiful journey.
                        </p>

                        {/* Decorative stats */}
                        <div className="mt-10 flex justify-center space-x-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">5K+</p>
                                <p className="text-white/50 text-xs">Profiles</p>
                            </div>
                            <div className="w-px bg-white/20" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">1.2K+</p>
                                <p className="text-white/50 text-xs">Matches</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right — Login Form */}
                <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-6 lg:hidden">
                            <Heart className="h-7 w-7 text-maroon" fill="currentColor" />
                            <span className="text-xl font-display font-bold">
                                <span className="text-maroon">Shadi</span><span className="text-gold">Milan</span>
                            </span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-gray-500">Login to find your perfect match</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 animate-fade-in flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label-text">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    {...register('email')}
                                    className={`input-field pl-11 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="label-text">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-maroon focus:ring-maroon" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-gold-dark hover:text-maroon transition-colors font-medium">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3.5 text-lg mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="loader-spinner !h-5 !w-5 !border-2 mr-2" />
                                    Logging in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-maroon font-bold hover:text-maroon-dark transition-colors">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
