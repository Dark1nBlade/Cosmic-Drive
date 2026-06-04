import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Settings,
  ShieldCheck,
  Zap,
  History,
  Database,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Sites', icon: <Database size={20} />, path: '/sites' },
    { name: 'Topology', icon: <Network size={20} />, path: '/topology' },
    { name: 'Policies', icon: <ShieldCheck size={20} />, path: '/policies' },
    { name: 'Tests', icon: <Zap size={20} />, path: '/tests' },
    { name: 'Integrations', icon: <Cpu size={20} />, path: '/integrations' },
    { name: 'Logs & Audit', icon: <History size={20} />, path: '/logs' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-2">
        <Network className="text-blue-400" />
        <span>SD-WAN Unified</span>
      </div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
