import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../services/api';
import { Camera, User, GraduationCap, Users, Shield, MapPin, Phone, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CreateProfile = () => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            family: { siblings: [] }
        }
    });

    const { fields: siblingFields, append: appendSibling, remove: removeSibling } = useFieldArray({
        control,
        name: "family.siblings"
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [activeSection, setActiveSection] = useState(0);

    const sections = [
        { id: 'photo', label: 'Photo', icon: Camera },
        { id: 'basic', label: 'Basic', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'gotra', label: 'Gotra', icon: Shield },
        { id: 'family', label: 'Family', icon: Users },
        { id: 'contact', label: 'Contact', icon: Phone },
    ];

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                if (res.data) {
                    const formattedData = { ...res.data };
                    if (formattedData.dob) {
                        formattedData.dob = new Date(formattedData.dob).toISOString().split('T')[0];
                    }
                    if (formattedData.photoUrl) setPhotoPreview(formattedData.photoUrl);
                    reset(formattedData);
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    setMsg({ type: 'error', text: 'Error fetching profile' });
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyProfile();
    }, [reset]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        setMsg({ type: '', text: '' });

        try {
            const formData = new FormData();

            formData.append('dob', data.dob);
            formData.append('height', data.height);
            formData.append('birthPlace', data.birthPlace);
            formData.append('education', data.education);
            formData.append('occupation', data.occupation);
            if (data.workingAt) formData.append('workingAt', data.workingAt);

            formData.append('family', JSON.stringify(data.family));
            formData.append('gotra', JSON.stringify(data.gotra));
            formData.append('contact', JSON.stringify(data.contact));
            formData.append('residence', JSON.stringify(data.residence));

            if (data.photo && data.photo[0]) {
                formData.append('photo', data.photo[0]);
            }

            await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMsg({ type: 'success', text: 'Profile saved successfully! It is now pending admin approval.' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to save profile' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="loader-spinner" />
            </div>
        );
    }

    const SectionHeader = ({ icon: Icon, title, subtitle }) => (
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon to-primary-600 flex items-center justify-center shadow-md">
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-display font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto page-enter">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">
                    My <span className="gradient-text">Profile</span>
                </h1>
                <p className="text-gray-500 mt-1">Complete your profile to find your perfect match</p>
            </div>

            {/* Progress Indicator */}
            <div className="premium-card p-4 mb-8">
                <div className="flex items-center justify-between overflow-x-auto gap-1">
                    {sections.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => {
                                    setActiveSection(idx);
                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                    activeSection === idx
                                        ? 'bg-maroon text-white shadow-md'
                                        : 'text-gray-500 hover:bg-cream-100 hover:text-maroon'
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-1.5" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Messages */}
            {msg.text && (
                <div className={`flex items-center p-4 rounded-xl mb-8 animate-fade-in ${
                    msg.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-green-50 text-green-700 border border-green-100'
                }`}>
                    {msg.type === 'error' ? <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />}
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* ═══ Photo Upload ═══ */}
                <div id="photo" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={Camera} title="Profile Photo" subtitle="Upload a clear, recent photo" />
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-cream-50 flex-shrink-0 hover:border-maroon/40 transition-colors">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <Camera className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <span className="text-gray-400 text-xs">No Photo</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                {...register('photo')}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-maroon-dark file:transition-colors file:cursor-pointer"
                            />
                            <p className="text-xs text-gray-400 mt-2">Max 5MB • JPG, PNG formats</p>
                        </div>
                    </div>
                </div>

                {/* ═══ Basic Details ═══ */}
                <div id="basic" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={User} title="Basic Details" subtitle="Tell us about yourself" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="label-text">Date of Birth *</label>
                            <input type="date" {...register('dob', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Height *</label>
                            <select {...register('height', { required: true })} className="input-field bg-white">
                                <option value="">Select Height</option>
                                {["5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\""].map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Place of Birth *</label>
                            <input {...register('birthPlace', { required: true })} className="input-field" placeholder="City, State" />
                        </div>
                    </div>
                </div>

                {/* ═══ Education & Occupation ═══ */}
                <div id="education" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={GraduationCap} title="Education & Occupation" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="label-text">Highest Education *</label>
                            <input {...register('education', { required: true })} className="input-field" placeholder="e.g. B.Tech, MBA" />
                        </div>
                        <div>
                            <label className="label-text">Occupation *</label>
                            <input {...register('occupation', { required: true })} className="input-field" placeholder="e.g. Software Engineer" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-text">Working At / Company</label>
                            <input {...register('workingAt')} className="input-field" placeholder="Optional" />
                        </div>
                    </div>
                </div>

                {/* ═══ Gotra ═══ */}
                <div id="gotra" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={Shield} title="Gotra Details" subtitle="Important for matching compatibility" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div>
                            <label className="label-text">Self Gotra *</label>
                            <input {...register('gotra.self', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Mother's Gotra</label>
                            <input {...register('gotra.mother')} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Dadi's Gotra</label>
                            <input {...register('gotra.dadi')} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Nani's Gotra</label>
                            <input {...register('gotra.nani')} className="input-field" />
                        </div>
                    </div>
                </div>

                {/* ═══ Family ═══ */}
                <div id="family" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={Users} title="Family Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="label-text">Father's Name *</label>
                            <input {...register('family.father.name', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Father's Occupation</label>
                            <input {...register('family.father.occupation')} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Mother's Name *</label>
                            <input {...register('family.mother.name', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Mother's Occupation</label>
                            <input {...register('family.mother.occupation')} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Grandfather's Name</label>
                            <input {...register('family.grandfather')} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Grandmother's Name</label>
                            <input {...register('family.grandmother')} className="input-field" />
                        </div>
                    </div>

                    {/* Siblings */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Siblings</h3>
                            <button
                                type="button"
                                onClick={() => appendSibling({ relation: '', education: '', occupation: '' })}
                                className="flex items-center text-sm text-maroon font-semibold hover:text-maroon-dark transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Sibling
                            </button>
                        </div>
                        <div className="space-y-3">
                            {siblingFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-cream-50 p-4 rounded-xl border border-cream-200">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Relation</label>
                                        <select {...register(`family.siblings.${index}.relation`)} className="input-field py-2.5 text-sm bg-white" required>
                                            <option value="">Select</option>
                                            <option value="Elder Brother">Elder Brother</option>
                                            <option value="Younger Brother">Younger Brother</option>
                                            <option value="Elder Sister">Elder Sister</option>
                                            <option value="Younger Sister">Younger Sister</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Education</label>
                                        <input {...register(`family.siblings.${index}.education`)} className="input-field py-2.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Occupation</label>
                                        <input {...register(`family.siblings.${index}.occupation`)} className="input-field py-2.5 text-sm" />
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => removeSibling(index)}
                                            className="flex items-center justify-center w-full py-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-red-200 text-sm font-medium transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {siblingFields.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">No siblings added yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Contact & Residence ═══ */}
                <div id="contact" className="premium-card p-6 md:p-8">
                    <SectionHeader icon={MapPin} title="Contact & Residence" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="label-text">Primary Mobile *</label>
                            <input {...register('contact.primaryMobile', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Alternate Mobile</label>
                            <input {...register('contact.alternateMobile')} className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-text">Full Address *</label>
                            <input {...register('residence.address', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">City *</label>
                            <input {...register('residence.city', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">District *</label>
                            <input {...register('residence.district', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">State *</label>
                            <input {...register('residence.state', { required: true })} className="input-field" />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary text-lg px-10 py-3.5 flex items-center"
                    >
                        {isSaving ? (
                            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...</>
                        ) : (
                            <><CheckCircle className="h-5 w-5 mr-2" /> Save Profile</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProfile;
