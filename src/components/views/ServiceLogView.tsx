import { useState, useMemo } from 'react';
import { ActionBar } from '../dashboard/ActionBar';
import { DataGrid } from '../dashboard/DataGrid';
import { LogEventModal } from '../features/LogEventModal';
import { Event } from '../../types';

interface ServiceLogViewProps {
    data: Event[];
    onLogEvent: (event: Event) => void;
}

export function ServiceLogView({ data, onLogEvent }: ServiceLogViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'review' | 'pending' | 'resolved'>('all');

    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;
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
    }, [data, statusFilter, searchQuery]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-wide">SERVICE LOG ARCHIVE</h2>
                    <p className="text-xs text-slate-500 font-mono">FULL HISTORY // {data.length} RECORDS</p>
                </div>
            </div>

            <ActionBar
                onLogEvent={() => setIsModalOpen(true)}
                onSearch={setSearchQuery}
                onFilterStatus={setStatusFilter}
                currentStatus={statusFilter}
            />

            <div className="flex-1 overflow-hidden flex flex-col">
                <DataGrid data={filteredData} />

                {/* Mock Pagination Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-900 pt-4 text-xs font-mono text-slate-500">
                    <span>SHOWING {filteredData.length} OF {data.length} RECORDS</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-slate-900 rounded hover:bg-slate-800 disabled:opacity-50" disabled>PREV</button>
                        <button className="px-3 py-1 bg-slate-900 rounded hover:bg-slate-800">NEXT</button>
                    </div>
                </div>
            </div>

            <LogEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(formData) => {
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
                    onLogEvent(newEvent);
                }}
            />
        </div>
    );
}
