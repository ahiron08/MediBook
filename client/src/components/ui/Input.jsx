import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            input-base
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error ? 'input-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;