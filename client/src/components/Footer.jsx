import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
            {/* Decorative Top Wave */}
            <div className="absolute top-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#111827"/>
                </svg>
            </div>

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <Heart className="h-7 w-7 text-gold" fill="currentColor" />
                            <span className="text-2xl font-display font-bold">
                                Shadi<span className="text-gold">Milan</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Connecting hearts, building futures. India's most trusted premium matrimonial service for finding your perfect life partner.
                        </p>
                        {/* Social Icons */}
                        <div className="flex space-x-3">
                            {['FB', 'IG', 'TW', 'YT'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-gold hover:text-maroon-dark transition-all duration-300 hover:scale-110 hover:shadow-gold"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'About Us', href: '#' },
                                { label: 'Success Stories', href: '#' },
                                { label: 'Browse Profiles', href: '/browse' },
                                { label: 'Create Profile', href: '/register' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">Legal</h4>
                        <ul className="space-y-3">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Phone className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">+91 98765 43210</p>
                                    <p className="text-gray-500 text-xs">Mon-Sat, 9am-6pm</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300 text-sm">support@shadimilan.com</p>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                                <p className="text-gray-400 text-sm">New Delhi, India</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} ShadiMilan. Made with <Heart className="inline h-3 w-3 text-red-400" fill="currentColor" /> in India
                    </p>
                    <p className="text-gray-600 text-xs">
                        Trusted by 10,000+ families across India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
