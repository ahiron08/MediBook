import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, Save, Star } from 'lucide-react';

const TestimonialsManagement = () => {
  const queryClient = useQueryClient();
  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', rating: 5, review: '', date: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['doctorTestimonials'],
    queryFn: () => API.get('/doctor-profile/testimonials').then(res => res.data),
  });

  useEffect(() => {
    if (data?.data) {
      setTestimonials(data.data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (testimonials) => API.put('/doctor-profile/testimonials', { testimonials }),
    onSuccess: () => {
      toast.success('Testimonials updated');
      queryClient.invalidateQueries({ queryKey: ['doctorTestimonials'] });
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ patientName: '', rating: 5, review: '', date: '' });
    },
    onError: () => toast.error('Failed to update testimonials'),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newTestimonial = {
      _id: Date.now().toString(),
      patientName: formData.patientName,
      rating: Number(formData.rating),
      review: formData.review,
      date: formData.date || new Date().toISOString(),
    };
    updateMutation.mutate([...testimonials, newTestimonial]);
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      patientName: testimonial.patientName,
      rating: testimonial.rating,
      review: testimonial.review,
      date: testimonial.date ? testimonial.date.split('T')[0] : '',
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = testimonials.map(t => t._id === editingId ? { ...t, ...formData, rating: Number(formData.rating) } : t);
    updateMutation.mutate(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this testimonial?')) {
      updateMutation.mutate(testimonials.filter(t => t._id !== id));
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading testimonials..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Testimonials</h1>
          <p className="text-[var(--color-text-muted)]">Manage patient testimonials</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Testimonial
          </button>
        )}
      </div>

      {(showAddForm || editingId) && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Patient Name</label>
              <input type="text" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Rating</label>
              <select value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="select-base">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Review</label>
              <textarea value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} className="textarea-base" rows="4" required></textarea>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Testimonial
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); setFormData({ patientName: '', rating: 5, review: '', date: '' }); }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--color-text-muted)]">No testimonials added yet.</p>
          </div>
        ) : (
          testimonials.map(testimonial => (
            <div key={testimonial._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--color-text)]">{testimonial.patientName}</h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < testimonial.rating ? 'text-[var(--color-warning)] fill-current' : 'text-[var(--color-text-muted)]'} />
                      ))}
                    </div>
                  </div>
                  {testimonial.review && <p className="text-sm text-[var(--color-text-secondary)] italic">"{testimonial.review}"</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(testimonial)} className="p-2 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors">
                    <Edit2 size={18} className="text-[var(--color-text-secondary)]" />
                  </button>
                  <button onClick={() => handleDelete(testimonial._id)} className="p-2 hover:bg-[var(--color-danger-50)] rounded-lg transition-colors">
                    <Trash2 size={18} className="text-[var(--color-danger)]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;