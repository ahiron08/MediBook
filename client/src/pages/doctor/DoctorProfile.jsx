import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../config/api';
import toast from 'react-hot-toast';
import { UserRound, User, Mail, Phone, Lock, Shield, LayoutDashboard, CalendarDays, CalendarCheck, Clock } from 'lucide-react';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">My Profile</h1>
        <p className="text-[var(--color-text-muted)]">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border-light)]">
          <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
            <UserRound size={28} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Dr. {user?.name}</h2>
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
          {/* Current Password (full width) */}
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

          {/* New Password + Confirm Password Cluster */}
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
