import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ServiceLogView } from './components/views/ServiceLogView';
import { VendorWatchlistView } from './components/views/VendorWatchlistView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { Event, Notification } from './types';

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
    const [currentView, setCurrentView] = useState<'dashboard' | 'service_log' | 'vendors' | 'analytics'>('dashboard');
    const [vendorFilter, setVendorFilter] = useState<string | null>(null);
    const [data, setData] = useState<Event[]>(MOCK_DATA);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 'n1', title: 'System Online', message: 'Connection established with central dispatch.', timestamp: 'Just now', read: false, type: 'success' },
        { id: 'n2', title: 'Pending Reviews', message: '3 cases require manager approval.', timestamp: '10m ago', read: false, type: 'warning' }
    ]);

    const handleNavigate = (view: 'dashboard' | 'service_log' | 'vendors' | 'analytics') => {
        setCurrentView(view);
    };

    const handleVendorFilter = (vendor: string | null) => {
        setVendorFilter(vendor);
        if (currentView !== 'dashboard') setCurrentView('dashboard');
    };

    const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
        const newNotif: Notification = {
            id: `n-${Date.now()}`,
            title,
            message,
            timestamp: 'Just now',
            read: false,
            type
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const handleClearNotifications = () => {
        setNotifications([]);
    };

    const handleLogEvent = (newEvent: Event) => {
        setData([newEvent, ...data]);
        addNotification('New Event Logged', `Case ${newEvent.id} added by System.`, 'info');
    };

    const handleEditEvent = (updatedEvent: Event) => {
        setData(data.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
        if (updatedEvent.status === 'resolved') {
            addNotification('Case Resolved', `Case ${updatedEvent.id} marked as resolved.`, 'success');
        }
    };

    const handleDeleteEvent = (id: string) => {
        setData(data.filter(ev => ev.id !== id));
    };

    return (
        <Layout
            currentView={currentView}
            onNavigate={handleNavigate}
            onFilterVendor={handleVendorFilter}
            activeVendorFilter={vendorFilter}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
        >
            {currentView === 'dashboard' && (
                <Dashboard
                    vendorFilter={vendorFilter}
                    data={data}
                    onLogEvent={handleLogEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}

            {currentView === 'service_log' && (
                <ServiceLogView
                    data={data}
                    onLogEvent={handleLogEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}

            {currentView === 'vendors' && (
                <VendorWatchlistView events={data} />
            )}

            {currentView === 'analytics' && (
                <AnalyticsView />
            )}
        </Layout>
    )
}

export default App
