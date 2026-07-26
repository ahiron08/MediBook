import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, User, X } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const startDate = view === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = view === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ['doctorCalendar', startDate.toISOString(), endDate.toISOString()],
    queryFn: () => API.get(`/doctor/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  });

  const appointments = data?.data?.appointments || [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getAppointmentsForDay = (day) => {
    return appointments.filter((app) => isSameDay(new Date(app.date), day));
  };

  const statusColors = {
    confirmed: 'primary',
    pending: 'warning',
    rescheduled: 'neutral',
    completed: 'success',
  };

  const navigate = (direction) => {
    if (view === 'month') {
      setCurrentDate(direction > 0 ? addMonths(currentDate, direction) : subMonths(currentDate, Math.abs(direction)));
    } else {
      setCurrentDate(direction > 0 ? addWeeks(currentDate, direction) : subWeeks(currentDate, Math.abs(direction)));
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Calendar</h1>
          <p className="text-[var(--color-text-muted)]">View and manage appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('month')}
            className={`
              h-10 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
              ${view === 'month'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
              }
            `}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`
              h-10 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
              ${view === 'week'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
              }
            `}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="card p-0 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-light)]">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {view === 'month' ? format(currentDate, 'MMMM yyyy') : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner text="Loading calendar..." />
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border-light)]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-[var(--color-text-muted)] py-3">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dayApps = getAppointmentsForDay(day);
                const notInMonth = view === 'month' && !isSameMonth(day, currentDate);

                return (
                  <div
                    key={i}
                    className={`
                      min-h-[80px] sm:min-h-[100px] border-b border-r border-[var(--color-border-light)] p-1.5
                      ${notInMonth ? 'bg-[var(--color-bg-alt)]' : 'bg-white'}
                    `}
                  >
                    <span className={`
                      text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full
                      ${isToday(day)
                        ? 'bg-[var(--color-primary)] text-white'
                        : notInMonth
                          ? 'text-[var(--color-text-muted)]'
                          : 'text-[var(--color-text-secondary)]'
                      }
                    `}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayApps.slice(0, 2).map((app) => (
                        <button
                          key={app._id}
                          onClick={() => setSelectedAppointment(app)}
                          className="w-full text-left px-1.5 py-1 rounded-[var(--radius-sm)] text-[10px] sm:text-xs border truncate block hover:shadow-sm transition-shadow"
                          style={{
                            backgroundColor: app.status === 'confirmed' ? 'var(--color-primary-50)' :
                              app.status === 'pending' ? 'var(--color-warning-50)' :
                                app.status === 'completed' ? 'var(--color-success-50)' : 'var(--color-bg-alt)',
                            borderColor: app.status === 'confirmed' ? 'var(--color-primary-200)' :
                              app.status === 'pending' ? 'var(--color-warning-200)' :
                                app.status === 'completed' ? 'var(--color-success-200)' : 'var(--color-border)',
                            color: app.status === 'confirmed' ? 'var(--color-primary-dark)' :
                              app.status === 'pending' ? 'var(--color-warning)' :
                                app.status === 'completed' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          }}
                        >
                          <span className="hidden sm:inline">{app.startTime} </span>
                          {app.patientName?.split(' ')[0]}
                        </button>
                      ))}
                      {dayApps.length > 2 && (
                        <p className="text-[10px] text-[var(--color-primary)] font-medium px-1">
                          +{dayApps.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-light)]">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
                <User size={22} className="text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--color-text)] truncate">
                  {selectedAppointment.patientName}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] truncate">
                  {selectedAppointment.patientEmail}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <CalendarDays size={18} className="text-[var(--color-text-muted)] shrink-0" />
                <span>{format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Clock size={18} className="text-[var(--color-text-muted)] shrink-0" />
                <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
              </div>
              {selectedAppointment.reason && (
                <div className="p-3 bg-[var(--color-bg-alt)] rounded-[var(--radius-md)]">
                  <p className="text-xs text-[var(--color-text-muted)] mb-0.5">Reason</p>
                  <p className="text-sm text-[var(--color-text)]">{selectedAppointment.reason}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <Badge status={selectedAppointment.status} />
                <span className="text-xs text-[var(--color-text-muted)]">
                  #{selectedAppointment._id.slice(-6)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
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

export default CalendarView;