import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../config/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';

const ServicesManagement = () => {
  const queryClient = useQueryClient();
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', fee: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['doctorServices'],
    queryFn: () => API.get('/doctor-profile/services').then(res => res.data),
  });

  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (services) => API.put('/doctor-profile/services', { services }),
    onSuccess: () => {
      toast.success('Services updated');
      queryClient.invalidateQueries({ queryKey: ['doctorServices'] });
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', fee: '' });
    },
    onError: () => toast.error('Failed to update services'),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newService = {
      _id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      fee: formData.fee ? Number(formData.fee) : null,
    };
    updateMutation.mutate([...services, newService]);
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormData({ name: service.name, description: service.description, fee: service.fee || '' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = services.map(s => s._id === editingId ? { ...s, ...formData, fee: formData.fee ? Number(formData.fee) : null } : s);
    updateMutation.mutate(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      updateMutation.mutate(services.filter(s => s._id !== id));
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading services..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Services</h1>
          <p className="text-[var(--color-text-muted)]">Manage your medical services</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Service
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Service Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="textarea-base" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Fee (₹) - Optional</label>
              <input type="number" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} className="input-base" min="0" placeholder="Leave empty if not applicable" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Service
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); setFormData({ name: '', description: '', fee: '' }); }} className="btn-secondary">
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-text)] text-lg">{service.name}</h3>
                  {service.description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{service.description}</p>}
                  {service.fee && <p className="text-sm font-medium text-[var(--color-primary)] mt-2">₹{service.fee}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(service)} className="p-2 hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors">
                    <Edit2 size={18} className="text-[var(--color-text-secondary)]" />
                  </button>
                  <button onClick={() => handleDelete(service._id)} className="p-2 hover:bg-[var(--color-danger-50)] rounded-lg transition-colors">
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

export default ServicesManagement;