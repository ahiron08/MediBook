import API from '../config/api';

export const doctorProfileAPI = {
  // Public endpoints
  getProfile: () => API.get('/doctor-profile/profile'),
  getServices: () => API.get('/doctor-profile/services'),
  getTestimonials: () => API.get('/doctor-profile/testimonials'),
  getAllTestimonials: () => API.get('/doctor-profile/testimonials/all'),

  // Protected endpoints (doctor only)
  updateProfile: (data) => API.put('/doctor-profile/profile', data),
  uploadProfilePhoto: (formData) => API.post('/doctor-profile/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  addService: (service) => API.post('/doctor-profile/services', service),
  updateService: (id, service) => API.put(`/doctor-profile/services/${id}`, service),
  deleteService: (id) => API.delete(`/doctor-profile/services/${id}`),
  addTestimonial: (testimonial) => API.post('/doctor-profile/testimonials', testimonial),
  updateTestimonial: (id, testimonial) => API.put(`/doctor-profile/testimonials/${id}`, testimonial),
  deleteTestimonial: (id) => API.delete(`/doctor-profile/testimonials/${id}`),
};

export default doctorProfileAPI;