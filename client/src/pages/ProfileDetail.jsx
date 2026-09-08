import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { User, MapPin, Briefcase, GraduationCap, Heart, Phone, Mail, ArrowLeft, Users, Shield, Calendar, Ruler, Building2 } from 'lucide-react';

const ProfileDetail = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enquiryStatus, setEnquiryStatus] = useState('');
    const [enquiryMsg, setEnquiryMsg] = useState('');
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/profile/${id}`);
                setProfile(res.data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleSendEnquiry = async () => {
        setEnquiryStatus('sending');
        try {
            await api.post('/enquiry', { receiverId: profile.user._id });
            setEnquiryStatus('success');
            setEnquiryMsg('Interest sent successfully! 💕');
        } catch (error) {
            setEnquiryStatus('error');
            setEnquiryMsg(error.response?.data?.message || 'Failed to send interest');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="loader-spinner" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-32">
                <div className="w-20 h-20 mx-auto mb-6 bg-cream-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-600">Profile not found</h3>
                <Link to="/browse" className="text-maroon hover:underline mt-4 inline-block">← Back to profiles</Link>
            </div>
        );
    }

    const calculateAge = (dob) => {
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Details', icon: User },
        { id: 'family', label: 'Family', icon: Users },
        { id: 'gotra', label: 'Gotra', icon: Shield },
    ];

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-maroon/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-maroon/60" />
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-gray-800 font-medium mt-0.5">{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto page-enter">
            {/* Back Button */}
            <Link to="/browse" className="inline-flex items-center text-gray-500 hover:text-maroon font-medium mb-6 transition-colors group">
                <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Profiles
            </Link>

            <div className="premium-card overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-48 md:h-56 animated-gradient-bg overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <Heart
                                key={i}
                                className="absolute text-white animate-float"
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${20 + Math.random() * 50}%`,
                                    width: 14,
                                    height: 14,
                                    opacity: 0.07,
                                    animationDelay: `${i * 1.5}s`,
                                }}
                                fill="currentColor"
                            />
                        ))}
                    </div>

                    {/* Profile ID Badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-white/80 text-xs font-medium">
                        ID: {profile._id.substring(profile._id.length - 6).toUpperCase()}
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="relative px-6 md:px-8 pb-8">
                    {/* Avatar - overlapping banner */}
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-4 md:gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-premium flex-shrink-0">
                            <img
                                src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.user?.name}&size=400&background=7f1d1d&color=fff&bold=true`}
                                alt={profile.user?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{profile.user?.name}</h1>
                            <p className="text-gray-500 mt-1">
                                {calculateAge(profile.dob)} Years • {profile.height} • {profile.user?.gender}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                <span className="badge badge-maroon">{profile.education}</span>
                                <span className="badge badge-gold">{profile.occupation}</span>
                            </div>
                        </div>

                        {/* Send Interest Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleSendEnquiry}
                                disabled={enquiryStatus === 'sending' || enquiryStatus === 'success'}
                                className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                                    enquiryStatus === 'success'
                                        ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                        : 'btn-gold shadow-gold-lg hover:scale-105'
                                }`}
                            >
                                {enquiryStatus === 'sending' ? (
                                    <><span className="loader-spinner !h-4 !w-4 !border-2 mr-2" /> Sending...</>
                                ) : enquiryStatus === 'success' ? (
                                    'Interest Sent ✓'
                                ) : (
                                    <><Heart className="h-5 w-5 mr-2" fill="currentColor" /> Send Interest</>
                                )}
                            </button>
                            {enquiryMsg && (
                                <p className={`text-center text-sm mt-2 ${enquiryStatus === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                    {enquiryMsg}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-5 py-3 font-medium text-sm transition-all duration-300 whitespace-nowrap border-b-2 ${
                                        activeTab === tab.id
                                            ? 'border-maroon text-maroon'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="animate-fade-in" key={activeTab}>
                        {activeTab === 'basic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <InfoRow icon={Calendar} label="Date of Birth" value={new Date(profile.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                <InfoRow icon={Ruler} label="Height" value={profile.height} />
                                <InfoRow icon={MapPin} label="Birth Place" value={profile.birthPlace} />
                                <InfoRow icon={MapPin} label="Current Location" value={`${profile.residence?.city}, ${profile.residence?.state}`} />
                                <InfoRow icon={GraduationCap} label="Education" value={profile.education} />
                                <InfoRow icon={Briefcase} label="Occupation" value={profile.occupation} />
                                {profile.workingAt && <InfoRow icon={Building2} label="Working At" value={profile.workingAt} />}
                            </div>
                        )}

                        {activeTab === 'family' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    <InfoRow icon={User} label="Father's Name" value={profile.family?.father?.name} />
                                    <InfoRow icon={Briefcase} label="Father's Occupation" value={profile.family?.father?.occupation} />
                                    <InfoRow icon={User} label="Mother's Name" value={profile.family?.mother?.name} />
                                    <InfoRow icon={Briefcase} label="Mother's Occupation" value={profile.family?.mother?.occupation} />
                                    {profile.family?.grandfather && <InfoRow icon={User} label="Grandfather" value={profile.family.grandfather} />}
                                </div>

                                {profile.family?.siblings?.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Siblings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {profile.family.siblings.map((sib, idx) => (
                                                <div key={idx} className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                                                    <p className="font-semibold text-gray-800 text-sm">{sib.relation}</p>
                                                    <p className="text-gray-500 text-sm">{sib.education} • {sib.occupation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'gotra' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-maroon/5 to-gold/5 rounded-xl p-5 border border-maroon/10">
                                    <p className="text-xs font-bold text-maroon uppercase tracking-wide mb-1">Self Gotra</p>
                                    <p className="text-xl font-display font-bold text-gray-900">{profile.gotra?.self}</p>
                                </div>
                                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Mother's Gotra</p>
                                    <p className="text-lg font-display font-semibold text-gray-700">{profile.gotra?.mother || 'N/A'}</p>
                                </div>
                                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Dadi's Gotra</p>
                                    <p className="text-lg font-display font-semibold text-gray-700">{profile.gotra?.dadi || 'N/A'}</p>
                                </div>
                                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Nani's Gotra</p>
                                    <p className="text-lg font-display font-semibold text-gray-700">{profile.gotra?.nani || 'N/A'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;
