import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config/api';
import toast from 'react-hot-toast';
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  Star,
  Award,
  BookOpen,
  Briefcase,
  Heart,
  Stethoscope,
  Users,
  CheckCircle,
  Navigation,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  HelpCircle,
  Mail,
  Share2,
  Shield,
  Video,
  AlertCircle,
} from 'lucide-react';

const DoctorPublicProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/doctor-profile/public');
      setProfile(data.profile);
    } catch (error) {
      toast.error('Failed to load doctor profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const { data } = await API.get('/doctor-profile/slots', {
        params: { date },
      });
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }

    if (!user) {
      toast.error('Please login to book an appointment');
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await API.post('/appointments', {
        date: selectedDate,
        startTime: selectedSlot.startTime,
        reason: '',
        patientAge: 0, // Will be filled in next step
        patientGender: 'other',
      });

      toast.success('Appointment booked successfully!');
      // Redirect to appointment details or confirmation
      window.location.href = `/patient/appointments`;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Doctor profile not found</p>
        </div>
      </div>
    );
  }

  const doctor = profile.doctor || {};
  const fees = profile.fees || [];
  const getFee = (type) => fees.find((f) => f.type === type && f.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Doctor Photo */}
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mx-auto md:mx-0">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary-50)]">
                      <Stethoscope size={48} className="text-[var(--color-primary)]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Dr. {doctor.name}
                  </h1>
                  {profile.isAvailable && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mx-auto md:mx-0">
                      <CheckCircle size={16} />
                      Available Today
                    </span>
                  )}
                </div>

                <p className="text-xl text-[var(--color-primary)] font-semibold mb-2">
                  {profile.specialization}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {profile.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={16} />
                    {profile.qualifications?.map((q) => q.degree).join(', ') || 'MBBS, DGO'}
                  </span>
                </div>

                {/* Rating */}
                {profile.totalReviews > 0 && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(profile.averageRating)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {profile.averageRating}
                    </span>
                    <span className="text-gray-500">
                      ({profile.totalReviews} reviews)
                    </span>
                  </div>
                )}

                {/* Clinic Info */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{profile.clinic?.name}</span>
                </div>

                {/* Consultation Fee */}
                {profile.consultationFeeRange?.min > 0 && (
                  <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold mb-4">
                    Consultation: ₹{profile.consultationFeeRange.min} – ₹{profile.consultationFeeRange.max}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Link
                    to="/patient/book"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-all shadow-md hover:shadow-lg"
                  >
                    <Calendar size={20} />
                    Book Appointment
                  </Link>

                  {profile.clinic?.phone && (
                    <a
                      href={`tel:${profile.clinic.phone}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Phone size={20} />
                      Call Clinic
                    </a>
                  )}

                  {profile.clinic?.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.clinic.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </a>
                  )}

                  {profile.googleMap?.url && (
                    <a
                      href={profile.googleMap.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Navigation size={20} />
                      Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between mb-4"
              >
                <h2 className="text-2xl font-bold text-gray-900">About Dr. {doctor.name}</h2>
                {activeSection === 'about' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {activeSection === 'about' && (
                <div className="space-y-4 animate-fade-in">
                  {profile.about && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {profile.about}
                      </p>
                    </div>
                  )}

                  {profile.education && profile.education.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen size={20} />
                        Education
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {profile.education.map((edu, idx) => (
                          <li key={idx}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {profile.specialInterests && profile.specialInterests.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Heart size={20} />
                        Special Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialInterests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    {profile.languages && profile.languages.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Languages</h3>
                        <p className="text-gray-700">{profile.languages.join(', ')}</p>
                      </div>
                    )}
                    {profile.registrationNumber && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Registration Number</h3>
                        <p className="text-gray-700">{profile.registrationNumber}</p>
                      </div>
                    )}
                    {profile.medicalCouncil && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Medical Council</h3>
                        <p className="text-gray-700">{profile.medicalCouncil}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Gender</h3>
                      <p className="text-gray-700 capitalize">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Qualifications Section */}
            {profile.qualifications && profile.qualifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.qualifications.map((qual, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Award size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{qual.degree}</h3>
                          {qual.institution && (
                            <p className="text-sm text-gray-600">{qual.institution}</p>
                          )}
                          {qual.year && (
                            <p className="text-sm text-gray-500">{qual.year}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {profile.experienceDetails && profile.experienceDetails.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                <div className="space-y-4">
                  {profile.experienceDetails.map((exp, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.hospital}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} – {exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                {profile.achievements && profile.achievements.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Achievements</h3>
                    <ul className="space-y-2">
                      {profile.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.awards && profile.awards.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Awards</h3>
                    <ul className="space-y-2">
                      {profile.awards.map((award, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <Award size={18} className="text-yellow-600 mt-0.5 shrink-0" />
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Services Section */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.services
                    .sort((a, b) => a.order - b.order)
                    .map((service, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-1">
                            <CheckCircle size={18} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            {service.fee && (
                              <p className="text-sm font-medium text-[var(--color-primary)]">
                                {service.fee}
                              </p>
                            )}
                            {service.duration && (
                              <p className="text-xs text-gray-500 mt-1">
                                Duration: {service.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Fees Section */}
            {fees.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation Fees</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fees.map((fee, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {fee.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h3>
                          <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">
                            ₹{fee.amount}
                          </p>
                        </div>
                        {fee.isActive && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Timings Section */}
            {profile.timings && profile.timings.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={24} />
                  Clinic Timings
                </h2>
                <div className="space-y-3">
                  {profile.timings.map((timing, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        timing.isWorking ? 'bg-gray-50' : 'bg-red-50'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{timing.day}</span>
                      {timing.isWorking ? (
                        <div className="text-right">
                          {timing.slots.map((slot, slotIdx) => (
                            <div key={slotIdx} className="text-sm text-gray-700">
                              {slot.start} – {slot.end}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-red-600 font-medium">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {profile.clinicImages && profile.clinicImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon size={24} />
                  Clinic Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.clinicImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-lg overflow-hidden bg-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={img}
                        alt={`Clinic ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials Section */}
            {profile.testimonials && profile.testimonials.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
                <div className="space-y-4">
                  {profile.testimonials.map((testimonial, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          {testimonial.patientPhoto ? (
                            <img
                              src={testimonial.patientPhoto}
                              alt={testimonial.patientName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Users size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {testimonial.patientName}
                            </h4>
                            {testimonial.isVerified && (
                              <Shield size={16} className="text-blue-600" title="Verified Patient" />
                            )}
                            <div className="flex items-center gap-0.5">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-1">{testimonial.review}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(testimonial.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {profile.faqs && profile.faqs.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle size={24} />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {profile.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Clinic Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Clinic Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{profile.clinic?.name}</p>
                  <p className="text-gray-700">{profile.clinic?.address}</p>
                  {profile.clinic?.landmark && (
                    <p className="text-gray-600">Near {profile.clinic.landmark}</p>
                  )}
                  <p className="text-gray-700">
                    {profile.clinic?.city}, {profile.clinic?.state} - {profile.clinic?.pincode}
                  </p>
                </div>

                {profile.clinic?.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} />
                    <a href={`tel:${profile.clinic.phone}`} className="hover:text-[var(--color-primary)]">
                      {profile.clinic.phone}
                    </a>
                  </div>
                )}

                {profile.clinic?.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} />
                    <a href={`mailto:${profile.clinic.email}`} className="hover:text-[var(--color-primary)]">
                      {profile.clinic.email}
                    </a>
                  </div>
                )}

                {profile.clinic?.timing && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <Clock size={16} className="mt-0.5" />
                    <span>{profile.clinic.timing}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Appointment Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Appointment</h3>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Slots
                  </label>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(slot)}
                          disabled={!slot.available}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-[var(--color-primary)] text-white'
                              : slot.available
                              ? 'bg-white border border-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No slots available for this date
                    </p>
                  )}
                </div>
              )}

              {/* Appointment Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2 border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white rounded-lg font-medium">
                    <Video size={16} className="inline mr-1" />
                    Online
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                    <Stethoscope size={16} className="inline mr-1" />
                    Offline
                  </button>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedSlot || bookingLoading}
                className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {bookingLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>

            {/* Google Maps */}
            {profile.googleMap?.embedUrl && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                  <iframe
                    src={profile.googleMap.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                {profile.googleMap.url && (
                  <a
                    href={profile.googleMap.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[var(--color-primary)] hover:underline text-sm"
                  >
                    <ExternalLink size={16} />
                    Open in Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {profile.clinic?.phone && (
                  <a
                    href={`tel:${profile.clinic.phone}`}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">Call Now</span>
                  </a>
                )}

                {profile.clinic?.whatsapp && (
                  <a
                    href={`https://wa.me/${profile.clinic.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle size={20} className="text-green-600" />
                    <span className="font-medium text-gray-900">WhatsApp</span>
                  </a>
                )}

                {profile.clinic?.email && (
                  <a
                    href={`mailto:${profile.clinic.email}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Mail size={20} className="text-blue-600" />
                    <span className="font-medium text-gray-900">Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPublicProfile;