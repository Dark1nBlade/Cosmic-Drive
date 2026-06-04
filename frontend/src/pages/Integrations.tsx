import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Cloud,
  Server
} from 'lucide-react';

const Integrations = () => {
  const [controllers, setControllers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchControllers = async () => {
    try {
      const res = await axios.get('/api/controllers/');
      setControllers(res.data);
    } catch (err) {
      console.error("Failed to fetch controllers", err);
    }
  };

  useEffect(() => {
    fetchControllers();
  }, []);

  const handleSync = async (id: number) => {
    try {
      await axios.post(`/api/controllers/${id}/sync`);
      alert("Sync started in background");
      fetchControllers();
    } catch (err) {
      alert("Sync failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this controller?")) {
      try {
        await axios.delete(`/api/controllers/${id}`);
        fetchControllers();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SD-WAN Integrations</h1>
          <p className="text-slate-500">Manage connections to vendor controllers and orchestrators.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Controller</span>
        </button>
      </div>

      {controllers.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Cloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No controllers connected</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Start by adding a Cisco vManage or VMware VeloCloud controller to sync your fabric topology.
          </p>
          <button
             onClick={() => setIsModalOpen(true)}
             className="mt-6 text-blue-600 font-medium hover:underline"
          >
            Add your first controller &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {controllers.map((controller) => (
            <ControllerCard
              key={controller.id}
              controller={controller}
              onSync={() => handleSync(controller.id)}
              onDelete={() => handleDelete(controller.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddControllerModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchControllers();
          }}
        />
      )}
    </div>
  );
};

const ControllerCard = ({ controller, onSync, onDelete }: any) => {
  const statusColors = {
    online: 'text-green-500 bg-green-50',
    offline: 'text-slate-500 bg-slate-50',
    error: 'text-red-500 bg-red-50'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Server size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{controller.name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-wider">{controller.vendor_type}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${(statusColors as any)[controller.status] || statusColors.offline}`}>
            {controller.status === 'online' ? <CheckCircle2 size={12} /> : controller.status === 'error' ? <AlertCircle size={12} /> : <XCircle size={12} />}
            <span className="capitalize">{controller.status}</span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Endpoint</span>
            <span className="text-slate-900">{controller.hostname}:{controller.port}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Last Sync</span>
            <span className="text-slate-900">{controller.last_sync ? new Date(controller.last_sync).toLocaleString() : 'Never'}</span>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2">
          <button
            onClick={onSync}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={16} />
            Sync Now
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddControllerModal = ({ onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    vendor_type: 'cisco',
    hostname: '',
    port: 443,
    username: '',
    password: '',
    api_key: '',
    verify_ssl: 'true'
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');

    try {
      // 1. Create the controller
      const res = await axios.post('/api/controllers/', formData);

      // 2. Test the connection immediately
      const testRes = await axios.post(`/api/controllers/${res.data.id}/test`);

      if (testRes.data.status === 'success') {
        onSuccess();
      } else {
        setError(testRes.data.message || 'Validation failed');
        setIsValidating(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save controller');
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Add SD-WAN Controller</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Friendly Name</label>
              <input
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="HQ vManage"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Vendor</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.vendor_type}
                onChange={e => setFormData({...formData, vendor_type: e.target.value})}
              >
                <option value="cisco">Cisco vManage</option>
                <option value="velocloud">VMware VeloCloud</option>
                <option value="mock">Mock Environment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hostname/IP</label>
              <input
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.hostname}
                onChange={e => setFormData({...formData, hostname: e.target.value})}
                placeholder="10.0.0.50"
              />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Port</label>
                <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.port}
                    onChange={e => setFormData({...formData, port: parseInt(e.target.value)})}
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
                <input
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    placeholder="admin"
                />
            </div>
            <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password / API Key</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Validating...
                </>
              ) : (
                'Save & Sync'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Integrations;
