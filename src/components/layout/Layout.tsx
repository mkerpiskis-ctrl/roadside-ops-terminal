import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Notification } from '../../types';

interface LayoutProps {
    children: ReactNode;
    currentView: 'dashboard' | 'service_log' | 'vendors' | 'analytics';
    onNavigate: (view: 'dashboard' | 'service_log' | 'vendors' | 'analytics') => void;
    onFilterVendor: (vendor: string | null) => void;
    activeVendorFilter: string | null;
    notifications: Notification[];
    onClearNotifications: () => void;
    alertCount: number;
    connectionStatus: 'connecting' | 'online' | 'offline' | 'error';
}

export function Layout({
    children,
    currentView,
    onNavigate,
    onFilterVendor,
    activeVendorFilter,
    notifications,
    onClearNotifications,
    alertCount,
    connectionStatus
}: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            <Header
                notifications={notifications}
                onClearNotifications={onClearNotifications}
                connectionStatus={connectionStatus}
            />
            <Sidebar
                currentView={currentView}
                onNavigate={onNavigate}
                onFilterVendor={onFilterVendor}
                activeVendorFilter={activeVendorFilter}
                alertCount={alertCount}
            />

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
