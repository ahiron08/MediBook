import API from '../config/api';

export const doctorProfileAPI = {
  // Public endpoints
  getProfile: () => API.get('/doctor-profile/profile'),
  getServices: () => API.get('/doctor-profile/services'),
  getTestimonials: () => API.get('/doctor-profile/testimonials'),

  // Protected endpoints (doctor only)
  updateProfile: (data) => API.put('/doctor-profile/profile', data),
  updateServices: (services) => API.put('/doctor-profile/services', { services }),
  updateTestimonials: (testimonials) => API.put('/doctor-profile/testimonials', { testimonials }),
};

export default doctorProfileAPI;