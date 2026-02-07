import { AlertCircle, CheckCircle, Clock, XCircle, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Event } from '../../types';

interface DataGridProps {
    data: Event[];
    onEdit?: (event: Event) => void;
    onDelete?: (id: string) => void;
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

export function DataGrid({ data, onEdit, onDelete }: DataGridProps) {
    return (
        <div className="w-full border border-slate-800 rounded-sm overflow-hidden bg-slate-950">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="py-2 px-3 border-r border-slate-900 w-24">Event ID</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-32">Timestamp</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-32">Status</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-24">Ref #</th>
                            <th className="py-2 px-3 border-r border-slate-900">Vendor</th>
                            <th className="py-2 px-3 border-r border-slate-900">Location</th>
                            <th className="py-2 px-3 border-r border-slate-900">Service Type</th>
                            <th className="py-2 px-3 border-r border-slate-900 text-right w-24">Price</th>
                            <th className="py-2 px-3 w-24 text-center border-r border-slate-900">Sat.</th>
                            {(onEdit || onDelete) && <th className="py-2 px-3 w-16 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="text-xs font-mono text-slate-300">
                        {data.map((row, i) => (
                            <tr
                                key={row.id}
                                onClick={() => onEdit && onEdit(row)}
                                className={cn(
                                    "border-b border-slate-800 transition-colors cursor-pointer", // Added cursor-pointer
                                    i % 2 === 0 ? "bg-slate-900/50" : "bg-slate-950",
                                    row.satisfaction === 'bad' ? "bg-rose-950/10 hover:bg-rose-950/20" : "hover:bg-slate-800/50"
                                )}
                            >
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap font-mono text-slate-500 text-[10px]">
                                    {row.friendly_id || row.id}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap text-slate-500">
                                    {row.timestamp}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap">
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap font-mono text-blue-300">
                                    {row.ref_number || '-'}
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
                                <td className="py-2.5 px-3 text-center border-r border-slate-800">
                                    <span className={cn(
                                        "inline-block w-2 h-2 rounded-full",
                                        row.satisfaction === 'good' ? "bg-emerald-500" :
                                            row.satisfaction === 'bad' ? "bg-rose-500" : "bg-slate-600"
                                    )} />
                                </td>
                                {(onEdit || onDelete) && (
                                    <td className="py-2.5 px-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                                                    className="text-slate-500 hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}
                                                    className="text-slate-500 hover:text-rose-400 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
