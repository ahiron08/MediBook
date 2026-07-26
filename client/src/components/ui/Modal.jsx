import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  message,
  onConfirm,
  confirmText = 'Confirm',
  variant = 'primary',
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  const isDanger = variant === 'danger';

  const confirmBtnClass = isDanger
    ? 'flex-1 h-12 bg-[var(--color-danger)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-danger-dark)] transition-colors'
    : 'flex-1 h-12 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizes[size] || sizes.md}
          bg-white rounded-[var(--radius-xl)]
          shadow-[var(--shadow-xl)]
          animate-scale-in
          z-10
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--color-border-light)]">
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">
          {message && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              {message}
            </p>
          )}
          {children}
        </div>

        {/* Footer - only render when onConfirm is provided */}
        {onConfirm && (
          <div className="flex gap-3 px-6 pb-6 pt-4 border-t border-[var(--color-border-light)]">
            <button
              onClick={onClose}
              className="flex-1 h-12 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={confirmBtnClass}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
