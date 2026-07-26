const variants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
};

const statusMap = {
  pending: 'warning',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'danger',
  rescheduled: 'neutral',
};

const Badge = ({ children, variant, status, className = '' }) => {
  const resolvedVariant = status ? statusMap[status] || 'neutral' : variant || 'neutral';

  return (
    <span className={`badge ${variants[resolvedVariant] || variants.neutral} ${className}`}>
      {status && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          resolvedVariant === 'success' ? 'bg-[var(--color-success)]' :
          resolvedVariant === 'warning' ? 'bg-[var(--color-warning)]' :
          resolvedVariant === 'danger' ? 'bg-[var(--color-danger)]' :
          resolvedVariant === 'primary' ? 'bg-[var(--color-primary)]' :
          'bg-[var(--color-text-muted)]'
        }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;