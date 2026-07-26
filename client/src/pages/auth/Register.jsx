import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success('Registration successful!');
      navigate('/patient/book');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
              <Stethoscope size={24} className="text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Create your account</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Join MediBook for easy appointment booking
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Full name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-base input-with-icon" />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-base input-with-icon" />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Phone number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1-555-0100" className="input-base input-with-icon" />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input-base input-with-icon" />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Confirm password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="input-base input-with-icon" />
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
                  Create account
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
              <span className="bg-white px-4 text-xs text-[var(--color-text-muted)]">Already registered?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full h-12 leading-[48px] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] hover:border-[var(--color-text-muted)] transition-all text-center"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;