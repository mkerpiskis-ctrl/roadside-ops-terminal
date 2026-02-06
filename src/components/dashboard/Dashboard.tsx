import { useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import { ActionBar } from './ActionBar';
import { DataGrid } from './DataGrid';
import { LogEventModal } from '../features/LogEventModal';
import { Event } from '../../types';

interface DashboardProps {
    vendorFilter: string | null;
}

// Mock Data
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

export function Dashboard({ vendorFilter }: DashboardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(MOCK_DATA);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'review' | 'pending' | 'resolved'>('all');

    const handleLogEvent = (formData: any) => {
        // Add new event to top of list
        const newEvent: Event = {
            id: `EV-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: (formData.outcome === 'Completed' ? 'resolved' : 'review') as Event['status'],
            vendor: formData.vendor || 'Unknown Vendor',
            location: formData.location || 'Unknown Loc',
            type: formData.type,
            price: Number(formData.price) || 0,
            satisfaction: formData.satisfaction
        };
        setData([newEvent, ...data]);
    };

    // Filter Data Source
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Vendor Filter (from Sidebar)
            if (vendorFilter && item.vendor !== vendorFilter) return false;

            // Status Filter
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;

            // Search Query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    item.vendor.toLowerCase().includes(q) ||
                    item.location.toLowerCase().includes(q) ||
                    item.type.toLowerCase().includes(q) ||
                    item.id.toLowerCase().includes(q)
                );
            }

            return true;
        });
    }, [data, vendorFilter, statusFilter, searchQuery]);

    // Calculate Dynamic Stats
    const stats = useMemo(() => {
        const totalSpend = filteredData.reduce((acc, item) => acc + item.price, 0);
        const avgCost = filteredData.length > 0 ? totalSpend / filteredData.length : 0;
        const activeAlerts = filteredData.filter(item => item.status === 'review' || item.status === 'pending').length;

        return { totalSpend, avgCost, count: filteredData.length, activeAlerts };
    }, [filteredData]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Ticker Tape */}
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
                    className="border-rose-900 bg-rose-950/10"
                />
            </div>

            {/* Main Content */}
            <div className="">
                {/* Active Filter Badge */}
                {vendorFilter && (
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Filtered by:</span>
                        <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-900 rounded font-mono">
                            VENDOR: {vendorFilter}
                        </span>
                    </div>
                )}

                <ActionBar
                    onLogEvent={() => setIsModalOpen(true)}
                    onSearch={setSearchQuery}
                    onFilterStatus={setStatusFilter}
                    currentStatus={statusFilter}
                />
                <DataGrid data={filteredData} />
            </div>

            <LogEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleLogEvent}
            />
        </div>
    );
}
