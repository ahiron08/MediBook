import { Link } from 'react-router-dom';
import { useDoctor } from '../context/DoctorContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  Stethoscope, CalendarCheck, Phone, MessageCircle, MapPin, 
  Clock, DollarSign, ExternalLink, Star, GraduationCap, Award 
} from 'lucide-react';

const HomePage = () => {
  const { profile, isLoading } = useDoctor();

  if (isLoading) return <LoadingSpinner text="Loading..." />;

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img
              src={profile.profilePhoto || '/default-avatar.png'}
              alt={profile.doctorName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{profile.doctorName}</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-3">{profile.specialization}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-sm text-blue-100 mb-6">
                <span className="flex items-center gap-1">
                  <Award size={16} />
                  {profile.experienceYears} years experience
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{profile.qualifications}</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/doctor-profile" className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-white/30 shadow-lg backdrop-blur-sm border border-white/30">
                  <Stethoscope size={20} />
                  View Full Profile
                </Link>
                <Link to="/patient/book" className="bg-white text-[var(--color-primary)] px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 shadow-lg">
                  <CalendarCheck size={20} />
                  Book Appointment
                </Link>
                <a href={`tel:${profile.contactNumber}`} className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-green-600 shadow-lg">
                  <Phone size={20} />
                  Call Now
                </a>
                <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#20bd5a] shadow-lg">
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12 lg:space-y-16">
        {/* About Section */}
        {profile.about && (
          <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-4 md:mb-6 text-center">About</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-base md:text-lg whitespace-pre-line text-center">{profile.about}</p>
            </div>
          </section>
        )}

        {/* Education & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {profile.education?.length > 0 && (
            <section className="card">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <GraduationCap size={28} className="text-[var(--color-primary)]" />
                Education
              </h2>
              <div className="space-y-3">
                {profile.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award size={20} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <p className="text-[var(--color-text-secondary)]">{edu}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.languagesSpoken?.length > 0 && (
            <section className="card">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <Star size={28} className="text-[var(--color-primary)]" />
                Languages
              </h2>
              <p className="text-[var(--color-text-secondary)]">{profile.languagesSpoken.join(', ')}</p>
            </section>
          )}
        </div>

        {/* Clinic Info */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-8 text-center">Clinic Information</h2>
          <div className="card max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--color-text)] text-xl mb-3">{profile.clinicName}</h3>
                <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <p className="flex items-start gap-2">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                    {profile.clinicAddress}, {profile.landmark}, {profile.city}, {profile.state} - {profile.pincode}
                  </p>
                  {profile.workingDays && (
                    <p className="flex items-center gap-2">
                      <Clock size={18} />
                      {profile.workingDays}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Clock size={18} />
                    {profile.clinicTiming}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign size={18} />
                    ₹{profile.consultationFeeMin} - ₹{profile.consultationFeeMax}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={18} />
                    {profile.contactNumber}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {profile.googleMapsLink && (
                  <a href={profile.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                    <ExternalLink size={18} />
                    View on Google Maps
                  </a>
                )}
                <Link to="/patient/book" className="btn-success inline-flex items-center gap-2 justify-center">
                  <CalendarCheck size={18} />
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {profile.services?.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-8 text-center">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.services.map(service => (
                <div key={service._id} className="card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{service.name}</h3>
                  {service.description && <p className="text-sm text-[var(--color-text-secondary)] mb-2">{service.description}</p>}
                  {service.fee && <p className="text-sm font-medium text-[var(--color-primary)]">₹{service.fee}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {profile.testimonials?.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-8 text-center">Patient Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.testimonials.map(testimonial => (
                <div key={testimonial._id} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[var(--color-text)]">{testimonial.patientName}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < testimonial.rating ? 'text-[var(--color-warning)] fill-current' : 'text-[var(--color-text-muted)]'} />
                      ))}
                    </div>
                  </div>
                  {testimonial.review && <p className="text-sm text-[var(--color-text-secondary)] italic">"{testimonial.review}"</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center py-8 lg:py-12">
          <div className="card max-w-2xl mx-auto bg-gradient-to-br from-[var(--color-primary-50)] to-white">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">Ready to Book an Appointment?</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">Schedule your visit today and experience quality healthcare</p>
            <Link to="/patient/book" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              <CalendarCheck size={24} />
              Book Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;