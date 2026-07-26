import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { History, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const AppointmentHistory = () => {
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['appointmentHistory', filter],
    queryFn: () => API.get(`/appointments/my?limit=50${filter ? `&status=${filter}` : ''}`),
  });

  const appointments = data?.data?.appointments || [];

  const statusColors = {
    completed: 'success',
    cancelled: 'danger',
    confirmed: 'primary',
    pending: 'warning',
    rescheduled: 'neutral',
  };

  const filters = ['', 'completed', 'cancelled'];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-1">Appointment History</h1>
        <p className="text-sm lg:text-base text-[var(--color-text-muted)]">View your past appointments</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter size={18} className="text-[var(--color-text-muted)] shrink-0" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              h-10 px-4 rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap transition-all duration-200
              ${filter === f
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
              }
            `}
          >
            {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading history..." />
      ) : appointments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={History}
            title="No History"
            description="No past appointments found."
          />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="hidden sm:table-cell">Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id}>
                    <td className="font-medium text-[var(--color-text)] text-sm sm:text-base">
                      {format(new Date(app.date), 'MMM d, yyyy')}
                    </td>
                    <td className="text-sm whitespace-nowrap">{app.startTime}</td>
                    <td className="hidden sm:table-cell max-w-[200px] truncate">
                      {app.reason || '-'}
                    </td>
                    <td>
                      <Badge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;