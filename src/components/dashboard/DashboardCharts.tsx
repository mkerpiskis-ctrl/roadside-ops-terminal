import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Event } from '../../types';

interface DashboardChartsProps {
    data: Event[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    // 1. Weekly Volume & Spend (Last 7 Days)
    const volumeData = useMemo(() => {
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i)); // Go back 6 days to today
            return d;
        });

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return last7Days.map(date => {
            const dateString = date.toISOString().slice(0, 10); // YYYY-MM-DD
            const dayName = dayLabels[date.getDay()];

            // Filter events for this day (local time approx comparison for simplicity, or strict UTC if stored as such)
            // Assuming timestamp is ISO string or YYYY-MM-DD format
            const eventsForDay = data.filter(e => {
                // Handle various timestamp formats from DB or Mock
                const eventDate = e.created_at || e.timestamp;
                return eventDate && eventDate.startsWith(dateString);
            });

            const volume = eventsForDay.length;
            const spend = eventsForDay.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

            return { name: dayName, volume, spend, date: dateString };
        });
    }, [data]);

    // 2. Incident Types (Aggregated from real data)
    const finalPieData = useMemo(() => {
        const typeCounts: Record<string, number> = {};
        data.forEach(item => {
            const t = item.type || 'Unknown';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
        });

        const sorted = Object.keys(typeCounts).map(type => ({
            name: type,
            value: typeCounts[type]
        })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

        return sorted.length > 0 ? sorted : [{ name: 'No Data', value: 1 }];
    }, [data]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Volume Chart */}
            <div className="bg-slate-950 border border-slate-900 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Weekly Volume & Spend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar yAxisId="right" dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Incident Type Distribution */}
            <div className="bg-slate-950 border border-slate-900 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Incident Type Distribution</h3>
                <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={finalPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {finalPieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-[-10px]">
                    {finalPieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-[10px] text-slate-400">{entry.name} ({entry.value})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
