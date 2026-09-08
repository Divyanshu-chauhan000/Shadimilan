import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Briefcase, GraduationCap, Heart, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';

/* ───────── Skeleton Loader ───────── */
const ProfileCardSkeleton = () => (
    <div className="premium-card overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="pt-3 border-t border-gray-100">
                <div className="h-9 bg-gray-100 rounded-xl" />
            </div>
        </div>
    </div>
);

const BrowseProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ gender: '', city: '', minAge: '', maxAge: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await api.get(`/profile?${query}`);
            setProfiles(res.data.profiles);
        } catch (error) {
            console.error('Failed to fetch profiles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchProfiles();
    };

    const clearFilters = () => {
        setFilters({ gender: '', city: '', minAge: '', maxAge: '' });
        setTimeout(fetchProfiles, 0);
    };

    const calculateAge = (dob) => {
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <div className="page-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">
                        Browse <span className="gradient-text">Matches</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Discover your perfect life partner</p>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        showFilters || hasActiveFilters
                            ? 'bg-maroon text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-maroon/30 hover:bg-cream-50'
                    }`}
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-2 w-5 h-5 bg-gold text-maroon-dark text-xs font-bold rounded-full flex items-center justify-center">
                            {Object.values(filters).filter(v => v).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Bar */}
            {showFilters && (
                <div className="premium-card p-6 mb-8 animate-fade-in">
                    <form onSubmit={applyFilters} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[120px]">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Gender</label>
                            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="input-field py-2.5 text-sm">
                                <option value="">Any</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">City</label>
                            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="e.g. Delhi" className="input-field py-2.5 text-sm" />
                        </div>
                        <div className="w-24">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Min Age</label>
                            <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} placeholder="18" className="input-field py-2.5 text-sm" />
                        </div>
                        <div className="w-24">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Max Age</label>
                            <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} placeholder="40" className="input-field py-2.5 text-sm" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary py-2.5 px-5 text-sm flex items-center">
                                <Search className="h-4 w-4 mr-1.5" /> Search
                            </button>
                            {hasActiveFilters && (
                                <button type="button" onClick={clearFilters} className="btn-ghost py-2.5 px-3 text-sm text-gray-500">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <ProfileCardSkeleton key={i} />)}
                </div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-24 premium-card">
                    <div className="w-20 h-20 mx-auto mb-6 bg-cream-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-600 mb-2">No matches found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your filters to see more profiles</p>
                    <button onClick={clearFilters} className="btn-outline text-sm">
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                    {profiles.map(profile => (
                        <div key={profile._id} className="premium-card group hover:-translate-y-1.5 transition-all duration-500">
                            {/* Photo */}
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.user?.name}&size=400&background=7f1d1d&color=fff&bold=true`}
                                    alt={profile.user?.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                
                                {/* Name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white text-xl font-display font-bold truncate">{profile.user?.name}</h3>
                                    <p className="text-white/80 text-sm">{calculateAge(profile.dob)} yrs • {profile.height}</p>
                                </div>

                                {/* Heart button */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/40 transition-colors cursor-pointer">
                                        <Heart className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 space-y-2.5">
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-maroon/60 flex-shrink-0" />
                                    <span className="truncate">{profile.residence?.city}, {profile.residence?.state}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <GraduationCap className="h-4 w-4 mr-2 text-maroon/60 flex-shrink-0" />
                                    <span className="truncate">{profile.education}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Briefcase className="h-4 w-4 mr-2 text-maroon/60 flex-shrink-0" />
                                    <span className="truncate">{profile.occupation}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <Link to={`/profile/${profile._id}`} className="block text-center py-2.5 rounded-xl border-2 border-maroon/10 text-maroon font-semibold text-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-300">
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseProfiles;
