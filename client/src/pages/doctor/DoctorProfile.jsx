import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDoctor } from '../../context/DoctorContext';
import API from '../../config/api';
import toast from 'react-hot-toast';
import { 
  UserRound, User, Mail, Phone, Lock, Shield, LayoutDashboard, 
  CalendarDays, CalendarCheck, Clock, Camera, Trash2, Stethoscope, 
  GraduationCap, Languages, MapPin, Briefcase, DollarSign, 
  BookOpen, Star, MessageCircle, ExternalLink, Award, Quote 
} from 'lucide-react';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const { profile: doctorProfile } = useDoctor();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/users/me', form);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await API.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const quickActions = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctor/calendar', label: 'Calendar', icon: CalendarDays },
    { path: '/doctor/appointments', label: 'Appointments', icon: CalendarCheck },
    { path: '/doctor/availability', label: 'Availability', icon: Clock },
  ];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await API.post('/users/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ ...user, photo: data.photo });
      setPhotoPreview(data.photo);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) return;

    try {
      await API.delete('/users/me/photo');
      updateUser({ ...user, photo: '', photoPublicId: '' });
      setPhotoPreview('');
      toast.success('Photo deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">My Profile</h1>
        <p className="text-[var(--color-text-muted)]">Manage your account information</p>
      </div>

      {/* Account Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border-light)]">
          <div className="relative w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--color-primary-50)] flex items-center justify-center shrink-0 overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserRound size={28} className="text-[var(--color-primary)]" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Dr. {user?.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50">
              <Camera size={16} />
              <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
            {photoPreview && (
              <button type="button" onClick={handlePhotoDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-[var(--radius-md)] transition-colors" title="Delete photo">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base input-with-icon"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-base input-with-icon"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="input-base input-with-icon bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Doctor Professional Profile Card */}
      {doctorProfile && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
                <Stethoscope size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Doctor Profile</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Your professional details</p>
              </div>
            </div>
            <Link
              to="/doctor/profile-settings"
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
            >
              Edit Details
            </Link>
          </div>

          <div className="space-y-6">
            {/* About Section */}
            {doctorProfile.about && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">About</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{doctorProfile.about}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                <Stethoscope size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Specialization</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.specialization || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                <Briefcase size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Experience</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.experienceYears ? `${doctorProfile.experienceYears} years` : 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                <GraduationCap size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Qualifications</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.qualifications || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                <Languages size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Languages</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.languagesSpoken?.length ? doctorProfile.languagesSpoken.join(', ') : 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            {doctorProfile.education?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-[var(--color-primary)]" />
                  Education
                </h3>
                <div className="space-y-2">
                  {doctorProfile.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                      <Award size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <p className="text-sm text-[var(--color-text)]">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Info */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                Clinic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                  <MapPin size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Clinic Name</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.clinicName || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                  <MapPin size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Address</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {[
                        doctorProfile.clinicAddress,
                        doctorProfile.landmark,
                        doctorProfile.city,
                        doctorProfile.state,
                        doctorProfile.pincode,
                      ].filter(Boolean).join(', ') || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                  <Phone size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Contact Number</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.contactNumber || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                  <MessageCircle size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">WhatsApp Number</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{doctorProfile.whatsappNumber || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                  <DollarSign size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Consultation Fee</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {doctorProfile.consultationFeeMin ? `₹${doctorProfile.consultationFeeMin} - ₹${doctorProfile.consultationFeeMax}` : 'Not set'}
                    </p>
                  </div>
                </div>
                {(doctorProfile.workingDays || doctorProfile.clinicTiming) && (
                  <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                    <Clock size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Working Hours</p>
                      <p className="text-sm font-medium text-[var(--color-text)] whitespace-pre-line">
                        {doctorProfile.workingDays && <>{doctorProfile.workingDays}<br /></>}
                        {doctorProfile.clinicTiming}
                      </p>
                    </div>
                  </div>
                )}
                {doctorProfile.googleMapsLink && (
                  <div className="sm:col-span-2 flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                    <ExternalLink size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-text-muted)]">Google Maps Link</p>
                      <a href={doctorProfile.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--color-primary)] hover:underline truncate block">
                        {doctorProfile.googleMapsLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {doctorProfile.services?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-[var(--color-primary)]" />
                  Services ({doctorProfile.services.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctorProfile.services.map((service) => (
                    <div key={service._id} className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                      <p className="text-sm font-medium text-[var(--color-text)]">{service.name}</p>
                      {service.description && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">{service.description}</p>
                      )}
                      {service.fee && (
                        <p className="text-xs font-medium text-[var(--color-primary)] mt-1">₹{service.fee}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {doctorProfile.testimonials?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                  <Star size={16} className="text-[var(--color-primary)]" />
                  Testimonials ({doctorProfile.testimonials.length})
                </h3>
                <div className="space-y-3">
                  {doctorProfile.testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-alt)]">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[var(--color-text)]">{testimonial.patientName}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < testimonial.rating ? 'text-[var(--color-warning)] fill-current' : 'text-[var(--color-text-muted)]'} />
                          ))}
                        </div>
                      </div>
                      {testimonial.review && (
                        <p className="text-xs text-[var(--color-text-secondary)] italic flex items-start gap-1">
                          <Quote size={12} className="shrink-0 mt-0.5 text-[var(--color-text-muted)]" />
                          "{testimonial.review}"
                        </p>
                      )}
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {new Date(testimonial.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {!testimonial.visible && (
                          <span className="ml-2 text-red-500">(Hidden)</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="card hover:translate-y-[-2px] group text-center py-5"
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-2 group-hover:bg-[var(--color-primary)] transition-colors">
                  <Icon size={20} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
            <Shield size={20} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Change Password</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Update your security credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Current Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="input-base input-with-icon"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="input-base input-with-icon"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Confirm New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="input-base input-with-icon"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full h-12 bg-[var(--color-text)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-text-secondary)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;