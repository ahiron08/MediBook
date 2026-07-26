import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { format } from 'date-fns';
import { CalendarDays, Clock, X, Eye, User } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const UpcomingAppointments = () => {
  const [cancelId, setCancelId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: () => API.get('/appointments/my/upcoming'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => API.patch(`/appointments/${id}/cancel`),
    onSuccess: () => { queryClient.invalidateQueries(['upcomingAppointments']); toast.success('Appointment cancelled'); setCancelId(null); },
    onError: (error) => { toast.error(error.response?.data?.message || 'Failed to cancel'); },
  });

  const appointments = data?.data?.appointments || [];
  const viewAppointment = appointments.find((a) => a._id === viewId);

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    rescheduled: 'primary',
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Upcoming Appointments</h1>
        <p className="text-[var(--color-text-muted)]">Your scheduled appointments with the doctor</p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CalendarDays}
            title="No Upcoming Appointments"
            description="You don't have any upcoming appointments scheduled. Book one now to get started."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div key={app._id} className="card hover:translate-y-[-1px]">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="hidden sm:flex w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] items-center justify-center shrink-0">
                  <CalendarDays size={24} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)] text-base">
                        {format(new Date(app.date), 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-sm text-[var(--color-text-secondary)]">
                        <Clock size={16} className="text-[var(--color-text-muted)]" />
                        <span>{app.startTime} - {app.endTime}</span>
                      </div>
                    </div>
                    <Badge status={app.status} />
                  </div>
                  {app.reason && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2.5 italic">
                      "{app.reason}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border-light)]">
                <button
                  onClick={() => setViewId(app._id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius-md)] transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => setCancelId(app._id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-50)] rounded-[var(--radius-md)] transition-colors ml-auto"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => cancelMutation.mutate(cancelId)}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel"
        variant="danger"
      />

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
        title="Appointment Details"
        size="md"
      >
        {viewAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-light)]">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
                <User size={22} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">Appointment Details</h3>
                <p className="text-sm text-[var(--color-text-muted)]">View your appointment information</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                <span className="text-sm text-[var(--color-text-muted)]">Date</span>
                <span className="text-sm font-medium text-[var(--color-text)] text-right ml-4">
                  {format(new Date(viewAppointment.date), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                <span className="text-sm text-[var(--color-text-muted)]">Time</span>
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {viewAppointment.startTime} - {viewAppointment.endTime}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                <span className="text-sm text-[var(--color-text-muted)]">Status</span>
                <Badge status={viewAppointment.status} />
              </div>
              {viewAppointment.reason && (
                <div className="py-3">
                  <span className="text-sm text-[var(--color-text-muted)] block mb-1">Reason</span>
                  <p className="text-sm font-medium text-[var(--color-text)]">{viewAppointment.reason}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setViewId(null)}
              className="w-full h-12 mt-2 bg-[var(--color-bg-alt)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UpcomingAppointments;