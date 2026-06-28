import React from 'react';

import Header from './Header';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900"
      id="main_container"
    >
      <Header />
      {children}
    </div>
  );
}
