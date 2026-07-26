import Modal from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  const colors = {
    danger: { bg: 'bg-[var(--color-danger-50)]', icon: 'text-[var(--color-danger)]', btn: 'bg-[var(--color-danger)] hover:bg-[#B91C1C]' },
    primary: { bg: 'bg-[var(--color-primary-50)]', icon: 'text-[var(--color-primary)]', btn: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]' },
    warning: { bg: 'bg-[var(--color-warning-50)]', icon: 'text-[var(--color-warning)]', btn: 'bg-[var(--color-warning)] hover:bg-[#D97706]' },
  };

  const c = colors[variant] || colors.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center`}>
            <AlertTriangle size={28} className={c.icon} />
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] text-center leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-12 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-12 text-white text-sm font-medium rounded-[var(--radius-md)] transition-all duration-200 shadow-sm hover:shadow-md ${c.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;