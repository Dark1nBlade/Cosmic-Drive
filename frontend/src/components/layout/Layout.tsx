import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="text-slate-400 text-sm">Main</div>
              </li>
              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return (
                  <li key={to} className="flex items-center space-x-2">
                    <span className="text-slate-300">/</span>
                    <span className={`text-sm ${isLast ? 'font-semibold text-slate-900' : 'text-slate-500 capitalize'}`}>
                      {value}
                    </span>
                  </li>
                );
              })}
              {pathnames.length === 0 && (
                 <li className="flex items-center space-x-2">
                 <span className="text-slate-300">/</span>
                 <span className="text-sm font-semibold text-slate-900">Dashboard</span>
               </li>
              )}
            </ol>
          </nav>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
