import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard,
} from 'lucide-react';

const Dashboard = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [confirmAction, setConfirmAction] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['doctorDashboard'],
    queryFn: () => API.get('/doctor/dashboard'),
    refetchInterval: 30000,
  });

  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['todayAppointments', today],
    queryFn: () => API.get(`/doctor/appointments?date=${today}&limit=5`),
  });

  const completeMutation = useMutation({
    mutationFn: (id) => API.patch(`/doctor/complete/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['todayAppointments']); queryClient.invalidateQueries(['doctorDashboard']); },
    onError: (err) => {},
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => API.patch(`/doctor/cancel/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['todayAppointments']); queryClient.invalidateQueries(['doctorDashboard']); },
    onError: (err) => {},
  });

  const stats = data?.data?.stats;
  const todayAppointments = todayData?.data?.appointments || [];

  const cards = [
    { label: "Today's Appointments", value: stats?.todayAppointments || 0, icon: CalendarDays, color: 'primary' },
    { label: 'Upcoming', value: stats?.upcomingAppointments || 0, icon: Clock, color: 'warning' },
    { label: 'Completed Today', value: stats?.completedToday || 0, icon: CheckCircle2, color: 'success' },
    { label: 'Cancelled Today', value: stats?.cancelledToday || 0, icon: XCircle, color: 'danger' },
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: Users, color: 'primary' },
    { label: 'Pending', value: stats?.pendingAppointments || 0, icon: CalendarCheck, color: 'warning' },
  ];

  const quickActions = [
    { path: '/doctor/calendar', label: 'Calendar', icon: CalendarDays },
    { path: '/doctor/appointments', label: 'Appointments', icon: CalendarCheck },
    { path: '/doctor/availability', label: 'Availability', icon: Clock },
    { path: '/doctor/profile', label: 'Profile', icon: Users },
  ];

  const handleAction = (type, id) => setConfirmAction({ type, id });

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Dashboard</h1>
        <p className="text-[var(--color-text-muted)]">Overview of your clinic activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary)]',
            success: 'bg-[var(--color-success-50)] text-[var(--color-success)]',
            warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning)]',
            danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger)]',
          };

          return (
            <div
              key={card.label}
              className="card hover:translate-y-[-2px] group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-muted)] font-medium mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-text)] tracking-tight">
                    {card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 ${colorClasses[card.color]}`}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--color-border-light)] flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <TrendingUp size={14} className="text-[var(--color-success)]" />
                <span>Active metric</span>
                <ArrowUpRight size={14} className="ml-auto text-[var(--color-text-muted)]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="card hover:translate-y-[-2px] group text-center py-6"
              >
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  <Icon size={22} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Today's Appointments</h2>
          <Link
            to="/doctor/appointments"
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {todayLoading ? (
          <LoadingSpinner size="sm" text="Loading..." />
        ) : todayAppointments.length === 0 ? (
          <div className="card">
            <p className="text-[var(--color-text-muted)] text-center py-8">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th className="hidden sm:table-cell">Contact</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((app) => (
                    <tr key={app._id}>
                      <td className="font-medium text-[var(--color-text)]">
                        {app.patientName}
                      </td>
                      <td className="hidden sm:table-cell text-sm text-[var(--color-text-secondary)]">
                        {app.patientPhone}
                      </td>
                      <td className="text-sm">
                        {app.startTime} - {app.endTime}
                      </td>
                      <td>
                        <Badge status={app.status} />
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          {app.status !== 'completed' && app.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => handleAction('complete', app._id)}
                                className="p-1.5 text-[var(--color-success)] hover:bg-[var(--color-success-50)] rounded-[var(--radius-sm)] transition-colors"
                                title="Complete appointment"
                                aria-label={`Complete appointment for ${app.patientName}`}
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button
                                onClick={() => handleAction('cancel', app._id)}
                                className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-50)] rounded-[var(--radius-sm)] transition-colors"
                                title="Cancel appointment"
                                aria-label={`Cancel appointment for ${app.patientName}`}
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Actions Modal */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          const { type, id } = confirmAction;
          if (type === 'complete') completeMutation.mutate(id);
          else if (type === 'cancel') cancelMutation.mutate(id);
          setConfirmAction(null);
        }}
        title={`${confirmAction?.type?.charAt(0).toUpperCase() + confirmAction?.type?.slice(1)} Appointment?`}
        message={`Are you sure you want to ${confirmAction?.type} this appointment?`}
        confirmText={confirmAction?.type?.charAt(0).toUpperCase() + confirmAction?.type?.slice(1)}
        variant={confirmAction?.type === 'cancel' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default Dashboard;
