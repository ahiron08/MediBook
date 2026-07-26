import { Link, Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="glass sticky top-0 z-40" style={{ height: 'var(--header-height)' }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Stethoscope size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">MediBook</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
