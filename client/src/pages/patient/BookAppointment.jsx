import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarCheck, Clock, CheckCircle2, User, Hash, Phone, Mail } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const BookAppointment = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const { data: slotsData, isLoading: slotsLoading, refetch } = useQuery({
    queryKey: ['slots', dateStr],
    queryFn: () => API.get(`/appointments/slots?date=${dateStr}`),
    enabled: !!dateStr,
  });

  const slots = slotsData?.data?.slots || [];

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (day) => {
    if (isBefore(day, new Date()) && !isToday(day)) return;
    setSelectedDate(day);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) return;
    if (!patientDetails.age || !patientDetails.gender) {
      toast.error('Please fill in patient age and gender');
      return;
    }
    setBooking(true);
    try {
      await API.post('/appointments', {
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        reason,
        patientName: patientDetails.name,
        patientEmail: patientDetails.email,
        patientPhone: patientDetails.phone,
        patientAge: parseInt(patientDetails.age),
        patientGender: patientDetails.gender,
      });
      toast.success('Appointment booked successfully!');
      setStep(1);
      setSelectedDate(null);
      setSelectedSlot(null);
      setReason('');
      setPatientDetails({
        name: user?.name || '',
        age: '',
        gender: '',
        phone: user?.phone || '',
        email: user?.email || '',
      });
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Book an Appointment</h1>
        <p className="text-[var(--color-text-muted)]">Choose your preferred date and time slot</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2">
        {['Select Date', 'Choose Time', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
              step >= i + 1 ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium whitespace-nowrap ${step >= i + 1 ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
              {label}
            </span>
            {i < 2 && <div className="w-6 sm:w-10 h-0.5 bg-[var(--color-border)] shrink-0" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-light)]">
            <button
              onClick={handlePrevMonth}
              className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--color-border-light)]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-[var(--color-text-muted)] py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const disabled = isBefore(day, new Date()) && !isToday(day);
              const notInMonth = !isSameMonth(day, currentMonth);

              return (
                <button
                  key={i}
                  onClick={() => !disabled && !notInMonth && handleDateSelect(day)}
                  disabled={disabled || notInMonth}
                  className={`
                    text-center py-2 sm:py-3 text-sm rounded-[var(--radius-sm)] transition-all duration-200
                    ${isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : disabled || notInMonth
                        ? 'text-[var(--color-text-muted)] cursor-not-allowed'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]'
                    }
                    ${isToday(day) && !isSelected ? 'ring-1 ring-[var(--color-primary)]' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots / Confirmation / Initial State */}
        <div className="flex flex-col">
          {step === 2 && (
            <div className="card animate-fade-in">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : ''}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-5">Available time slots</p>

              {slotsLoading ? (
                <div className="py-12">
                  <LoadingSpinner size="sm" text="Loading slots..." />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[var(--color-text-muted)]">No available slots for this date.</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Please select another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => slot.available && handleSlotSelect(slot)}
                      disabled={!slot.available}
                      className={`
                        p-3 rounded-[var(--radius-md)] border text-sm font-medium transition-all duration-200
                        ${!slot.available
                          ? 'border-[var(--color-border)] bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed opacity-60'
                          : selectedSlot?.startTime === slot.startTime
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary)] shadow-sm'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)]'
                        }
                      `}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="mt-5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1 transition-colors"
              >
                <span>←</span> Back to calendar
              </button>
            </div>
          )}

          {step === 3 && selectedSlot && (
            <div className="card animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-success-50)] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-[var(--color-success)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">Confirm Booking</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                  <span className="text-sm text-[var(--color-text-muted)]">Date</span>
                  <span className="text-sm font-medium text-[var(--color-text)] text-right ml-4">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                  <span className="text-sm text-[var(--color-text-muted)]">Time</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
                  <span className="text-sm text-[var(--color-text-muted)]">Duration</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {selectedSlot.startTime && selectedSlot.endTime
                      ? `${parseInt(selectedSlot.endTime.split(':')[0]) * 60 + parseInt(selectedSlot.endTime.split(':')[1]) - (parseInt(selectedSlot.startTime.split(':')[0]) * 60 + parseInt(selectedSlot.startTime.split(':')[1]))} min`
                      : '45 min'}
                  </span>
                </div>
              </div>

              {/* Patient Details Section */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Patient Details</h4>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  The person with this account may not be the patient. Please fill in the patient's information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patient Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                      <input
                        type="text"
                        value={patientDetails.name}
                        onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                        placeholder="Patient's full name"
                        className="input-base input-with-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* Patient Age */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Age</label>
                    <div className="relative">
                      <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                      <input
                        type="number"
                        value={patientDetails.age}
                        onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                        placeholder="Patient's age"
                        className="input-base input-with-icon"
                        min="0"
                        max="150"
                        required
                      />
                    </div>
                  </div>

                  {/* Patient Gender */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Gender</label>
                    <select
                      value={patientDetails.gender}
                      onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                      className="select-base"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Patient Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                      <input
                        type="tel"
                        value={patientDetails.phone}
                        onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                        placeholder="+1-555-0100"
                        className="input-base input-with-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* Patient Email (full width) */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                      <input
                        type="email"
                        value={patientDetails.email}
                        onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                        placeholder="patient@example.com"
                        className="input-base input-with-icon"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Reason for Visit <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms..."
                  rows={3}
                  className="textarea-base"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 h-12 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="flex-1 h-12 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-bg-alt)] flex items-center justify-center mx-auto mb-4">
                  <CalendarCheck size={28} className="text-[var(--color-text-muted)]" />
                </div>
                <p className="font-medium text-[var(--color-text)] mb-1">Select a date to begin</p>
                <p className="text-sm text-[var(--color-text-muted)]">Choose your preferred date from the calendar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
