import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <Header />

            {/* Main Content Area */}
            {/* Padding Left = Sidebar width (w-64 = 16rem = 256px) */}
            {/* Padding Top = Header height (h-14 = 3.5rem = 56px) */}
            <main className="pl-64 pt-14 min-h-screen">
                <div className="p-6 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
