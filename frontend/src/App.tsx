import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Sites from './pages/Sites';
import Policies from './pages/Policies';
import Tests from './pages/Tests';

// Placeholder components for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <div className="text-4xl font-bold mb-2">{name}</div>
    <p>This module is currently under development.</p>
  </div>
);

const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <div className="text-6xl font-bold mb-4">404</div>
      <p className="text-xl">Page Not Found</p>
    </div>
  );

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<Sites />} />
          <Route path="topology" element={<div className="h-full"><Dashboard /></div>} />
          <Route path="policies" element={<Policies />} />
          <Route path="tests" element={<Tests />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="logs" element={<Placeholder name="Logs & Audit" />} />
          <Route path="settings" element={<Placeholder name="System Settings" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
