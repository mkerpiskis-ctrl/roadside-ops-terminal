import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const SPEND_DATA = [
    { name: 'Jan', spend: 4000 },
    { name: 'Feb', spend: 3000 },
    { name: 'Mar', spend: 2000 },
    { name: 'Apr', spend: 2780 },
    { name: 'May', spend: 1890 },
    { name: 'Jun', spend: 2390 },
    { name: 'Jul', spend: 3490 },
];

const SERVICE_MIX_DATA = [
    { name: 'Heavy Tow', value: 400 },
    { name: 'Tire Svc', value: 300 },
    { name: 'Lockout', value: 300 },
    { name: 'Winch', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg">
                <p className="text-slate-200 font-mono text-xs">{`${label} : $${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export function AnalyticsView() {
    return (
        <div className="h-full flex flex-col overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-100 tracking-wide">ANALYTICS ENGINE</h2>
                <p className="text-xs text-slate-500 font-mono">PERFORMANCE METRICS & PREDICTIONS</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Spend Trend */}
                <div className="bg-slate-950 border border-slate-900 rounded p-4 h-80">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Spend Trend (6M)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={SPEND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Mix */}
                <div className="bg-slate-950 border border-slate-900 rounded p-4 h-80">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Service Mix</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={SERVICE_MIX_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {SERVICE_MIX_DATA.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Vendor Performance */}
                <div className="bg-slate-950 border border-slate-900 rounded p-4 h-80 lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Top Vendor Operations</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SPEND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip cursor={{ fill: '#1e293b' }} content={<CustomTooltip />} />
                            <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
