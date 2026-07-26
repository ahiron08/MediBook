import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDoctor } from '../../context/DoctorContext';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Mail, Phone, Shield, Stethoscope, ExternalLink } from 'lucide-react';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const { profile, isLoading: profileLoading } = useDoctor();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

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

  if (profileLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">My Profile</h1>
        <p className="text-[var(--color-text-muted)]">Manage your personal information</p>
      </div>

      {/* Link to Doctor's Full Profile */}
      {profile && (
        <Link
          to="/doctor-profile"
          className="card bg-gradient-to-br from-[var(--color-primary-50)] to-white hover:shadow-md transition-shadow flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Stethoscope size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">View Doctor's Profile</p>
              <p className="text-xs text-[var(--color-text-muted)]">See clinic info, services & more</p>
            </div>
          </div>
          <ExternalLink size={18} className="text-[var(--color-text-muted)]" />
        </Link>
      )}

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border-light)]">
          <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
            <User size={28} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">{user?.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal Info Cluster */}
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

          {/* Account Info Cluster (read-only) */}
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
    </div>
  );
};

export default PatientProfile;