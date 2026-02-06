import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock Data structure
interface Event {
    id: string;
    timestamp: string;
    status: 'resolved' | 'review' | 'pending' | 'void';
    vendor: string;
    location: string;
    type: string;
    price: number;
    satisfaction: 'good' | 'bad' | 'neutral';
}

interface DataGridProps {
    data: Event[];
}

const StatusBadge = ({ status }: { status: Event['status'] }) => {
    switch (status) {
        case 'resolved':
            return <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold"><CheckCircle size={12} /> Resolved</span>;
        case 'review':
            return <span className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase font-bold"><AlertCircle size={12} /> Review</span>;
        case 'pending':
            return <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase font-bold"><Clock size={12} /> Pending</span>;
        case 'void':
            return <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold"><XCircle size={12} /> Void</span>;
    }
};

export function DataGrid({ data }: DataGridProps) {
    return (
        <div className="w-full border border-slate-800 rounded-sm overflow-hidden bg-slate-950">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="py-2 px-3 border-r border-slate-900 w-32">Timestamp</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-32">Status</th>
                            <th className="py-2 px-3 border-r border-slate-900">Vendor</th>
                            <th className="py-2 px-3 border-r border-slate-900">Location</th>
                            <th className="py-2 px-3 border-r border-slate-900">Service Type</th>
                            <th className="py-2 px-3 border-r border-slate-900 text-right w-24">Price</th>
                            <th className="py-2 px-3 w-24 text-center">Sat.</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-mono text-slate-300">
                        {data.map((row, i) => (
                            <tr
                                key={row.id}
                                className={cn(
                                    "border-b border-slate-800 hover:bg-slate-800/50 transition-colors",
                                    i % 2 === 0 ? "bg-slate-900/50" : "bg-slate-950",
                                    row.satisfaction === 'bad' && "bg-rose-950/10 hover:bg-rose-950/20"
                                )}
                            >
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap text-slate-500">
                                    {row.timestamp}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap">
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] font-sans text-slate-200">
                                    {row.vendor}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap overflow-hidden text-ellipsis font-sans text-slate-400">
                                    {row.location}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap text-slate-300">
                                    {row.type}
                                </td>
                                <td className={cn(
                                    "py-2.5 px-3 border-r border-slate-800 whitespace-nowrap text-right font-bold",
                                    row.price > 1000 ? "text-rose-400" : "text-emerald-400"
                                )}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.price)}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                    <span className={cn(
                                        "inline-block w-2 h-2 rounded-full",
                                        row.satisfaction === 'good' ? "bg-emerald-500" :
                                            row.satisfaction === 'bad' ? "bg-rose-500" : "bg-slate-600"
                                    )} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
