import { CalendarX } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'Nothing here yet',
  description = 'No data available at the moment.',
  action,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--color-bg-alt)] flex items-center justify-center mb-5">
        <Icon size={28} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] text-center max-w-sm mb-6">
        {description}
      </p>
      {action && actionLabel && (
        <Button variant="primary" onClick={onAction} icon={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;