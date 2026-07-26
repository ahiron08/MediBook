import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../config/api';
import toast from 'react-hot-toast';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Star,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  Stethoscope,
  Navigation,
  MessageCircle,
  Video,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Settings,
  FileText,
  Camera,
} from 'lucide-react';

const DoctorProfileAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [profile, setProfile] = useState({
    doctorName: '',
    specialization: '',
    experience: '',
    qualifications: [],
    about: '',
    registrationNumber: '',
    medicalCouncil: '',
    languages: [],
    gender: 'other',
    specialInterests: [],
    profilePhoto: '',
    services: [],
    fees: {
      newConsultation: 0,
      followUpConsultation: 0,
      videoConsultation: 0,
      emergencyConsultation: 0,
    },
    clinic: {
      name: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      whatsapp: '',
      email: '',
      timing: '',
      emergencyContact: '',
    },
    timings: [],
    breakTimings: [],
    googleMapLink: '',
    latitude: '',
    longitude: '',
    clinicImages: [],
    testimonials: [],
    faqs: [],
    education: [],
    experience: [],
    awards: [],
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
    },
    isAvailable: true,
    availabilityStatus: 'available',
    vacationDates: [],
    unavailableDates: [],
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/doctor/admin/profile');
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setProfile((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayInputChange = (section, index, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addToArray = (section, newItem) => {
    setProfile((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeFromArray = (section, index) => {
    setProfile((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/doctor/admin/profile', profile);
      if (data.success) {
        toast.success('Profile saved successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await API.post('/doctor/admin/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, profilePhoto: data.data.profilePhoto }));
      toast.success('Profile photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error(error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', '');

    try {
      const { data } = await API.post('/doctor/admin/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({
        ...prev,
        clinicImages: [...prev.clinicImages, { url: data.data.url, publicId: data.data.publicId, caption: '' }],
      }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (publicId) => {
    try {
      await API.delete(`/doctor/admin/gallery/${publicId}`);
      setProfile((prev) => ({
        ...prev,
        clinicImages: prev.clinicImages.filter((img) => img.publicId !== publicId),
      }));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  const sections = [
    { id: 'general', label: 'General Information', icon: User },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Stethoscope },
    { id: 'fees', label: 'Consultation Fees', icon: CheckCircle },
    { id: 'clinic', label: 'Clinic Information', icon: MapPin },
    { id: 'timings', label: 'Clinic Timings', icon: Clock },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'faq', label: 'FAQ', icon: MessageCircle },
    { id: 'seo', label: 'SEO', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Profile Management</h1>
          <p className="text-gray-600">Manage your public profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon size={18} />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {/* General Information */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Information</h2>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                        {profile.profilePhoto ? (
                          <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={40} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <Upload size={18} />
                        {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={profile.doctorName}
                        onChange={(e) => handleInputChange(null, 'doctorName', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <input
                        type="text"
                        value={profile.specialization}
                        onChange={(e) => handleInputChange(null, 'specialization', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={profile.experience}
                        onChange={(e) => handleInputChange(null, 'experience', e.target.value)}
                        className="input-base"
                        placeholder="e.g., 10+ years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={profile.gender}
                        onChange={(e) => handleInputChange(null, 'gender', e.target.value)}
                        className="input-base"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      <input
                        type="text"
                        value={profile.registrationNumber}
                        onChange={(e) => handleInputChange(null, 'registrationNumber', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Council</label>
                      <input
                        type="text"
                        value={profile.medicalCouncil}
                        onChange={(e) => handleInputChange(null, 'medicalCouncil', e.target.value)}
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma-separated)</label>
                    <input
                      type="text"
                      value={profile.qualifications.join(', ')}
                      onChange={(e) => handleInputChange(null, 'qualifications', e.target.value.split(',').map(q => q.trim()))}
                      className="input-base"
                      placeholder="MBBS, MD, MS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken (comma-separated)</label>
                    <input
                      type="text"
                      value={profile.languages.join(', ')}
                      onChange={(e) => handleInputChange(null, 'languages', e.target.value.split(',').map(l => l.trim()))}
                      className="input-base"
                      placeholder="English, Hindi, Assamese"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Interests (comma-separated)</label>
                    <input
                      type="text"
                      value={profile.specialInterests.join(', ')}
                      onChange={(e) => handleInputChange(null, 'specialInterests', e.target.value.split(',').map(s => s.trim()))}
                      className="input-base"
                      placeholder="High Risk Pregnancy, Infertility Treatment"
                    />
                  </div>
                </div>
              )}

              {/* About Section */}
              {activeSection === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About the Doctor</label>
                    <textarea
                      value={profile.about}
                      onChange={(e) => handleInputChange(null, 'about', e.target.value)}
                      rows={10}
                      className="input-base"
                      placeholder="Write a detailed biography..."
                    />
                  </div>
                </div>
              )}

              {/* Qualifications Section */}
              {activeSection === 'qualifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualifications</h2>
                  <div className="space-y-3">
                    {profile.qualifications.map((qual, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={qual}
                          onChange={(e) => handleArrayInputChange('qualifications', index, '', e.target.value)}
                          className="input-base flex-1"
                        />
                        <button
                          onClick={() => removeFromArray('qualifications', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToArray('qualifications', '')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    Add Qualification
                  </button>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => handleArrayInputChange('experience', index, 'position', e.target.value)}
                            className="input-base"
                          />
                          <input
                            type="text"
                            placeholder="Hospital/Clinic"
                            value={exp.hospital}
                            onChange={(e) => handleArrayInputChange('experience', index, 'hospital', e.target.value)}
                            className="input-base"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={exp.duration}
                            onChange={(e) => handleArrayInputChange('experience', index, 'duration', e.target.value)}
                            className="input-base"
                          />
                          <textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleArrayInputChange('experience', index, 'description', e.target.value)}
                            className="input-base"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={() => removeFromArray('experience', index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToArray('experience', { position: '', hospital: '', duration: '', description: '' })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    Add Experience
                  </button>
                </div>
              )}

              {/* Services Section */}
              {activeSection === 'services' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                  <div className="space-y-4">
                    {profile.services.map((service, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Service Name"
                            value={service.name}
                            onChange={(e) => handleArrayInputChange('services', index, 'name', e.target.value)}
                            className="input-base"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={service.duration}
                            onChange={(e) => handleArrayInputChange('services', index, 'duration', e.target.value)}
                            className="input-base"
                          />
                          <input
                            type="number"
                            placeholder="Fee (₹)"
                            value={service.fee}
                            onChange={(e) => handleArrayInputChange('services', index, 'fee', parseFloat(e.target.value) || 0)}
                            className="input-base"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) => handleArrayInputChange('services', index, 'description', e.target.value)}
                            className="input-base"
                          />
                        </div>
                        <button
                          onClick={() => removeFromArray('services', index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToArray('services', { name: '', description: '', fee: 0, duration: '30 minutes', icon: '', order: profile.services.length })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    Add Service
                  </button>
                </div>
              )}

              {/* Fees Section */}
              {activeSection === 'fees' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Fees</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Consultation (₹)</label>
                      <input
                        type="number"
                        value={profile.fees.newConsultation}
                        onChange={(e) => handleInputChange('fees', 'newConsultation', parseFloat(e.target.value) || 0)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Consultation (₹)</label>
                      <input
                        type="number"
                        value={profile.fees.followUpConsultation}
                        onChange={(e) => handleInputChange('fees', 'followUpConsultation', parseFloat(e.target.value) || 0)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Consultation (₹)</label>
                      <input
                        type="number"
                        value={profile.fees.videoConsultation}
                        onChange={(e) => handleInputChange('fees', 'videoConsultation', parseFloat(e.target.value) || 0)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Consultation (₹)</label>
                      <input
                        type="number"
                        value={profile.fees.emergencyConsultation}
                        onChange={(e) => handleInputChange('fees', 'emergencyConsultation', parseFloat(e.target.value) || 0)}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Clinic Information */}
              {activeSection === 'clinic' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                      <input
                        type="text"
                        value={profile.clinic.name}
                        onChange={(e) => handleInputChange('clinic', 'name', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={profile.clinic.address}
                        onChange={(e) => handleInputChange('clinic', 'address', e.target.value)}
                        rows={3}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                      <input
                        type="text"
                        value={profile.clinic.landmark}
                        onChange={(e) => handleInputChange('clinic', 'landmark', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={profile.clinic.city}
                        onChange={(e) => handleInputChange('clinic', 'city', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={profile.clinic.state}
                        onChange={(e) => handleInputChange('clinic', 'state', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={profile.clinic.pincode}
                        onChange={(e) => handleInputChange('clinic', 'pincode', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profile.clinic.phone}
                        onChange={(e) => handleInputChange('clinic', 'phone', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                      <input
                        type="tel"
                        value={profile.clinic.whatsapp}
                        onChange={(e) => handleInputChange('clinic', 'whatsapp', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.clinic.email}
                        onChange={(e) => handleInputChange('clinic', 'email', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        type="tel"
                        value={profile.clinic.emergencyContact}
                        onChange={(e) => handleInputChange('clinic', 'emergencyContact', e.target.value)}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Timings Section */}
              {activeSection === 'timings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Timings</h2>
                  <div className="space-y-3">
                    {profile.timings.map((timing, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-medium text-gray-900 min-w-[120px]">{timing.day}</span>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={timing.isClosed}
                              onChange={(e) => handleArrayInputChange('timings', index, 'isClosed', e.target.checked)}
                            />
                            <span className="text-sm">Closed</span>
                          </label>
                        </div>
                        {!timing.isClosed && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Morning Start</label>
                              <input
                                type="time"
                                value={timing.morningStart}
                                onChange={(e) => handleArrayInputChange('timings', index, 'morningStart', e.target.value)}
                                className="input-base"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Morning End</label>
                              <input
                                type="time"
                                value={timing.morningEnd}
                                onChange={(e) => handleArrayInputChange('timings', index, 'morningEnd', e.target.value)}
                                className="input-base"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Evening Start</label>
                              <input
                                type="time"
                                value={timing.eveningStart}
                                onChange={(e) => handleArrayInputChange('timings', index, 'eveningStart', e.target.value)}
                                className="input-base"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Evening End</label>
                              <input
                                type="time"
                                value={timing.eveningEnd}
                                onChange={(e) => handleArrayInputChange('timings', index, 'eveningEnd', e.target.value)}
                                className="input-base"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              {activeSection === 'gallery' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {profile.clinicImages.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img src={image.url} alt={image.caption} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteGalleryImage(image.publicId)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <Upload size={18} />
                    {uploadingGallery ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                  </label>
                </div>
              )}

              {/* Testimonials Section */}
              {activeSection === 'testimonials' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Testimonials</h2>
                  <div className="space-y-4">
                    {profile.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Patient Name"
                            value={testimonial.patientName}
                            onChange={(e) => handleArrayInputChange('testimonials', index, 'patientName', e.target.value)}
                            className="input-base"
                          />
                          <input
                            type="number"
                            placeholder="Rating (1-5)"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => handleArrayInputChange('testimonials', index, 'rating', parseInt(e.target.value))}
                            className="input-base"
                          />
                          <textarea
                            placeholder="Review"
                            value={testimonial.review}
                            onChange={(e) => handleArrayInputChange('testimonials', index, 'review', e.target.value)}
                            className="input-base md:col-span-2"
                            rows={3}
                          />
                        </div>
                        <button
                          onClick={() => removeFromArray('testimonials', index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToArray('testimonials', { patientName: '', rating: 5, review: '', date: new Date(), isAnonymous: false, isVerified: true })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    Add Testimonial
                  </button>
                </div>
              )}

              {/* FAQ Section */}
              {activeSection === 'faq' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {profile.faqs.map((faq, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => handleArrayInputChange('faqs', index, 'question', e.target.value)}
                          className="input-base"
                        />
                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) => handleArrayInputChange('faqs', index, 'answer', e.target.value)}
                          className="input-base"
                          rows={3}
                        />
                        <button
                          onClick={() => removeFromArray('faqs', index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToArray('faqs', { question: '', answer: '', order: profile.faqs.length })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    Add FAQ
                  </button>
                </div>
              )}

              {/* SEO Section */}
              {activeSection === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={profile.seo.metaTitle}
                        onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                        className="input-base"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">{profile.seo.metaTitle.length}/60 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={profile.seo.metaDescription}
                        onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                        rows={3}
                        className="input-base"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">{profile.seo.metaDescription.length}/160 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={profile.seo.keywords}
                        onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                        className="input-base"
                        placeholder="gynecologist, obstetrician, women health"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                      <input
                        type="text"
                        value={profile.seo.ogTitle}
                        onChange={(e) => handleInputChange('seo', 'ogTitle', e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                      <textarea
                        value={profile.seo.ogDescription}
                        onChange={(e) => handleInputChange('seo', 'ogDescription', e.target.value)}
                        rows={3}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileAdmin;