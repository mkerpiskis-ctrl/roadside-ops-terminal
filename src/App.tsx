import { useState, useEffect } from 'react';
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

import { supabase } from './lib/supabase';

function App() {
    const [currentView, setCurrentView] = useState<'dashboard' | 'service_log' | 'vendors' | 'analytics'>('dashboard');
    const [vendorFilter, setVendorFilter] = useState<string | null>(null);
    const [data, setData] = useState<Event[]>(MOCK_DATA);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch Events and Notifications from Supabase
    useEffect(() => {
        const fetchRemoteData = async () => {
            // 1. Events
            const { data: events, error: eventError } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (!eventError) {
                // Connection successful (table exists)
                setIsConnected(true);

                // Only seed mock data if the cloud DB is COMPLETELY empty
                if (events && events.length > 0) {
                    setData(events);
                } else if (!localStorage.getItem('roadside_db_seeded')) {
                    // One-time seed for demonstration if cloud is empty
                    console.log("Supabase empty. Seeding initial data...");
                    // Optional: You could bulk insert MOCK_DATA here
                    // For now, we'll just start with an empty list if they deleted everything
                    setData([]);
                    localStorage.setItem('roadside_db_seeded', 'true');
                } else {
                    setData([]); // DB is legitimately empty
                }
            } else {
                console.log("Supabase connection error or table missing:", eventError.message);
                // Fallback to local storage if available
                const saved = localStorage.getItem('roadside_events');
                if (saved) setData(JSON.parse(saved));
            }

            // 2. Notifications
            const { data: notifs } = await supabase
                .from('notifications')
                .select('*')
                .order('timestamp', { ascending: false });

            if (notifs) setNotifications(notifs);
        };

        fetchRemoteData();
    }, []);

    // Helper to sync events
    const syncEvent = async (event: Event, action: 'insert' | 'update' | 'delete') => {
        if (!isConnected) return; // Don't try if offline/mock

        // Ensure consistent typing for DB
        const dbEvent = { ...event };

        if (action === 'insert') {
            await supabase.from('events').insert([dbEvent]);
        } else if (action === 'update') {
            await supabase.from('events').update(dbEvent).eq('id', event.id);
        } else if (action === 'delete') {
            await supabase.from('events').delete().eq('id', event.id);
        }
    };

    // Helper to sync notifications
    const syncNotification = async (notif: Notification) => {
        if (!isConnected) return;
        await supabase.from('notifications').insert([notif]);
    };

    // Calculate active alerts (Review or Pending)
    const alertCount = data.filter(e => e.status === 'review' || e.status === 'pending').length;

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
            timestamp: new Date().toISOString(),
            read: false,
            type
        };
        setNotifications(prev => [newNotif, ...prev]);
        syncNotification(newNotif);
    };

    const handleClearNotifications = async () => {
        setNotifications([]);
        if (isConnected) {
            await supabase.from('notifications').delete().neq('id', '0'); // Delete all
        }
    };

    const handleLogEvent = (newEvent: Event) => {
        const eventWithDate = { ...newEvent, created_at: new Date().toISOString() };
        setData([eventWithDate, ...data]);
        syncEvent(eventWithDate, 'insert');
        addNotification('New Event Logged', `Case ${newEvent.id} added by System.`, 'info');
    };

    const handleEditEvent = (updatedEvent: Event) => {
        setData(data.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
        syncEvent(updatedEvent, 'update');
        if (updatedEvent.status === 'resolved') {
            addNotification('Case Resolved', `Case ${updatedEvent.id} marked as resolved.`, 'success');
        }
    };

    const handleDeleteEvent = (id: string) => {
        const eventToDelete = data.find(e => e.id === id);
        setData(data.filter(ev => ev.id !== id));
        if (eventToDelete) syncEvent(eventToDelete, 'delete');
    };

    return (
        <Layout
            currentView={currentView}
            onNavigate={handleNavigate}
            onFilterVendor={handleVendorFilter}
            activeVendorFilter={vendorFilter}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            alertCount={alertCount}
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
                <VendorWatchlistView
                    events={data}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}

            {currentView === 'analytics' && (
                <AnalyticsView />
            )}
        </Layout>
    )
}

export default App
