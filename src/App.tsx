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
    const [data, setData] = useState<Event[]>([]); // Start empty
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline' | 'error'>('connecting');
    const isConnected = connectionStatus === 'online';

    // Fetch Events and Notifications from Supabase
    useEffect(() => {
        const fetchRemoteData = async () => {
            // 1. Events
            try {
                const { data: events, error: eventError } = await supabase
                    .from('events')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!eventError) {
                    setConnectionStatus('online');
                    if (events && events.length > 0) {
                        setData(events);
                    } else {
                        setData([]);
                    }
                } else {
                    setConnectionStatus('error');
                    console.error("Supabase connection error:", eventError.message);
                    const saved = localStorage.getItem('roadside_events');
                    setData(saved ? JSON.parse(saved) : MOCK_DATA);
                }
            } catch (err) {
                console.error("Connection Error:", err);
                setConnectionStatus('error');
                setData(MOCK_DATA);
            }

            // 2. Notifications
            try {
                const { data: notifs } = await supabase
                    .from('notifications')
                    .select('*')
                    .order('timestamp', { ascending: false });

                if (notifs) setNotifications(notifs);
            } catch (err) {
                console.error("Notifications fetch error:", err);
            }
        };

        fetchRemoteData();
    }, []);

    // Helper to sync events
    const syncEvent = async (event: Event, action: 'insert' | 'update' | 'delete') => {
        if (!isConnected) return; // Don't try if offline/mock

        // Map React camelCase to DB snake_case for Supabase
        const dbEvent = {
            id: event.id,
            status: event.status,
            vendor: event.vendor,
            location: event.location,
            type: event.type,
            price: event.price,
            satisfaction: event.satisfaction,
            notes: event.notes,
            review_notes: event.reviewNotes,
            created_at: event.created_at || event.timestamp
        };

        let res;
        if (action === 'insert') {
            res = await supabase.from('events').insert([dbEvent]);
        } else if (action === 'update') {
            res = await supabase.from('events').update(dbEvent).eq('id', event.id);
        } else if (action === 'delete') {
            res = await supabase.from('events').delete().eq('id', event.id);
        }

        if (res?.error) {
            console.error(`Supabase Sync Error (${action}):`, res.error.message);
            addNotification('Sync Error', `Cloud update failed: ${res.error.message}`, 'warning');
        } else {
            console.log(`Supabase Sync Success (${action}):`, event.id);
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
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            alertCount={alertCount}
            connectionStatus={connectionStatus}
        >
            {currentView === 'dashboard' && (
                <Dashboard
                    vendorFilter={null}
                    data={data}
                    onLogEvent={handleLogEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onNavigate={handleNavigate}
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
    );
}

export default App;
