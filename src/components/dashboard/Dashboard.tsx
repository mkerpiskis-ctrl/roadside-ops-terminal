import { useState } from 'react';
import { StatCard } from './StatCard';
import { ActionBar } from './ActionBar';
import { DataGrid } from './DataGrid';
import { LogEventModal } from '../features/LogEventModal';

// Mock Data
const MOCK_DATA = Array.from({ length: 15 }).map((_, i) => ({
    id: `EV-${1000 + i}`,
    timestamp: `2024-02-06 14:${String(30 + i).padStart(2, '0')}`,
    status: i % 5 === 0 ? 'review' : i % 3 === 0 ? 'pending' : 'resolved',
    vendor: ['ABS Towing', 'Midwest Recovery', 'QuickFix Mobile', 'Lone Star Tire', 'Global Heavy Ops'][i % 5],
    location: ['Dallas, TX', 'Chicago, IL', 'Atlanta, GA', 'Denver, CO', 'Phoenix, AZ'][i % 5],
    type: ['Heavy Tow', 'Tire Service', 'Lockout', 'Winch-out', 'Jump Start'][i % 5],
    price: [750, 1200, 4500, 350, 200][i % 5] + (Math.random() * 100),
    satisfaction: i % 5 === 0 ? 'bad' : 'good',
})) as any[];

export function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(MOCK_DATA);

    const handleLogEvent = (formData: any) => {
        // Add new event to top of list
        const newEvent = {
            id: `EV-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: formData.outcome === 'Completed' ? 'resolved' : 'review',
            vendor: formData.vendor || 'Unknown Vendor',
            location: formData.location || 'Unknown Loc',
            type: formData.type,
            price: Number(formData.price) || 0,
            satisfaction: formData.satisfaction
        };
        setData([newEvent, ...data]);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Ticker Tape */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Spend (MTD)"
                    value="$142,590.00"
                    trend={{ value: "+12.5%", isPositive: false }}
                />
                <StatCard
                    label="Events (24h)"
                    value="48"
                    trend={{ value: "+3", isPositive: true }}
                />
                <StatCard
                    label="Avg Cost"
                    value="$892.45"
                    trend={{ value: "-2.1%", isPositive: true }}
                />
                <StatCard
                    label="Active Alerts"
                    value="3"
                    className="border-rose-900 bg-rose-950/10"
                />
            </div>

            {/* Main Content */}
            <div className="">
                <ActionBar onLogEvent={() => setIsModalOpen(true)} />
                <DataGrid data={data} />
            </div>

            <LogEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleLogEvent}
            />
        </div>
    );
}
