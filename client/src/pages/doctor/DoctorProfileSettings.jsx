import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDoctor } from '../../context/DoctorContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save, User, MapPin, Phone, DollarSign, Globe, GraduationCap, Languages, Briefcase, Upload, X } from 'lucide-react';
import doctorProfileAPI from '../../services/doctorProfile';

const DoctorProfileSettings = () => {
  const queryClient = useQueryClient();
  const { profile, isLoading, updateProfile, uploadPhoto } = useDoctor();
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    doctorName: '',
    specialization: '',
    experienceYears: 0,
    qualifications: '',
    about: '',
    profilePhoto: '',
    languagesSpoken: [],
    education: [],
    clinicName: '',
    clinicAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    whatsappNumber: '',
    consultationFeeMin: 0,
    consultationFeeMax: 0,
    clinicTiming: '',
    workingDays: '',
    googleMapsLink: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        doctorName: profile.doctorName || '',
        specialization: profile.specialization || '',
        experienceYears: profile.experienceYears || 0,
        qualifications: profile.qualifications || '',
        about: profile.about || '',
        profilePhoto: profile.profilePhoto || '',
        languagesSpoken: profile.languagesSpoken || [],
        education: profile.education || [],
        clinicName: profile.clinicName || '',
        clinicAddress: profile.clinicAddress || '',
        landmark: profile.landmark || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        contactNumber: profile.contactNumber || '',
        whatsappNumber: profile.whatsappNumber || '',
        consultationFeeMin: profile.consultationFeeMin || 0,
        consultationFeeMax: profile.consultationFeeMax || 0,
        clinicTiming: profile.clinicTiming || '',
        workingDays: profile.workingDays || '',
        googleMapsLink: profile.googleMapsLink || '',
        seoTitle: profile.seoTitle || '',
        seoDescription: profile.seoDescription || '',
        seoKeywords: profile.seoKeywords || '',
      });
      setImagePreview(profile.profilePhoto || null);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      await uploadPhoto(formData);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePhoto: '' }));
  };

  if (isLoading) return <LoadingSpinner text="Loading profile..." />;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'clinic', label: 'Clinic', icon: MapPin },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'seo', label: 'SEO', icon: Globe },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Profile Settings</h1>
        <p className="text-[var(--color-text-muted)]">Manage your profile and clinic details</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Basic Information</h2>
            
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Profile Photo</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-border)]" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="photoUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photoUpload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-alt)] text-[var(--color-text)] rounded-lg cursor-pointer hover:bg-[var(--color-border)] transition-colors"
                  >
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} className="input-base" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Experience (Years)</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="input-base" min="0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Qualifications</label>
                <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} className="input-base" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">About</label>
                <textarea name="about" value={formData.about} onChange={handleChange} className="textarea-base" rows="4"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Education (comma-separated)</label>
                <textarea
                  value={formData.education?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('education', e.target.value)}
                  className="textarea-base"
                  rows="2"
                  placeholder="MBBS, MD, DM"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Languages Spoken (comma-separated)</label>
                <input
                  type="text"
                  value={formData.languagesSpoken?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('languagesSpoken', e.target.value)}
                  className="input-base"
                  placeholder="English, Hindi, Assamese"
                />
              </div>
            </div>
          </div>
        )}

        {/* Clinic Tab */}
        {activeTab === 'clinic' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Clinic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Clinic Name</label>
                <input type="text" name="clinicName" value={formData.clinicName} onChange={handleChange} className="input-base" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Address</label>
                <textarea name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} className="textarea-base" rows="2"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Landmark</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Working Days</label>
                <input type="text" name="workingDays" value={formData.workingDays} onChange={handleChange} className="input-base" placeholder="Monday - Saturday" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Clinic Timing</label>
                <input type="text" name="clinicTiming" value={formData.clinicTiming} onChange={handleChange} className="input-base" placeholder="10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM" />
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Contact Number</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">WhatsApp Number</label>
                <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Min Consultation Fee (₹)</label>
                <input type="number" name="consultationFeeMin" value={formData.consultationFeeMin} onChange={handleChange} className="input-base" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Max Consultation Fee (₹)</label>
                <input type="number" name="consultationFeeMax" value={formData.consultationFeeMax} onChange={handleChange} className="input-base" min="0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Google Maps Link</label>
                <input type="text" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} className="input-base" />
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Title</label>
                <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="input-base" maxLength="60" />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{formData.seoTitle.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Description</label>
                <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="textarea-base" rows="2" maxLength="160"></textarea>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{formData.seoDescription.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Keywords</label>
                <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="input-base" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileSettings;