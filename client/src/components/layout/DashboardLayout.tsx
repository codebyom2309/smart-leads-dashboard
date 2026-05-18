import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-canvas-soft dark:bg-dark-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          pageTitle={pageTitle}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
