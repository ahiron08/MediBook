import { useDoctor } from '../../context/DoctorContext';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';

const FloatingContactButtons = () => {
  const { profile, isLoading } = useDoctor();

  if (isLoading || !profile) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={`tel:${profile.contactNumber}`}
        className="w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-primary-dark)] transition-all hover:scale-110"
        title="Call Now"
      >
        <Phone size={24} />
      </a>
      <a
        href={`https://wa.me/${profile.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
        title="WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href="/patient/book"
        className="w-14 h-14 bg-[var(--color-success)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
        title="Book Appointment"
      >
        <CalendarCheck size={24} />
      </a>
    </div>
  );
};

export default FloatingContactButtons;