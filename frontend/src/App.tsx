import React from 'react';
import './App.css';
import TopologyCanvas from './components/TopologyCanvas';
import { Activity, Shield, Cpu, Network } from 'lucide-react';

function App() {
  return (
    <div className="App">
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Network className="text-blue-400" />
          <h1 className="text-xl font-bold">Unified SD-WAN Platform</h1>
        </div>
        <nav className="flex gap-6">
          <a href="#topology" className="hover:text-blue-400">Topology</a>
          <a href="#policies" className="hover:text-blue-400">Policies</a>
          <a href="#compliance" className="hover:text-blue-400">Compliance</a>
          <a href="#analytics" className="hover:text-blue-400">Analytics</a>
        </nav>
      </header>

      <main className="p-6 bg-slate-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Network Health" value="98%" icon={<Activity className="text-green-500"/>} />
          <StatCard title="Active Edges" value="13" icon={<Cpu className="text-blue-500"/>} />
          <StatCard title="Security Events" value="0" icon={<Shield className="text-slate-500"/>} />
          <StatCard title="Compliance" value="100%" icon={<Shield className="text-green-500"/>} />
        </div>

        <section id="topology" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Live Fabric Topology</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Sync Inventory</button>
          </div>
          <TopologyCanvas />
        </section>
      </main>
    </div>
  );
}

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-full">
      {icon}
    </div>
  </div>
);

export default App;
