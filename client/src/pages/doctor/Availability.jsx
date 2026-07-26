import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { Clock, CalendarCheck } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DURATIONS = [15, 20, 30, 45, 60];

const AvailabilityPage = () => {
  const queryClient = useQueryClient();
  const [showUnavailableInput, setShowUnavailableInput] = useState(false);
  const [newUnavailableDate, setNewUnavailableDate] = useState('');
  const [newUnavailableReason, setNewUnavailableReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => API.get('/availability'),
  });

  const availability = data?.data?.availability;
  const [form, setForm] = useState(null);

  if (availability && !form) {
    setForm({
      workingDays: [...(availability.workingDays || [])],
      workingHours: { ...(availability.workingHours || { start: '09:00', end: '18:00' }) },
      lunchBreak: { ...(availability.lunchBreak || { start: '13:00', end: '14:00' }) },
      appointmentDuration: availability.appointmentDuration || 30,
      isActive: availability.isActive !== false,
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data) => API.put('/availability', data),
    onSuccess: () => { queryClient.invalidateQueries(['availability']); toast.success('Availability updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const addUnavailableMutation = useMutation({
    mutationFn: (data) => API.post('/availability/unavailable-dates', data),
    onSuccess: () => { queryClient.invalidateQueries(['availability']); toast.success('Date(s) blocked'); setNewUnavailableDate(''); setNewUnavailableReason(''); setShowUnavailableInput(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to block date'),
  });

  const removeUnavailableMutation = useMutation({
    mutationFn: (data) => API.delete('/availability/unavailable-dates', { data }),
    onSuccess: () => { queryClient.invalidateQueries(['availability']); toast.success('Date unblocked'); },
    onError: (err) => toast.error(err.response?.data?.message),
  });

  const toggleDay = (day) => {
    if (!form) return;
    const newDays = form.workingDays.includes(day)
      ? form.workingDays.filter((d) => d !== day)
      : [...form.workingDays, day];
    setForm({ ...form, workingDays: newDays });
  };

  const handleSave = () => { if (form) updateMutation.mutate(form); };

  if (isLoading) return <LoadingSpinner text="Loading availability..." />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Availability Settings</h1>
        <p className="text-[var(--color-text-muted)]">Configure your working hours and days</p>
      </div>

      <div className="space-y-6">
        {/* Working Days */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
              <CalendarCheck size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Working Days</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Select the days you're available</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`
                  px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                  ${form?.workingDays?.includes(day)
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }
                `}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
              <Clock size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Working Hours</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Set your daily schedule</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Start Time</label>
              <input
                type="time"
                value={form?.workingHours?.start || '09:00'}
                onChange={(e) => setForm({ ...form, workingHours: { ...form.workingHours, start: e.target.value } })}
                className="input-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">End Time</label>
              <input
                type="time"
                value={form?.workingHours?.end || '18:00'}
                onChange={(e) => setForm({ ...form, workingHours: { ...form.workingHours, end: e.target.value } })}
                className="input-base"
              />
            </div>
          </div>
        </div>

        {/* Lunch Break */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
              <Clock size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Lunch Break</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Set your break time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Start</label>
              <input
                type="time"
                value={form?.lunchBreak?.start || '13:00'}
                onChange={(e) => setForm({ ...form, lunchBreak: { ...form.lunchBreak, start: e.target.value } })}
                className="input-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">End</label>
              <input
                type="time"
                value={form?.lunchBreak?.end || '14:00'}
                onChange={(e) => setForm({ ...form, lunchBreak: { ...form.lunchBreak, end: e.target.value } })}
                className="input-base"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
              <Clock size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Appointment Duration</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Select slot length</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setForm({ ...form, appointmentDuration: d })}
                className={`
                  px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                  ${form?.appointmentDuration === d
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }
                `}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Unavailable Dates */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] flex items-center justify-center">
                <CalendarCheck size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Unavailable Dates</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Block specific dates</p>
              </div>
            </div>
            <button
              onClick={() => setShowUnavailableInput(true)}
              className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-100)] transition-colors"
            >
              <FaPlus size={14} />
              Add
            </button>
          </div>

          {showUnavailableInput && (
            <div className="p-4 bg-[var(--color-bg-alt)] rounded-[var(--radius-lg)] mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newUnavailableDate}
                  onChange={(e) => setNewUnavailableDate(e.target.value)}
                  className="input-base"
                />
                <input
                  type="text"
                  value={newUnavailableReason}
                  onChange={(e) => setNewUnavailableReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="input-base"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addUnavailableMutation.mutate({ dates: [newUnavailableDate], reason: newUnavailableReason })}
                  className="flex-1 h-10 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowUnavailableInput(false)}
                  className="flex-1 h-10 border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {(!availability?.unavailableDates || availability.unavailableDates.length === 0) ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-6">No unavailable dates set</p>
          ) : (
            <div className="space-y-2">
              {availability.unavailableDates.map((ud, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-[var(--color-bg-alt)] rounded-[var(--radius-md)]">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {new Date(ud.date).toLocaleDateString()}
                    </span>
                    {ud.reason && (
                      <span className="text-sm text-[var(--color-text-muted)] ml-2">- {ud.reason}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeUnavailableMutation.mutate({ dates: [ud.date] })}
                    className="text-[var(--color-danger)] hover:text-[var(--color-danger)] p-1.5 shrink-0 hover:bg-[var(--color-danger-50)] rounded-[var(--radius-sm)] transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full h-12 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <FaSave size={16} />
          {updateMutation.isPending ? 'Saving...' : 'Save Availability Settings'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityPage;