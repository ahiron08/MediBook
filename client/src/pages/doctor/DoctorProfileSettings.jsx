import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save, User, MapPin, Phone, DollarSign, Globe } from 'lucide-react';

const DoctorProfileSettings = () => {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => API.get('/doctor-profile/profile').then(res => res.data),
  });

  const [formData, setFormData] = useState({
    doctorName: '',
    specialization: '',
    experienceYears: 0,
    qualifications: '',
    about: '',
    profilePhoto: '',
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
    googleMapsLink: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    if (profileData?.data) {
      setFormData(profileData.data);
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: (data) => API.put('/doctor-profile/profile', data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  if (isLoading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Clinic Information</h1>
        <p className="text-[var(--color-text-muted)]">Manage your profile and clinic details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <User size={24} className="text-[var(--color-primary)]" />
            Doctor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
              <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-base" placeholder="e.g., Cardiologist" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Experience (Years)</label>
              <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="input-base" min="0" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Qualifications</label>
              <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} className="input-base" placeholder="e.g., MBBS, MD, DM" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">About</label>
              <textarea name="about" value={formData.about} onChange={handleChange} className="textarea-base" rows="4" placeholder="Brief description about the doctor..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Profile Photo URL</label>
              <input type="text" name="profilePhoto" value={formData.profilePhoto} onChange={handleChange} className="input-base" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Clinic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-[var(--color-primary)]" />
            Clinic Information
          </h2>
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
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Phone size={24} className="text-[var(--color-primary)]" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Contact Number</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="input-base" />
            </div>
          </div>
        </div>

        {/* Consultation & Timing */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-[var(--color-primary)]" />
            Consultation & Timing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Min Fee (₹)</label>
              <input type="number" name="consultationFeeMin" value={formData.consultationFeeMin} onChange={handleChange} className="input-base" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Max Fee (₹)</label>
              <input type="number" name="consultationFeeMax" value={formData.consultationFeeMax} onChange={handleChange} className="input-base" min="0" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Clinic Timing</label>
              <input type="text" name="clinicTiming" value={formData.clinicTiming} onChange={handleChange} className="input-base" placeholder="e.g., Mon-Fri: 9:00 AM - 6:00 PM" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Google Maps Link</label>
              <input type="text" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} className="input-base" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Globe size={24} className="text-[var(--color-primary)]" />
            SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Title</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="input-base" maxLength="60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Description</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="textarea-base" rows="2" maxLength="160"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SEO Keywords</label>
              <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="input-base" placeholder="doctor, clinic, healthcare" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary flex items-center gap-2">
            <Save size={18} />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileSettings;