import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Network, Activity, Shield, CheckCircle } from 'lucide-react';
import TopologyCanvas from '../components/TopologyCanvas';

const Dashboard = () => {
  const [stats, setStats] = useState({
    health: 98,
    activeEdges: 0,
    securityEvents: 0,
    compliance: 100
  });

  useEffect(() => {
    axios.get('/api/edges/').then(res => {
      setStats(prev => ({ ...prev, activeEdges: res.data.length }));
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Network Health" value={`${stats.health}%`} icon={<Activity className="text-green-500" />} />
        <StatCard title="Active Edges" value={stats.activeEdges} icon={<Network className="text-blue-500" />} />
        <StatCard title="Security Events" value={stats.securityEvents} icon={<Shield className="text-slate-500" />} />
        <StatCard title="Compliance" value={`${stats.compliance}%`} icon={<CheckCircle className="text-green-500" />} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Fabric Overview</h2>
        <div className="h-[400px]">
          <TopologyCanvas />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
  </div>
);

export default Dashboard;
