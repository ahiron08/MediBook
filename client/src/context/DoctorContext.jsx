import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../config/api';
import toast from 'react-hot-toast';
import doctorProfileAPI from '../services/doctorProfile';

const DoctorContext = createContext();

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState(null);

  // Fetch doctor profile
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => API.get('/doctor-profile/profile').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data?.data) {
      setProfile(data.data);
    }
  }, [data]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => doctorProfileAPI.updateProfile(profileData),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) => doctorProfileAPI.uploadProfilePhoto(formData),
    onSuccess: () => {
      toast.success('Photo uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    },
  });

  // Services mutations
  const addServiceMutation = useMutation({
    mutationFn: (service) => doctorProfileAPI.addService(service),
    onSuccess: () => {
      toast.success('Service added');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, service }) => doctorProfileAPI.updateService(id, service),
    onSuccess: () => {
      toast.success('Service updated');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id) => doctorProfileAPI.deleteService(id),
    onSuccess: () => {
      toast.success('Service deleted');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  // Testimonials mutations
  const addTestimonialMutation = useMutation({
    mutationFn: (testimonial) => doctorProfileAPI.addTestimonial(testimonial),
    onSuccess: () => {
      toast.success('Testimonial added');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, testimonial }) => doctorProfileAPI.updateTestimonial(id, testimonial),
    onSuccess: () => {
      toast.success('Testimonial updated');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id) => doctorProfileAPI.deleteTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial deleted');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });

  const value = {
    profile,
    setProfile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    uploadPhoto: uploadPhotoMutation.mutate,
    addService: addServiceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    deleteService: deleteServiceMutation.mutate,
    addTestimonial: addTestimonialMutation.mutate,
    updateTestimonial: updateTestimonialMutation.mutate,
    deleteTestimonial: deleteTestimonialMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUploadingPhoto: uploadPhotoMutation.isPending,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContext;