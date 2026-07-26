import { useQuery } from '@tanstack/react-query';
import API from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FloatingContactButtons from '../../components/common/FloatingContactButtons';
import { 
  MapPin, Phone, Clock, DollarSign, ExternalLink, Star, CalendarCheck, 
  MessageCircle, GraduationCap, Languages, Briefcase, Award 
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

const PublicDoctorProfile = () => {
  const { profile, isLoading } = useDoctor();

  if (isLoading) return <LoadingSpinner text="Loading profile..." />;

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={profile.profilePhoto || '/default-avatar.png'}
              alt={profile.doctorName}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.doctorName}</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-2">{profile.specialization}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-sm text-blue-100">
                <span>{profile.experienceYears} years experience</span>
                <span className="hidden sm:inline">•</span>
                <span>{profile.qualifications}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto justify-center">
              <a href={`tel:${profile.contactNumber}`} className="bg-white text-[var(--color-primary)] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50">
                <Phone size={18} />
                Call
              </a>
              <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-600">
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10 lg:space-y-12">
        {/* About Section */}
        {profile.about && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">About</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{profile.about}</p>
          </section>
        )}

        {/* Education & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {profile.education?.length > 0 && (
            <section>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <GraduationCap size={28} className="text-[var(--color-primary)]" />
                Education
              </h2>
              <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-3 shadow-sm">
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
            <section>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <Languages size={28} className="text-[var(--color-primary)]" />
                Languages
              </h2>
              <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                <p className="text-[var(--color-text-secondary)]">{profile.languagesSpoken.join(', ')}</p>
              </div>
            </section>
          )}
        </div>

        {/* Clinic Info */}
        <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-6">Clinic Information</h2>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
            <div>
              <h3 className="font-semibold text-[var(--color-text)] mb-3">{profile.clinicName}</h3>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {profile.clinicAddress}, {profile.landmark}, {profile.city}, {profile.state} - {profile.pincode}
                </p>
                {profile.workingDays && (
                  <p className="flex items-center gap-2">
                    <Briefcase size={18} />
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
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-[var(--color-border-light)]">
              {profile.googleMapsLink && (
                <a 
                  href={profile.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-dark)] transition-all duration-200"
                >
                  <ExternalLink size={18} />
                  View on Google Maps
                </a>
              )}
              <a 
                href="/patient/book" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200"
              >
                <CalendarCheck size={18} />
                Book Appointment
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        {profile.services?.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-6">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.services.map(service => (
                <div key={service._id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-md transition-shadow">
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
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-6">Patient Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.testimonials.map(testimonial => (
                <div key={testimonial._id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
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

        {/* Book Appointment CTA */}
        <section className="text-center py-6 lg:py-8">
          <a href="/patient/book" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[var(--color-primary)] text-white rounded-xl font-medium text-base md:text-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 shadow-lg hover:shadow-xl">
            <CalendarCheck size={24} />
            Book an Appointment
          </a>
        </section>
      </div>

      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
    </div>
    </>
  );
};

export default PublicDoctorProfile;