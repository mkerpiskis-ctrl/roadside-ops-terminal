import { useState, useMemo } from 'react';
import { ShieldAlert, ArrowRight, LayoutList } from 'lucide-react';
import { StatCard } from './StatCard';
import { DataGrid } from './DataGrid';
import { DashboardCharts } from './DashboardCharts';
import { LogEventModal } from '../features/LogEventModal';
import { Event } from '../../types';

interface DashboardProps {
    vendorFilter: string | null;
    data: Event[];
    onLogEvent: (event: Event) => void;
    onEditEvent: (event: Event) => void;
    onDeleteEvent: (id: string) => void;
    onNavigate: (view: 'dashboard' | 'service_log' | 'vendors' | 'analytics') => void;
}

export function Dashboard({ vendorFilter, data, onLogEvent, onEditEvent, onDeleteEvent, onNavigate }: DashboardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const handleFormSubmit = (formData: any) => {
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

        if (editingEvent) {
            const updatedEvent: Event = {
                ...editingEvent,
                status: (formData.outcome === 'Completed' ? 'resolved' : 'review') as Event['status'],
                vendor: formData.vendor || 'Unknown Vendor',
                location: formData.location || 'Unknown Loc',
                type: formData.type,
                price: Number(formData.price) || 0,
                satisfaction: formData.satisfaction,
                notes: formData.notes,
                reviewNotes: formData.reviewNotes,
            };
            onEditEvent(updatedEvent);
        } else {
            // Add new event
            const newEvent: Event = {
                id: `EV-${Math.floor(Math.random() * 10000)}`,
                timestamp: timestamp,
                status: (formData.outcome === 'Completed' ? 'resolved' : 'review') as Event['status'],
                vendor: formData.vendor || 'Unknown Vendor',
                location: formData.location || 'Unknown Loc',
                type: formData.type,
                price: Number(formData.price) || 0,
                satisfaction: formData.satisfaction,
                notes: formData.notes,
                created_at: new Date().toISOString()
            };
            onLogEvent(newEvent);
        }
    };

    const openLogModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    // Filter Data Source
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Vendor Filter (from Sidebar - legacy/external)
            if (vendorFilter && item.vendor !== vendorFilter) return false;
            return true;
        });
    }, [data, vendorFilter]);

    // Calculate Dynamic Stats
    const stats = useMemo(() => {
        const totalSpend = filteredData.reduce((acc, item) => acc + item.price, 0);
        const avgCost = filteredData.length > 0 ? totalSpend / filteredData.length : 0;
        const activeAlerts = filteredData.filter(item => item.status === 'review' || item.status === 'pending').length;

        return { totalSpend, avgCost, count: filteredData.length, activeAlerts };
    }, [filteredData]);

    // Urgent Alerts Only
    const urgentItems = useMemo(() => {
        return data.filter(item => item.status === 'review' || item.status === 'pending').slice(0, 5);
    }, [data]);

    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* Header / Title Area */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Mission Control</h2>
                    <p className="text-sm text-slate-500 font-mono">LIVE OPERATIONS MONITORING</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={openLogModal}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        <LayoutList size={14} />
                        LOG EVENT
                    </button>
                </div>
            </div>

            {/* KPI Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Spend (MTD)"
                    value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.totalSpend)}
                    trend={{ value: "+12.5%", isPositive: false }}
                />
                <StatCard
                    label="Events (24h)"
                    value={stats.count.toString()}
                    trend={{ value: "+3", isPositive: true }}
                />
                <StatCard
                    label="Avg Cost"
                    value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.avgCost)}
                    trend={{ value: "-2.1%", isPositive: true }}
                />
                <StatCard
                    label="Active Alerts"
                    value={stats.activeAlerts.toString()}
                    className={stats.activeAlerts > 0 ? "border-rose-900 bg-rose-950/20 transition-colors animate-pulse-slow" : "border-slate-800"}
                />
            </div>

            {/* Visualization Layer */}
            <DashboardCharts data={data} />

            {/* Action Items / Recent Alerts */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-950 border border-slate-900 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/30">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="text-rose-500" size={18} />
                            <h3 className="text-sm font-bold text-slate-200">RECENT CRITICAL ALERTS</h3>
                        </div>
                        <button
                            onClick={() => onNavigate('service_log')}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                            VIEW ALL ACTIVITY <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="p-0">
                        {urgentItems.length > 0 ? (
                            <DataGrid
                                data={urgentItems}
                                onEdit={handleEditClick}
                                onDelete={onDeleteEvent}
                            />
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm font-mono border-t border-slate-900/50">
                                NO ACTIVE ALERTS. SYSTEM NOMINAL.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LogEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingEvent}
            />
        </div>
    );
}
