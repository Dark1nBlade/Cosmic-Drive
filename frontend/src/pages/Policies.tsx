import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Shield,
  Plus,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code
} from 'lucide-react';

const Policies = () => {
  const [policies, setPolicies] = useState<any[]>([]);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('/api/policies/');
      setPolicies(res.data);
    } catch (err) {
      console.error("Failed to fetch policies", err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleDeploy = async (id: number) => {
    try {
        await axios.post(`/api/policies/${id}/deploy`, { edge_ids: [] });
        alert("Deployment started");
        fetchPolicies();
    } catch (err) {
        alert("Deployment failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Policy Engine</h1>
          <p className="text-slate-500">Define and deploy business intent policies across the fabric.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Create Policy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${policy.status === 'deployed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{policy.name}</h3>
                <p className="text-sm text-slate-500">{policy.description}</p>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        Last deployed: {policy.last_deployed_at ? new Date(policy.last_deployed_at).toLocaleString() : 'Never'}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Code size={12} />
                        Traffic Steering
                    </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className={`flex items-center gap-1.5 text-sm font-bold uppercase ${policy.status === 'deployed' ? 'text-green-600' : 'text-slate-400'}`}>
                        {policy.status === 'deployed' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {policy.status}
                    </div>
                </div>
                <button
                    onClick={() => handleDeploy(policy.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                    <Play size={14} fill="currentColor" />
                    Deploy
                </button>
            </div>
          </div>
        ))}

        {policies.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                No policies defined yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
