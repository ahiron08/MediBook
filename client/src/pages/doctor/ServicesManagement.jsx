import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDoctor } from '../../context/DoctorContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import doctorProfileAPI from '../../services/doctorProfile';

const ServicesManagement = () => {
  const queryClient = useQueryClient();
  const { profile, isLoading, addService, updateService, deleteService } = useDoctor();
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', fee: '' });

  const services = profile?.services || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addService({
        name: formData.name,
        description: formData.description,
        fee: formData.fee ? Number(formData.fee) : null,
      });
      setShowAddForm(false);
      setFormData({ name: '', description: '', fee: '' });
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormData({ name: service.name, description: service.description, fee: service.fee || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateService(editingId, {
        name: formData.name,
        description: formData.description,
        fee: formData.fee ? Number(formData.fee) : null,
      });
      setEditingId(null);
      setFormData({ name: '', description: '', fee: '' });
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', fee: '' });
  };

  if (isLoading) return <LoadingSpinner text="Loading services..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-1">Services</h1>
          <p className="text-sm lg:text-base text-[var(--color-text-muted)]">Manage your medical services</p>
        </div>
        {!showAddForm && !editingId && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={18} />
            Add Service
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>
            {editingId && (
              <button onClick={cancelEdit} className="p-1 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors">
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            )}
          </div>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Service Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="input-base"
                required
                placeholder="e.g., Antenatal Care & Delivery"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="textarea-base"
                rows="3"
                placeholder="Describe the service..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Fee (₹) - Optional</label>
              <input
                type="number"
                value={formData.fee}
                onChange={e => setFormData({...formData, fee: e.target.value})}
                className="input-base"
                min="0"
                placeholder="Leave empty if not applicable"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button type="submit" className="btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center">
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Service
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary flex-1 sm:flex-none justify-center">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--color-text-muted)]">No services added yet. Click "Add Service" to create your first service.</p>
          </div>
        ) : (
          services.map(service => (
            <div key={service._id} className="card hover:shadow-md transition-shadow">
              {editingId === service._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Service Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="textarea-base"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.fee}
                      onChange={e => setFormData({...formData, fee: e.target.value})}
                      className="input-base"
                      min="0"
                    />
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
                    <h3 className="font-semibold text-[var(--color-text)] text-lg">{service.name}</h3>
                    {service.description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{service.description}</p>}
                    {service.fee && <p className="text-sm font-medium text-[var(--color-primary)] mt-2">₹{service.fee}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleEdit(service)} className="p-2 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors" title="Edit">
                      <Edit2 size={18} className="text-[var(--color-text-secondary)]" />
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="p-2 hover:bg-[var(--color-danger-50)] rounded-lg transition-colors" title="Delete">
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

export default ServicesManagement;