import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Search,
  MapPin,
  MoreVertical,
  AlertCircle
} from 'lucide-react';

const Sites = () => {
  const [edges, setEdges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEdges = async () => {
    try {
      const res = await axios.get('/api/edges/');
      setEdges(res.data);
    } catch (err) {
      console.error("Failed to fetch edges", err);
    }
  };

  useEffect(() => {
    fetchEdges();
  }, []);

  const filteredEdges = edges.filter(edge => {
    const matchesSearch = edge.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edge.site_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = vendorFilter === 'all' || edge.vendor_type.toLowerCase() === vendorFilter;
    const matchesStatus = statusFilter === 'all' || edge.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesVendor && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edge Sites</h1>
          <p className="text-slate-500">Inventory of all managed SD-WAN edges and hubs.</p>
        </div>
        <div className="flex gap-3">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
                <Plus size={20} />
                <span>Provision Site</span>
            </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by hostname, site ID, or vendor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
          >
            <option value="all">All Vendors</option>
            <option value="cisco">Cisco</option>
            <option value="velocloud">VeloCloud</option>
            <option value="mock">Mock</option>
          </select>

          <select
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
            <option value="validated">Validated</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Device Info</th>
                <th className="px-6 py-4">Site ID</th>
                <th className="px-6 py-4">Vendor / Model</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Health</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEdges.map((edge) => (
                <tr key={edge.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{edge.hostname}</span>
                      <span className="text-xs text-slate-500 font-mono">{edge.uuid}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} />
                      <span className="font-medium">{edge.site_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium capitalize text-slate-700">{edge.vendor_type}</span>
                      <span className="text-xs text-slate-500">{edge.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 capitalize">
                      {edge.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${edge.health_score > 80 ? 'bg-green-500' : edge.health_score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${edge.health_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{edge.health_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEdges.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                  No edge devices found.
              </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProvisionSiteModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
                setIsModalOpen(false);
                fetchEdges();
            }}
        />
      )}
    </div>
  );
};

const ProvisionSiteModal = ({ onClose, onSuccess }: any) => {
    const [formData, setFormData] = useState({
        hostname: '',
        uuid: '',
        site_id: '',
        vendor_type: 'cisco',
        model: '',
        serial: '',
        latitude: 0,
        longitude: 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await axios.post('/api/edges/', formData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to provision site');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Provision New Site</h3>
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
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hostname</label>
                            <input
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={formData.hostname}
                                onChange={e => setFormData({...formData, hostname: e.target.value})}
                                placeholder="Branch-XYZ"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">UUID</label>
                            <input
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                                value={formData.uuid}
                                onChange={e => setFormData({...formData, uuid: e.target.value})}
                                placeholder="site-uuid"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Site ID</label>
                            <input
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={formData.site_id}
                                onChange={e => setFormData({...formData, site_id: e.target.value})}
                                placeholder="1001"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Vendor</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={formData.vendor_type}
                                onChange={e => setFormData({...formData, vendor_type: e.target.value})}
                            >
                                <option value="cisco">Cisco</option>
                                <option value="velocloud">VeloCloud</option>
                                <option value="mock">Mock</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Model</label>
                            <input
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={formData.model}
                                onChange={e => setFormData({...formData, model: e.target.value})}
                                placeholder="vEdge-100"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
                        <button type="submit" disabled={isSaving} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-sm">{isSaving ? 'Provisioning...' : 'Provision Site'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Sites;
