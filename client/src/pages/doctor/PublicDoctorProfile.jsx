import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MapPin, Phone, Clock, DollarSign, ExternalLink, Star, CalendarCheck, MessageCircle } from 'lucide-react';

const PublicDoctorProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['publicDoctorProfile'],
    queryFn: () => API.get('/doctor-profile/profile').then(res => res.data),
  });

  const profile = data?.data || {};

  if (isLoading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={profile.profilePhoto || '/default-avatar.png'}
              alt={profile.doctorName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{profile.doctorName}</h1>
              <p className="text-xl text-blue-100 mb-2">{profile.specialization}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                <span>{profile.experienceYears} years experience</span>
                <span>•</span>
                <span>{profile.qualifications}</span>
              </div>
            </div>
            <div className="flex gap-3">
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

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* About Section */}
        {profile.about && (
          <section>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">About</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{profile.about}</p>
          </section>
        )}

        {/* Clinic Info */}
        <section>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Clinic Information</h2>
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{profile.clinicName}</h3>
                <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <p className="flex items-start gap-2">
                    <MapPin size={18} className="mt-0.5 shrink-0" />
                    {profile.clinicAddress}, {profile.landmark}, {profile.city}, {profile.state} - {profile.pincode}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={18} />
                    {profile.contactNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={18} />
                    {profile.clinicTiming}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign size={18} />
                    ₹{profile.consultationFeeMin} - ₹{profile.consultationFeeMax}
                  </p>
                </div>
              </div>
              <div>
                {profile.googleMapsLink && (
                  <a href={profile.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                    <ExternalLink size={18} />
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {profile.services?.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.services.map(service => (
                <div key={service._id} className="card">
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
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Patient Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Book Appointment CTA */}
        <section className="text-center py-8">
          <a href="/patient/book" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            <CalendarCheck size={24} />
            Book an Appointment
          </a>
        </section>
      </div>
    </div>
  );
};

export default PublicDoctorProfile;
</parameter>
<task_progress>
- [x] Backend: Model, Controller, Routes, server.js mount
- [x] Frontend: API service
- [x] Frontend: Doctor profile settings page
- [x] Frontend: Services management page
- [x] Frontend: Testimonials management page
- [x] Frontend: Public doctor profile page
- [ ] Frontend: Patient dashboard updates
- [ ] Frontend: Homepage
- [ ] Frontend: SEO
- [ ] Update doctor routes/layout
- [ ] Commit and push
</parameter>
</write_to_file>