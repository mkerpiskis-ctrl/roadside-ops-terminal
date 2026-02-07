import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Event } from '../../types';

interface DashboardChartsProps {
    data: Event[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    // 1. Spend vs Volume (Mocked/Aggregated)
    // In a real app, we'd aggregate `data` by day or week.
    // For now, let's create some derived data from the events or use static shape if data is sparse.
    const volumeData = [
        { name: 'Mon', volume: 4, spend: 1200 },
        { name: 'Tue', volume: 7, spend: 2100 },
        { name: 'Wed', volume: 5, spend: 1600 },
        { name: 'Thu', volume: 8, spend: 2400 },
        { name: 'Fri', volume: 12, spend: 3800 },
        { name: 'Sat', volume: 9, spend: 2900 },
        { name: 'Sun', volume: 3, spend: 900 },
    ];

    // 2. Incident Types (Aggregated from real data)
    const typeCounts: Record<string, number> = {};
    data.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    const pieData = Object.keys(typeCounts).map(type => ({
        name: type,
        value: typeCounts[type]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

    // Fallback if no data
    const finalPieData = pieData.length > 0 ? pieData : [
        { name: 'Towing', value: 40 },
        { name: 'Tire', value: 30 },
        { name: 'Lockout', value: 20 },
        { name: 'Fuel', value: 10 },
    ];

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
