import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Star, ArrowRight, CheckCircle, Sparkles, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ───────── Animated Counter Component ───────── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [started, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ───────── Floating Hearts Background ───────── */
const FloatingHearts = () => {
    const hearts = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 12,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 5,
        opacity: Math.random() * 0.12 + 0.03,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {hearts.map((h) => (
                <Heart
                    key={h.id}
                    className="absolute animate-float text-white"
                    style={{
                        left: h.left,
                        top: `${Math.random() * 80 + 10}%`,
                        width: h.size,
                        height: h.size,
                        opacity: h.opacity,
                        animationDelay: `${h.delay}s`,
                        animationDuration: `${h.duration}s`,
                    }}
                    fill="currentColor"
                />
            ))}
        </div>
    );
};

/* ───────── Main Home Component ───────── */
const Home = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: '100% Verified',
            desc: 'Every profile is manually screened by our expert team to ensure authenticity and a safe, trustworthy experience.',
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: Heart,
            title: 'Smart Matching',
            desc: 'Our intelligent algorithms find compatible partners based on your preferences, values, and cultural background.',
            color: 'from-rose-500 to-pink-600',
        },
        {
            icon: Users,
            title: 'Premium Community',
            desc: 'Join thousands of educated professionals and respected families seeking meaningful, lifelong relationships.',
            color: 'from-amber-500 to-orange-600',
        },
    ];

    const steps = [
        { num: '01', title: 'Create Profile', desc: 'Sign up and build your detailed matrimonial profile with family & gotra info' },
        { num: '02', title: 'Browse Matches', desc: 'Discover compatible profiles filtered by location, education, and more' },
        { num: '03', title: 'Send Interest', desc: 'Express your interest and connect with potential life partners' },
        { num: '04', title: 'Get Connected', desc: 'Start meaningful conversations and begin your journey to forever' },
    ];

    const testimonials = [
        {
            name: 'Amit & Neha',
            location: 'Delhi',
            text: 'ShadiMilan helped us find each other. The verified profiles gave our families confidence, and now we are happily married!',
            date: 'Married in 2025',
        },
        {
            name: 'Rohit & Kavita',
            location: 'Jaipur',
            text: 'The gotra matching feature is so unique! It made it easy for our families to approve. Thank you ShadiMilan!',
            date: 'Married in 2024',
        },
    ];

    return (
        <div className="flex flex-col -mt-8 -mx-4 lg:-mx-8">
            {/* ═══════════ HERO SECTION ═══════════ */}
            <section className="relative min-h-[85vh] flex items-center animated-gradient-bg overflow-hidden">
                <FloatingHearts />

                {/* Decorative circles */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10 container mx-auto px-4 lg:px-8 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in">
                            <Sparkles className="h-4 w-4 mr-2 text-gold-light" />
                            India's Most Trusted Matrimonial Platform
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up">
                            Find Your{' '}
                            <span className="relative inline-block">
                                <span className="gradient-text-gold">Perfect Match</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                                    <path d="M2 6C50 2 150 2 198 6" stroke="#d4a843" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                                </svg>
                            </span>
                            <br />
                            <span className="text-white/90">With Confidence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Join our premium matrimonial community with verified profiles, gotra matching, and a beautiful journey to forever.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-maroon-dark rounded-2xl font-bold text-lg shadow-gold-lg hover:shadow-gold hover:scale-105 transition-all duration-300">
                                Create Free Profile
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-maroon transition-all duration-300">
                                Login
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            {[
                                { value: 5000, suffix: '+', label: 'Profiles' },
                                { value: 1200, suffix: '+', label: 'Matches' },
                                { value: 98, suffix: '%', label: 'Verified' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl md:text-3xl font-bold text-white font-display">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-white/50 text-sm mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 80L48 70C96 60 192 40 288 30C384 20 480 20 576 25C672 30 768 40 864 45C960 50 1056 50 1152 45C1248 40 1344 30 1392 25L1440 20V80H0Z" fill="#fefdfb"/>
                    </svg>
                </div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section className="py-20 lg:py-28 bg-cream-50">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Why Choose <span className="gradient-text">ShadiMilan</span>?</h2>
                        <div className="section-divider mt-4 mb-4" />
                        <p className="section-subtitle">We make finding your life partner simple, safe, and beautiful</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="premium-card p-8 text-center group hover:-translate-y-2 transition-all duration-500">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section className="py-20 lg:py-28 bg-white decorative-dots">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
                        <div className="section-divider mt-4 mb-4" />
                        <p className="section-subtitle">Your journey to forever starts here — in just 4 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
                        {steps.map((step, idx) => (
                            <div key={step.num} className="relative text-center group">
                                {/* Connector line */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-maroon/20 to-transparent" />
                                )}
                                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-maroon to-primary-600 text-white font-display font-bold text-2xl mb-6 shadow-premium group-hover:scale-110 transition-transform duration-500">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="py-20 lg:py-28 bg-gradient-to-br from-cream-100 via-cream-50 to-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Success <span className="gradient-text">Stories</span></h2>
                        <div className="section-divider mt-4 mb-4" />
                        <p className="section-subtitle">Real couples who found love through ShadiMilan</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="premium-card p-8 relative">
                                <div className="absolute top-4 right-6 text-gold/20 text-6xl font-display">"</div>
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon to-primary-500 flex items-center justify-center text-white font-bold text-lg">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-display font-bold text-gray-900">{t.name}</h4>
                                        <p className="text-sm text-gray-500">{t.location} • {t.date}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic leading-relaxed relative z-10">"{t.text}"</p>
                                <div className="flex mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-gold" fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ CTA SECTION ═══════════ */}
            <section className="relative py-20 animated-gradient-bg overflow-hidden">
                <FloatingHearts />
                <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Ready to Find Your <span className="gradient-text-gold">Soulmate</span>?
                    </h2>
                    <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of happy couples who found their perfect match on ShadiMilan
                    </p>
                    <Link to="/register" className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-gold to-gold-light text-maroon-dark rounded-2xl font-bold text-lg shadow-gold-lg hover:scale-105 transition-all duration-300">
                        Start Your Journey Today
                        <Heart className="ml-2 h-5 w-5 group-hover:animate-heartbeat" fill="currentColor" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
