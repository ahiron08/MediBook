import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDoctor } from '../../context/DoctorContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, Save, Star, Eye, EyeOff, X } from 'lucide-react';
import doctorProfileAPI from '../../services/doctorProfile';

const TestimonialsManagement = () => {
  const queryClient = useQueryClient();
  const { profile, isLoading, addTestimonial, updateTestimonial, deleteTestimonial } = useDoctor();
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', rating: 5, review: '', visible: true });

  const testimonials = profile?.testimonials || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addTestimonial({
        patientName: formData.patientName,
        rating: Number(formData.rating),
        review: formData.review,
        visible: formData.visible,
      });
      setShowAddForm(false);
      setFormData({ patientName: '', rating: 5, review: '', visible: true });
    } catch (error) {
      console.error('Failed to add testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      patientName: testimonial.patientName,
      rating: testimonial.rating,
      review: testimonial.review,
      visible: testimonial.visible,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTestimonial(editingId, {
        patientName: formData.patientName,
        rating: Number(formData.rating),
        review: formData.review,
        visible: formData.visible,
      });
      setEditingId(null);
      setFormData({ patientName: '', rating: 5, review: '', visible: true });
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
      }
    }
  };

  const toggleVisibility = async (testimonial) => {
    try {
      await updateTestimonial(testimonial._id, {
        visible: !testimonial.visible,
      });
      toast.success(testimonial.visible ? 'Testimonial hidden' : 'Testimonial visible');
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ patientName: '', rating: 5, review: '', visible: true });
  };

  if (isLoading) return <LoadingSpinner text="Loading testimonials..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-1">Testimonials</h1>
          <p className="text-sm lg:text-base text-[var(--color-text-muted)]">Manage patient testimonials and reviews</p>
        </div>
        {!showAddForm && !editingId && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={18} />
            Add Testimonial
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            {editingId && (
              <button onClick={cancelEdit} className="p-1 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors">
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            )}
          </div>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
                className="input-base"
                required
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Rating</label>
              <select
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: e.target.value})}
                className="select-base"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Review</label>
              <textarea
                value={formData.review}
                onChange={e => setFormData({...formData, review: e.target.value})}
                className="textarea-base"
                rows="4"
                required
                placeholder="Enter patient review..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={e => setFormData({...formData, visible: e.target.checked})}
                className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="visible" className="text-sm text-[var(--color-text-secondary)]">
                Visible to public
              </label>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button type="submit" className="btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center">
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Testimonial
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary flex-1 sm:flex-none justify-center">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--color-text-muted)]">No testimonials added yet. Click "Add Testimonial" to create your first testimonial.</p>
          </div>
        ) : (
          testimonials.map(testimonial => (
            <div key={testimonial._id} className="card hover:shadow-md transition-shadow">
              {editingId === testimonial._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Patient Name</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={e => setFormData({...formData, patientName: e.target.value})}
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={e => setFormData({...formData, rating: e.target.value})}
                      className="select-base"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Review</label>
                    <textarea
                      value={formData.review}
                      onChange={e => setFormData({...formData, review: e.target.value})}
                      className="textarea-base"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`visible-${testimonial._id}`}
                      checked={formData.visible}
                      onChange={e => setFormData({...formData, visible: e.target.checked})}
                      className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor={`visible-${testimonial._id}`} className="text-sm text-[var(--color-text-secondary)]">
                      Visible to public
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <Save size={18} />
                      Update
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--color-text)]">{testimonial.patientName}</h3>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < testimonial.rating ? 'text-[var(--color-warning)] fill-current' : 'text-[var(--color-text-muted)]'} />
                        ))}
                      </div>
                      {testimonial.visible ? (
                        <Eye size={16} className="text-[var(--color-success)]" title="Visible" />
                      ) : (
                        <EyeOff size={16} className="text-[var(--color-text-muted)]" title="Hidden" />
                      )}
                    </div>
                    {testimonial.review && <p className="text-sm text-[var(--color-text-secondary)] italic">"{testimonial.review}"</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleVisibility(testimonial)}
                      className="p-2 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors"
                      title={testimonial.visible ? 'Hide' : 'Show'}
                    >
                      {testimonial.visible ? (
                        <EyeOff size={18} className="text-[var(--color-text-secondary)]" />
                      ) : (
                        <Eye size={18} className="text-[var(--color-success)]" />
                      )}
                    </button>
                    <button onClick={() => handleEdit(testimonial)} className="p-2 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors" title="Edit">
                      <Edit2 size={18} className="text-[var(--color-text-secondary)]" />
                    </button>
                    <button onClick={() => handleDelete(testimonial._id)} className="p-2 hover:bg-[var(--color-danger-50)] rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} className="text-[var(--color-danger)]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;