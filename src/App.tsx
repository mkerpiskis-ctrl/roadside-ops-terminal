import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ServiceLogView } from './components/views/ServiceLogView';
import { VendorWatchlistView } from './components/views/VendorWatchlistView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ViewType } from './components/layout/Sidebar';
import { Event } from './types';

// Initial Mock Data (moved from Dashboard)
const MOCK_DATA: Event[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `EV-${1000 + i}`,
    timestamp: `2024-02-06 14:${String(30 + i).padStart(2, '0')}`,
    status: (i % 5 === 0 ? 'review' : i % 3 === 0 ? 'pending' : 'resolved') as Event['status'],
    vendor: ['ABS Towing', 'Midwest Recovery', 'QuickFix Mobile', 'Lone Star Tire', 'Global Heavy Ops'][i % 5],
    location: ['Dallas, TX', 'Chicago, IL', 'Atlanta, GA', 'Denver, CO', 'Phoenix, AZ'][i % 5],
    type: ['Heavy Tow', 'Tire Service', 'Lockout', 'Winch-out', 'Jump Start'][i % 5],
    price: [750, 1200, 4500, 350, 200][i % 5] + (Math.random() * 100),
    satisfaction: (i % 5 === 0 ? 'bad' : 'good') as Event['satisfaction'],
}));

function App() {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [vendorFilter, setVendorFilter] = useState<string | null>(null);
    const [data, setData] = useState<Event[]>(MOCK_DATA);

    const handleNavigate = (view: ViewType) => {
        setCurrentView(view);
        if (view !== 'dashboard') {
            setVendorFilter(null);
        }
    };

    const handleVendorFilter = (vendor: string) => {
        setVendorFilter(vendor);
        if (currentView !== 'dashboard') {
            setCurrentView('dashboard');
        }
    };

    const handleLogEvent = (newEvent: Event) => {
        setData([newEvent, ...data]);
    };

    return (
        <Layout
            currentView={currentView}
            onNavigate={handleNavigate}
            onFilterVendor={handleVendorFilter}
            activeVendorFilter={vendorFilter}
        >
            {currentView === 'dashboard' && (
                <Dashboard
                    vendorFilter={vendorFilter}
                    data={data}
                    onLogEvent={handleLogEvent}
                />
            )}

            {currentView === 'service_log' && (
                <ServiceLogView
                    data={data}
                    onLogEvent={handleLogEvent}
                />
            )}

            {currentView === 'vendors' && (
                <VendorWatchlistView />
            )}

            {currentView === 'analytics' && (
                <AnalyticsView />
            )}
        </Layout>
    )
}

export default App
