import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, UserCircle, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, 'doctor');
      toast.success('Welcome back, Doctor!');
      navigate('/doctor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-var(--header-height))]">
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-blue-200/50">
              <UserCircle size={24} className="text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Welcome back, Doctor</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Sign in to access your clinic dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@clinic.com"
                    className="input-base input-with-icon"
                  />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-base input-with-icon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-[var(--color-text-muted)]">Are you a patient?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full h-12 leading-[48px] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] hover:border-[var(--color-text-muted)] transition-all text-center"
          >
            Patient sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;