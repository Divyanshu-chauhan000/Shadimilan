import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    mobile: yup.string().min(10, 'Mobile must be at least 10 digits').required('Mobile is required'),
    gender: yup.string().oneOf(['Male', 'Female'], 'Select a gender').required('Gender is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
}).required();

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const { register: registerUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const { confirmPassword, ...userData } = data;
            await registerUser(userData);
            navigate('/my-profile');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        'Verified profiles only',
        'Advanced gotra matching',
        'Privacy controls',
        'Dedicated support',
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden rounded-3xl shadow-premium border border-gray-100 animate-fade-in">

                {/* Left — Decorative Panel */}
                <div className="hidden lg:flex lg:col-span-2 flex-col justify-center animated-gradient-bg relative overflow-hidden p-10">
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

                    <div className="relative z-10">
                        <div className="w-16 h-16 mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                            <Sparkles className="h-8 w-8 text-gold-light" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">
                            Start Your Journey to Forever
                        </h2>
                        <p className="text-white/60 mb-8 leading-relaxed">
                            Join ShadiMilan and discover your perfect life partner
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-4">
                            {benefits.map((b) => (
                                <li key={b} className="flex items-center text-white/80 text-sm">
                                    <CheckCircle className="h-5 w-5 text-gold-light mr-3 flex-shrink-0" />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right — Register Form */}
                <div className="lg:col-span-3 bg-white p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4 lg:hidden">
                            <Heart className="h-7 w-7 text-maroon" fill="currentColor" />
                            <span className="text-xl font-display font-bold">
                                <span className="text-maroon">Shadi</span><span className="text-gold">Milan</span>
                            </span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-1">Create Account</h2>
                        <p className="text-gray-500 text-sm">Fill in your details to get started</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5 text-sm text-center border border-red-100 animate-fade-in flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        {...register('name')}
                                        className={`input-field pl-11 ${errors.name ? 'border-red-400' : ''}`}
                                        placeholder="Your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="label-text">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        {...register('mobile')}
                                        className={`input-field pl-11 ${errors.mobile ? 'border-red-400' : ''}`}
                                        placeholder="9876543210"
                                    />
                                </div>
                                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                            </div>

                            <div>
                                <label className="label-text">Gender</label>
                                <select
                                    {...register('gender')}
                                    className={`input-field bg-white ${errors.gender ? 'border-red-400' : ''}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                                        placeholder="Min 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="label-text">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        className={`input-field pl-11 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                                        placeholder="Re-enter password"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3.5 text-lg mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="loader-spinner !h-5 !w-5 !border-2 mr-2" />
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-maroon font-bold hover:text-maroon-dark transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
