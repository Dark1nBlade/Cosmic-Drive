import React from 'react';
import TopologyCanvas from '../components/TopologyCanvas';

const Topology = () => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interactive Fabric Topology</h1>
          <p className="text-slate-500">Real-time visualization of hubs, branches, and overlay link health.</p>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <TopologyCanvas />
      </div>
    </div>
  );
};

export default Topology;
