import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import {
  Save,
  Upload,
  Trash2,
  Plus,
  X,
  Award,
  Briefcase,
  Heart,
  Stethoscope,
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon,
  HelpCircle,
  Star,
  Share2,
  Settings,
  Loader2,
} from 'lucide-react';

const ManageProfile = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    gender: 'other',
    languages: ['English', 'Hindi'],
    about: '',
    education: [],
    specialInterests: [],
    registrationNumber: '',
    medicalCouncil: '',
    qualifications: [],
    experienceDetails: [],
    achievements: [],
    awards: [],
    services: [],
    fees: [],
    consultationFeeRange: { min: 0, max: 0 },
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
    googleMap: {
      url: '',
      latitude: '',
      longitude: '',
      embedUrl: '',
    },
    faqs: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
    },
    socialLinks: [],
    vacationDates: [],
    isAvailable: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: async () => {
      const { data } = await API.get('/doctor-profile/me');
      return data.profile;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => API.put('/doctor-profile/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorProfile']);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const photoUploadMutation = useMutation({
    mutationFn: (formData) =>
      API.post('/doctor-profile/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorProfile']);
      toast.success('Photo uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    },
  });

  const galleryUploadMutation = useMutation({
    mutationFn: (formData) =>
      API.post('/doctor-profile/me/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorProfile']);
      toast.success('Gallery images uploaded');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        specialization: data.specialization || '',
        experience: data.experience || '',
        gender: data.gender || 'other',
        languages: data.languages || ['English', 'Hindi'],
        about: data.about || '',
        education: data.education || [],
        specialInterests: data.specialInterests || [],
        registrationNumber: data.registrationNumber || '',
        medicalCouncil: data.medicalCouncil || '',
        qualifications: data.qualifications || [],
        experienceDetails: data.experienceDetails || [],
        achievements: data.achievements || [],
        awards: data.awards || [],
        services: data.services || [],
        fees: data.fees || [],
        consultationFeeRange: data.consultationFeeRange || { min: 0, max: 0 },
        clinic: data.clinic || {
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
        timings: data.timings || [],
        googleMap: data.googleMap || {
          url: '',
          latitude: '',
          longitude: '',
          embedUrl: '',
        },
        faqs: data.faqs || [],
        seo: data.seo || {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          twitterCard: 'summary_large_image',
        },
        socialLinks: data.socialLinks || [],
        vacationDates: data.vacationDates || [],
        isAvailable: data.isAvailable ?? true,
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    photoUploadMutation.mutate(formData);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    galleryUploadMutation.mutate(formData);
  };

  const addToArray = (field, value) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()],
    });
  };

  const removeFromArray = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Settings },
    { id: 'about', label: 'About', icon: Heart },
    { id: 'qualifications', label: 'Qualifications', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Stethoscope },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'clinic', label: 'Clinic', icon: MapPin },
    { id: 'timings', label: 'Timings', icon: Clock },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'seo', label: 'SEO', icon: Share2 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Profile</h1>
        <p className="text-gray-600">Update your professional information</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex overflow-x-auto border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {data?.profilePhoto && (
                    <img
                      src={data.profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]">
                    <Upload size={18} />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="input-base"
                    placeholder="e.g., 26+ Years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input-base"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        languages: e.target.value.split(',').map((l) => l.trim()),
                      })
                    }
                    className="input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={6}
                  className="input-base"
                  placeholder="Write a detailed biography..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <div className="space-y-2">
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={edu} disabled className="input-base flex-1" />
                      <button
                        type="button"
                        onClick={() => removeFromArray('education', idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add education"
                      className="input-base flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToArray('education', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addToArray('education', input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specialInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeFromArray('specialInterests', idx)}
                        className="hover:text-pink-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add special interest"
                    className="input-base flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('specialInterests', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addToArray('specialInterests', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Council
                  </label>
                  <input
                    type="text"
                    value={formData.medicalCouncil}
                    onChange={(e) => setFormData({ ...formData, medicalCouncil: e.target.value })}
                    className="input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Qualifications Tab */}
          {activeTab === 'qualifications' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                <div className="space-y-3">
                  {formData.qualifications.map((qual, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={qual.degree}
                          onChange={(e) => {
                            const newQuals = [...formData.qualifications];
                            newQuals[idx].degree = e.target.value;
                            setFormData({ ...formData, qualifications: newQuals });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={qual.institution}
                          onChange={(e) => {
                            const newQuals = [...formData.qualifications];
                            newQuals[idx].institution = e.target.value;
                            setFormData({ ...formData, qualifications: newQuals });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={qual.year}
                          onChange={(e) => {
                            const newQuals = [...formData.qualifications];
                            newQuals[idx].year = e.target.value;
                            setFormData({ ...formData, qualifications: newQuals });
                          }}
                          className="input-base"
                        />
                        <select
                          value={qual.type}
                          onChange={(e) => {
                            const newQuals = [...formData.qualifications];
                            newQuals[idx].type = e.target.value;
                            setFormData({ ...formData, qualifications: newQuals });
                          }}
                          className="input-base"
                        >
                          <option value="degree">Degree</option>
                          <option value="certification">Certification</option>
                          <option value="fellowship">Fellowship</option>
                          <option value="training">Training</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromArray('qualifications', idx)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        qualifications: [...formData.qualifications, { degree: '', institution: '', year: '', type: 'degree' }],
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--color-primary)] text-gray-600 hover:text-[var(--color-primary)]"
                  >
                    <Plus size={18} />
                    Add Qualification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Details
                </label>
                <div className="space-y-3">
                  {formData.experienceDetails.map((exp, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...formData.experienceDetails];
                            newExp[idx].position = e.target.value;
                            setFormData({ ...formData, experienceDetails: newExp });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Hospital/Clinic"
                          value={exp.hospital}
                          onChange={(e) => {
                            const newExp = [...formData.experienceDetails];
                            newExp[idx].hospital = e.target.value;
                            setFormData({ ...formData, experienceDetails: newExp });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...formData.experienceDetails];
                            newExp[idx].startDate = e.target.value;
                            setFormData({ ...formData, experienceDetails: newExp });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="End Date (or Present)"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExp = [...formData.experienceDetails];
                            newExp[idx].endDate = e.target.value;
                            setFormData({ ...formData, experienceDetails: newExp });
                          }}
                          className="input-base"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromArray('experienceDetails', idx)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        experienceDetails: [...formData.experienceDetails, { position: '', hospital: '', startDate: '', endDate: 'Present' }],
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--color-primary)] text-gray-600 hover:text-[var(--color-primary)]"
                  >
                    <Plus size={18} />
                    Add Experience
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                <div className="space-y-3">
                  {formData.services.map((service, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Service Name"
                          value={service.name}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[idx].name = e.target.value;
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={service.duration}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[idx].duration = e.target.value;
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Fee (optional)"
                          value={service.fee}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[idx].fee = e.target.value;
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="input-base"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[idx].description = e.target.value;
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="input-base"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromArray('services', idx)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        services: [...formData.services, { name: '', description: '', fee: '', duration: '', order: formData.services.length }],
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--color-primary)] text-gray-600 hover:text-[var(--color-primary)]"
                  >
                    <Plus size={18} />
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min (₹)</label>
                    <input
                      type="number"
                      value={formData.consultationFeeRange.min}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consultationFeeRange: {
                            ...formData.consultationFeeRange,
                            min: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max (₹)</label>
                    <input
                      type="number"
                      value={formData.consultationFeeRange.max}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consultationFeeRange: {
                            ...formData.consultationFeeRange,
                            max: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="input-base"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Structure
                </label>
                <div className="space-y-3">
                  {formData.fees.map((fee, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={fee.type}
                          onChange={(e) => {
                            const newFees = [...formData.fees];
                            newFees[idx].type = e.target.value;
                            setFormData({ ...formData, fees: newFees });
                          }}
                          className="input-base"
                        >
                          <option value="new_consultation">New Consultation</option>
                          <option value="follow_up">Follow-up</option>
                          <option value="video_consultation">Video Consultation</option>
                          <option value="emergency">Emergency</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Amount (₹)"
                          value={fee.amount}
                          onChange={(e) => {
                            const newFees = [...formData.fees];
                            newFees[idx].amount = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, fees: newFees });
                          }}
                          className="input-base"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={fee.isActive}
                            onChange={(e) => {
                              const newFees = [...formData.fees];
                              newFees[idx].isActive = e.target.checked;
                              setFormData({ ...formData, fees: newFees });
                            }}
                          />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromArray('fees', idx)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        fees: [...formData.fees, { type: 'new_consultation', amount: 0, currency: 'INR', isActive: true }],
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--color-primary)] text-gray-600 hover:text-[var(--color-primary)]"
                  >
                    <Plus size={18} />
                    Add Fee Type
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clinic Tab */}
          {activeTab === 'clinic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, name: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.clinic.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, address: e.target.value },
                      })
                    }
                    rows={3}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.landmark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, landmark: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, city: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, state: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, pincode: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clinic.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, phone: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.clinic.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, whatsapp: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.clinic.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, email: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timing
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.timing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, timing: e.target.value },
                      })
                    }
                    className="input-base"
                    placeholder="Mon-Sat: 10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formData.clinic.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinic: { ...formData.clinic, emergencyContact: e.target.value },
                      })
                    }
                    className="input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timings Tab */}
          {activeTab === 'timings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Schedule
                </label>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const timing = formData.timings.find((t) => t.day === day) || { day, isWorking: true, slots: [] };
                    return (
                      <div key={day} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{day}</h3>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={timing.isWorking}
                              onChange={(e) => {
                                const newTimings = formData.timings.filter((t) => t.day !== day);
                                if (e.target.checked) {
                                  newTimings.push({ day, isWorking: true, slots: [{ start: '09:00', end: '17:00' }] });
                                } else {
                                  newTimings.push({ day, isWorking: false, slots: [] });
                                }
                                setFormData({ ...formData, timings: newTimings });
                              }}
                            />
                            <span className="text-sm">Working</span>
                          </label>
                        </div>
                        {timing.isWorking && (
                          <div className="space-y-2">
                            {timing.slots.map((slot, slotIdx) => (
                              <div key={slotIdx} className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) => {
                                    const newTimings = formData.timings.map((t) => {
                                      if (t.day === day) {
                                        const newSlots = [...t.slots];
                                        newSlots[slotIdx] = { ...newSlots[slotIdx], start: e.target.value };
                                        return { ...t, slots: newSlots };
                                      }
                                      return t;
                                    });
                                    setFormData({ ...formData, timings: newTimings });
                                  }}
                                  className="input-base"
                                />
                                <span>to</span>
                                <input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) => {
                                    const newTimings = formData.timings.map((t) => {
                                      if (t.day === day) {
                                        const newSlots = [...t.slots];
                                        newSlots[slotIdx] = { ...newSlots[slotIdx], end: e.target.value };
                                        return { ...t, slots: newSlots };
                                      }
                                      return t;
                                    });
                                    setFormData({ ...formData, timings: newTimings });
                                  }}
                                  className="input-base"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newTimings = formData.timings.map((t) => {
                                  if (t.day === day) {
                                    return { ...t, slots: [...t.slots, { start: '09:00', end: '17:00' }] };
                                  }
                                  return t;
                                });
                                setFormData({ ...formData, timings: newTimings });
                              }}
                              className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                              + Add another slot
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Images
                </label>
                {data?.clinicImages && data.clinicImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {data.clinicImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                        <img src={img} alt={`Clinic ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]">
                  <Upload size={18} />
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['basic', 'about', 'qualifications', 'experience', 'services', 'fees', 'clinic', 'timings', 'gallery'].includes(activeTab) && (
            <div className="text-center py-12 text-gray-500">
              <p>This section is under development</p>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;