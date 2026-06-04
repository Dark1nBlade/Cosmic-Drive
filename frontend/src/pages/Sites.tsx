import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Search,
  MapPin,
  MoreVertical,
  Filter
} from 'lucide-react';

const Sites = () => {
  const [edges, setEdges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEdges = edges.filter(edge =>
    edge.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edge.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edge Sites</h1>
          <p className="text-slate-500">Inventory of all managed SD-WAN edges and hubs.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-medium">
                <Filter size={18} />
                Filters
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus size={20} />
                <span>Provision Site</span>
            </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by hostname, site ID, or vendor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
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
    </div>
  );
};

export default Sites;
