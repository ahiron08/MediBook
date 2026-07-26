import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2 className={`${sizes[size] || sizes.md} text-[var(--color-primary)] animate-spin mb-3`} />
      <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
};

export default LoadingSpinner;