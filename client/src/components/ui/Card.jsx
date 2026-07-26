const Card = ({ children, className = '', hover = false, padding = 'lg', ...props }) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={`
        card
        ${paddings[padding] || paddings.lg}
        ${hover ? 'card-interactive' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-[var(--color-text)] ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-[var(--color-text-muted)] ${className}`}>
    {children}
  </p>
);

export default Card;