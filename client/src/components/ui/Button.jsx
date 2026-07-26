const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary: 'bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] hover:border-[var(--color-text-muted)] active:scale-[0.98]',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-[#B91C1C] shadow-sm hover:shadow-md active:scale-[0.98]',
  success: 'bg-[var(--color-success)] text-white hover:bg-[#15803D] shadow-sm hover:shadow-md active:scale-[0.98]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] active:scale-[0.98]',
};

const sizes = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-6 text-base',
  icon: 'h-10 w-10 p-0 flex items-center justify-center',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-[var(--radius-md)]
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
};

export default Button;