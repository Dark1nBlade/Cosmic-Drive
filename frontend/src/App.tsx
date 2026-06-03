import React from 'react';
import './App.css';
import TopologyCanvas from './components/TopologyCanvas';
import { Activity, Shield, Cpu, Network, Play, CheckCircle } from 'lucide-react';
import axios from 'axios';

function App() {
  const [assessing, setAssessing] = React.useState(false);

  const runAssessment = async () => {
    setAssessing(true);
    try {
      await axios.post('/api/tests/assess');
      alert('Fabric assessment initiated. Results will appear on the topology shortly.');
    } catch (error) {
      console.error('Error running assessment', error);
      alert('Failed to start assessment.');
    } finally {
      setAssessing(false);
    }
  };

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

        <section id="topology" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Live Fabric Topology</h2>
            <div className="flex gap-2">
              <button
                onClick={runAssessment}
                disabled={assessing}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 disabled:bg-slate-400"
              >
                <Play size={16} /> {assessing ? 'Assessing...' : 'Assess Fabric'}
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Sync Inventory</button>
            </div>
          </div>
          <TopologyCanvas />
        </section>

        <section id="policies" className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Unified Policy Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <PolicyCard name="Voice-SLA" status="Deployed" lastDeployed="2 hours ago" />
             <PolicyCard name="M365-Priority" status="Draft" lastDeployed="Never" />
          </div>
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

const PolicyCard = ({ name, status, lastDeployed }: { name: string, status: string, lastDeployed: string }) => (
  <div className="border border-slate-200 p-4 rounded-lg flex justify-between items-center">
    <div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-xs text-slate-500">Last Deployed: {lastDeployed}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded ${status === 'Deployed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Deploy</button>
    </div>
  </div>
);

export default App;
