import { useMemo } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, AlertTriangle, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Event } from '../../types';
import { DataGrid } from '../dashboard/DataGrid';
import { cn } from '../../lib/utils';

interface VendorProfileProps {
    vendor: {
        id: string;
        name: string;
        location: string;
        rating: number;
        status: string;
        reliability: number;
        joined: string;
    };
    events: Event[];
    onBack: () => void;
    onEditEvent: (event: Event) => void;
    onDeleteEvent: (id: string) => void;
}

export function VendorProfile({ vendor, events, onBack, onEditEvent, onDeleteEvent }: VendorProfileProps) {
    // ... existing code ...
    // Filter events for this vendor
    const vendorEvents = useMemo(() => {
        return events.filter(e => e.vendor === vendor.name);
    }, [events, vendor.name]);

    // Calculate Stats
    const stats = useMemo(() => {
        const totalSpend = vendorEvents.reduce((acc, curr) => acc + curr.price, 0);
        const avgCost = vendorEvents.length > 0 ? totalSpend / vendorEvents.length : 0;
        const totalJobs = vendorEvents.length;

        // Mocking monthly spend for the chart based on available events
        // In a real app, this would group by actual dates
        const spendTrend = vendorEvents.map((e, i) => ({
            name: `Job ${i + 1}`,
            value: e.price
        })).slice(0, 10); // Last 10 jobs

        return { totalSpend, avgCost, totalJobs, spendTrend };
    }, [vendorEvents]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-900">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-wide flex items-center gap-3">
                        {vendor.name}
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded font-mono uppercase border",
                            vendor.status === 'ok' ? "bg-emerald-950/30 text-emerald-400 border-emerald-900" :
                                vendor.status === 'warn' ? "bg-amber-950/30 text-amber-400 border-amber-900" :
                                    "bg-rose-950/30 text-rose-400 border-rose-900"
                        )}>
                            {vendor.status === 'crit' ? 'CRITICAL' : vendor.status === 'warn' ? 'WARNING' : 'ACTIVE'}
                        </span>
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mt-1">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {vendor.location}</span>
                        <span>|</span>
                        <span>ID: {vendor.id}</span>
                        <span>|</span>
                        <span>JOINED: {vendor.joined}</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto pr-2">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-950 border border-slate-900 p-4 rounded hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Reliability Score</span>
                            {vendor.reliability > 90
                                ? <ShieldCheck size={14} className="text-emerald-500" />
                                : <AlertTriangle size={14} className="text-amber-500" />
                            }
                        </div>
                        <div className={cn(
                            "text-2xl font-mono font-bold",
                            vendor.reliability > 90 ? "text-emerald-400" : "text-amber-400"
                        )}>
                            {vendor.reliability}%
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Spend</span>
                            <DollarSign size={14} className="text-blue-500" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-slate-200">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.totalSpend)}
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Jobs</span>
                            <Activity size={14} className="text-purple-500" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-slate-200">
                            {stats.totalJobs}
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Avg Cost / Job</span>
                            <TrendingUp size={14} className="text-slate-500" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-slate-200">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.avgCost)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Recent Cost Trend Chart */}
                    <div className="col-span-2 bg-slate-950 border border-slate-900 rounded p-4 h-64">
                        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Recent Job Costs</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.spendTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                    itemStyle={{ color: '#e2e8f0', fontFamily: 'monospace' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Notes / Context */}
                    <div className="bg-slate-950 border border-slate-900 rounded p-4 h-64 overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Vendor Notes</h3>
                        <ul className="space-y-2">
                            <li className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border-l-2 border-emerald-500">
                                <span className="text-slate-500 text-[10px] block mb-1">2024-01-15</span>
                                Contract renewed for FY2025. Rates held steady.
                            </li>
                            <li className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border-l-2 border-amber-500">
                                <span className="text-slate-500 text-[10px] block mb-1">2023-11-20</span>
                                Flagged for slow response times in North District.
                            </li>
                            <li className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border-l-2 border-blue-500">
                                <span className="text-slate-500 text-[10px] block mb-1">2023-08-10</span>
                                Added "Heavy Tow" to certified capabilities.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* History Data Grid */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Service History</h3>
                    <DataGrid
                        data={vendorEvents}
                        onEdit={onEditEvent}
                        onDelete={onDeleteEvent}
                    />
                </div>
            </div>
        </div>
    );
}
