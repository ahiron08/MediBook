import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../config/api';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Star,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  Stethoscope,
  Navigation,
  MessageCircle,
  Video,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

const DoctorPublicProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  // Update SEO when doctor data is loaded
  useEffect(() => {
    if (doctor) {
      document.title = `Dr. ${doctor.doctorName} - ${doctor.specialization}`;
    }
  }, [doctor]);

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await API.get('/doctor/profile');
      setDoctor(data.data);
    } catch (error) {
      toast.error('Failed to load doctor profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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

  const getDayName = (day) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };
    return days[day] || day;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTiming = (timing) => {
    if (!timing || timing.isClosed) return 'Closed';
    const parts = [];
    if (timing.morningStart && timing.morningEnd) {
      parts.push(`${formatTime(timing.morningStart)} – ${formatTime(timing.morningEnd)}`);
    }
    if (timing.eveningStart && timing.eveningEnd) {
      parts.push(`${formatTime(timing.eveningStart)} – ${formatTime(timing.eveningEnd)}`);
    }
    return parts.join(', ') || 'Not specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Doctor profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Component */}
      {doctor && (
        <SEO
          title={`Dr. ${doctor.doctorName} - ${doctor.specialization}`}
          description={doctor.seo?.metaDescription || doctor.about?.substring(0, 160)}
          keywords={doctor.seo?.keywords}
          image={doctor.seo?.ogImage || doctor.profilePhoto}
          url="/doctor"
          type="profile"
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Doctor Photo */}
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {doctor.profilePhoto ? (
                      <img
                        src={doctor.profilePhoto}
                        alt={doctor.doctorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <UserRound size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Dr. {doctor.doctorName}
                    </h1>
                    {doctor.isAvailable && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mx-auto md:mx-0">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Available Today
                      </span>
                    )}
                  </div>

                  <p className="text-xl text-primary-600 font-semibold mb-2">
                    {doctor.specialization}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap size={16} />
                      <span>{doctor.qualifications?.join(', ') || 'MBBS'}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {doctor.totalReviews > 0 && (
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <div className="flex items-center gap-1">{renderStars(doctor.averageRating)}</div>
                      <span className="font-semibold text-gray-900">{doctor.averageRating}</span>
                      <span className="text-gray-500">({doctor.totalReviews} reviews)</span>
                    </div>
                  )}

                  {/* Clinic Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{doctor.clinic?.name}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>{doctor.clinic?.phone}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                    <Link
                      to="/patient/book-appointment"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Calendar size={18} />
                      Book Appointment
                    </Link>
                    <a
                      href={`tel:${doctor.clinic?.phone}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-200 hover:border-primary-600 hover:text-primary-600 transition-colors"
                    >
                      <Phone size={18} />
                      Call Clinic
                    </a>
                    {doctor.clinic?.whatsapp && (
                      <a
                        href={`https://wa.me/${doctor.clinic.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                      >
                        <MessageCircle size={18} />
                        WhatsApp
                      </a>
                    )}
                    {doctor.googleMapLink && (
                      <a
                        href={doctor.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                      >
                        <Navigation size={18} />
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'about', label: 'About', icon: UserRound },
                  { id: 'services', label: 'Services', icon: Stethoscope },
                  { id: 'fees', label: 'Fees', icon: CheckCircle },
                  { id: 'timings', label: 'Timings', icon: Clock },
                  { id: 'gallery', label: 'Gallery', icon: Award },
                  { id: 'testimonials', label: 'Reviews', icon: Star },
                  { id: 'faq', label: 'FAQ', icon: MessageCircle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-sm p-6 md:p-10">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. {doctor.doctorName}</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{doctor.about}</p>
                  </div>

                  {/* Qualifications */}
                  {doctor.qualifications && doctor.qualifications.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap size={24} />
                        Qualifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {doctor.qualifications.map((qual, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg"
                          >
                            <CheckCircle size={20} className="text-primary-600 shrink-0" />
                            <span className="text-gray-800 font-medium">{qual}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Interests */}
                  {doctor.specialInterests && doctor.specialInterests.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Heart size={24} />
                        Special Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialInterests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {doctor.languages && doctor.languages.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Languages Spoken</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h2>
                  {doctor.services && doctor.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctor.services
                        .sort((a, b) => a.order - b.order)
                        .map((service, index) => (
                          <div
                            key={index}
                            className="p-6 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                                <Stethoscope size={24} className="text-primary-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                                {service.description && (
                                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  {service.fee > 0 && (
                                    <span className="font-semibold text-primary-600">
                                      ₹{service.fee}
                                    </span>
                                  )}
                                  {service.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock size={14} />
                                      {service.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No services listed yet</p>
                  )}
                </div>
              )}

              {/* Fees Tab */}
              {activeTab === 'fees' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Fees</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.fees?.newConsultation > 0 && (
                      <div className="p-6 bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">New Consultation</h3>
                        <p className="text-3xl font-bold text-primary-600">₹{doctor.fees.newConsultation}</p>
                      </div>
                    )}
                    {doctor.fees?.followUpConsultation > 0 && (
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Follow-up Consultation</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          ₹{doctor.fees.followUpConsultation}
                        </p>
                      </div>
                    )}
                    {doctor.fees?.videoConsultation > 0 && (
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Video size={20} />
                          Video Consultation
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">
                          ₹{doctor.fees.videoConsultation}
                        </p>
                      </div>
                    )}
                    {doctor.fees?.emergencyConsultation > 0 && (
                      <div className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Emergency Consultation</h3>
                        <p className="text-3xl font-bold text-red-600">
                          ₹{doctor.fees.emergencyConsultation}
                        </p>
                      </div>
                    )}
                  </div>
                  {(!doctor.fees ||
                    (doctor.fees.newConsultation === 0 &&
                      doctor.fees.followUpConsultation === 0 &&
                      doctor.fees.videoConsultation === 0 &&
                      doctor.fees.emergencyConsultation === 0)) && (
                    <p className="text-gray-500 text-center py-8">Fees not specified yet</p>
                  )}
                </div>
              )}

              {/* Timings Tab */}
              {activeTab === 'timings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Timings</h2>
                  {doctor.timings && doctor.timings.length > 0 ? (
                    <div className="space-y-3">
                      {doctor.timings
                        .sort((a, b) => {
                          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                          return days.indexOf(a.day) - days.indexOf(b.day);
                        })
                        .map((timing, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              timing.isClosed ? 'bg-gray-100' : 'bg-gray-50'
                            }`}
                          >
                            <span className="font-medium text-gray-900 min-w-[140px]">
                              {getDayName(timing.day)}
                            </span>
                            <span className={`text-gray-600 ${timing.isClosed ? 'text-red-600 font-medium' : ''}`}>
                              {timing.isClosed ? 'Closed' : formatTiming(timing)}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Timings not specified yet</p>
                  )}
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Gallery</h2>
                  {doctor.clinicImages && doctor.clinicImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {doctor.clinicImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                        >
                          <img
                            src={image.url}
                            alt={image.caption || `Clinic image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white text-sm">{image.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No gallery images yet</p>
                  )}
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Patient Reviews ({doctor.totalReviews || 0})
                  </h2>
                  {doctor.testimonials && doctor.testimonials.length > 0 ? (
                    <div className="space-y-6">
                      {doctor.testimonials
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((testimonial, index) => (
                          <div key={index} className="p-6 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                {testimonial.patientPhoto ? (
                                  <img
                                    src={testimonial.patientPhoto}
                                    alt={testimonial.patientName}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <UserRound size={24} className="text-primary-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {testimonial.isAnonymous ? 'Anonymous Patient' : testimonial.patientName}
                                  </h4>
                                  {testimonial.isVerified && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {renderStars(testimonial.rating)}
                                </div>
                                <p className="text-gray-700 mb-2">{testimonial.review}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(testimonial.date).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                  )}
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  {doctor.faqs && doctor.faqs.length > 0 ? (
                    <div className="space-y-3">
                      {doctor.faqs
                        .sort((a, b) => a.order - b.order)
                        .map((faq, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleFaq(index)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {expandedFaqs[index] ? (
                                <ChevronUp size={20} className="text-gray-400 shrink-0" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-400 shrink-0" />
                              )}
                            </button>
                            {expandedFaqs[index] && (
                              <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No FAQs available yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link
          to="/patient/book-appointment"
          className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white font-medium rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <Calendar size={20} />
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default DoctorPublicProfile;