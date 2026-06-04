import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Play,
  History
} from 'lucide-react';

const Tests = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const fetchData = async () => {
    try {
      const [resultsRes] = await Promise.all([
        axios.get('/api/tests/results')
      ]);
      setResults(resultsRes.data);
    } catch (err) {
      console.error("Failed to fetch test data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunAssessment = async () => {
    setIsRunning(true);
    try {
      await axios.post('/api/tests/assess');
      alert("Fabric assessment started");
      setTimeout(fetchData, 5000);
    } catch (err) {
      alert("Failed to start assessment");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Synthetic Testing</h1>
          <p className="text-slate-500">Validate fabric health and SLA compliance with active probes.</p>
        </div>
        <button
            onClick={handleRunAssessment}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            <Play size={18} fill="currentColor" />
            <span>Run Full Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2">
                    <History size={18} className="text-slate-400" />
                    Recent Test Results
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Source</th>
                                <th className="px-4 py-3">Target</th>
                                <th className="px-4 py-3">Latency</th>
                                <th className="px-4 py-3">Loss</th>
                                <th className="px-4 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map((res) => (
                                <tr key={res.id}>
                                    <td className="px-4 py-3 font-medium text-slate-700">{res.source_device_id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{res.target_device_id}</td>
                                    <td className={`px-4 py-3 ${res.latency > 100 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>{res.latency.toFixed(2)} ms</td>
                                    <td className={`px-4 py-3 ${res.loss > 0 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>{res.loss}%</td>
                                    <td className="px-4 py-3 text-slate-400">{new Date(res.timestamp).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">SLA Compliance</h3>
                  <div className="space-y-4">
                      <SLACard label="VoIP (Latency < 150ms)" score={95} />
                      <SLACard label="SaaS (Loss < 0.1%)" score={100} />
                      <SLACard label="Bulk (Throughput > 1Gbps)" score={82} />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const SLACard = ({ label, score }: any) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">{label}</span>
            <span className={score > 90 ? 'text-green-600' : 'text-yellow-600'}>{score}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
                className={`h-full ${score > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

export default Tests;
