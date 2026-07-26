import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Stethoscope,
  User,
  CalendarDays,
  Clock,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

const Appointments = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (search) queryParams.set('search', search);
  if (statusFilter) queryParams.set('status', statusFilter);
  if (dateFilter) queryParams.set('date', dateFilter);
  queryParams.set('page', page);

  const { data, isLoading } = useQuery({
    queryKey: ['doctorAppointments', search, statusFilter, dateFilter, page],
    queryFn: () => API.get(`/doctor/appointments?${queryParams.toString()}`),
  });

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination;

  const completeMutation = useMutation({
    mutationFn: (id) => API.patch(`/doctor/complete/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['doctorAppointments']); toast.success('Completed'); setConfirmAction(null); },
    onError: (err) => toast.error(err.response?.data?.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => API.patch(`/doctor/cancel/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['doctorAppointments']); toast.success('Cancelled'); setConfirmAction(null); },
    onError: (err) => toast.error(err.response?.data?.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/doctor/delete/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['doctorAppointments']); toast.success('Deleted'); setConfirmAction(null); },
    onError: (err) => toast.error(err.response?.data?.message),
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }) => API.put(`/doctor/appointments/${id}`, { doctorNotes: notes }),
    onSuccess: () => { queryClient.invalidateQueries(['doctorAppointments']); toast.success('Notes updated'); setShowNotesModal(false); },
    onError: (err) => toast.error(err.response?.data?.message),
  });

  const filters = ['', 'pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'];

  const handleAction = (type, app) => setConfirmAction({ type, id: app._id });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Appointments</h1>
        <p className="text-[var(--color-text-muted)]">Manage all patient appointments</p>
      </div>

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="input-base input-with-icon"
              aria-label="Search appointments"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 lg:flex-none">
              <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select-base select-with-icon"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                {filters.filter(Boolean).map((f) => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-base input-date flex-1 lg:flex-none"
              aria-label="Filter by date"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-[var(--color-text-muted)] mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-1">No Appointments Found</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((app) => (
            <div key={app._id} className="card hover:translate-y-[-1px]">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-bg-alt)] items-center justify-center shrink-0">
                  <User size={22} className="text-[var(--color-text-muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)] text-base">
                        {app.patientName}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        {app.patientEmail} · {app.patientPhone}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-[var(--color-text-muted)]" />
                          {format(new Date(app.date), 'MMM d, yyyy')}
                        </span>
                        <span className="hidden sm:inline text-[var(--color-border)]">·</span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[var(--color-text-muted)]" />
                          {app.startTime} - {app.endTime}
                        </span>
                      </div>
                    </div>
                    <Badge status={app.status} />
                  </div>
                  {app.reason && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 italic">
                      "{app.reason}"
                    </p>
                  )}
                  {app.doctorNotes && (
                    <p className="text-sm text-[var(--color-primary)] mt-1.5 font-medium">
                      Notes: {app.doctorNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--color-border-light)]">
                <button
                  onClick={() => { setSelectedApp(app); setEditNotes(app.doctorNotes || ''); setShowNotesModal(true); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 shadow-sm"
                  aria-label={`Add notes for ${app.patientName}`}
                >
                  <Stethoscope size={14} />
                  Notes
                </button>
                {app.status !== 'completed' && app.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => handleAction('complete', app)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-success)] rounded-[var(--radius-md)] hover:bg-[var(--color-success-dark)] transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label={`Complete appointment for ${app.patientName}`}
                    >
                      <CheckCircle2 size={14} />
                      Complete
                    </button>
                    <button
                      onClick={() => handleAction('cancel', app)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-danger)] rounded-[var(--radius-md)] hover:bg-[var(--color-danger-dark)] transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label={`Cancel appointment for ${app.patientName}`}
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  </>
                )}
                {(app.status === 'completed' || app.status === 'cancelled') && (
                  <button
                    onClick={() => handleAction('delete', app)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-alt)] rounded-[var(--radius-md)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger)] transition-all duration-200"
                    aria-label={`Delete appointment for ${app.patientName}`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`
                h-10 w-10 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                ${page === p
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
                }
              `}
              aria-label={`Go to page ${p}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Confirm Actions */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          const { type, id } = confirmAction;
          if (type === 'complete') completeMutation.mutate(id);
          else if (type === 'cancel') cancelMutation.mutate(id);
          else if (type === 'delete') deleteMutation.mutate(id);
        }}
        title={`${confirmAction?.type?.charAt(0).toUpperCase() + confirmAction?.type?.slice(1)} Appointment?`}
        message={`Are you sure you want to ${confirmAction?.type} this appointment?`}
        confirmText={confirmAction?.type?.charAt(0).toUpperCase() + confirmAction?.type?.slice(1)}
        variant={confirmAction?.type === 'cancel' ? 'danger' : 'primary'}
      />

      {/* Notes Modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title="Doctor Notes"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Add private notes for {selectedApp?.patientName}'s appointment
          </p>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Enter your private notes here..."
            rows={4}
            className="textarea-base"
            aria-label="Doctor notes"
          />
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowNotesModal(false)}
              className="flex-1 h-12 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => updateNotesMutation.mutate({ id: selectedApp._id, notes: editNotes })}
              className="flex-1 h-12 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;
