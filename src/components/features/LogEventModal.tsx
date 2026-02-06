import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, DollarSign, MapPin, Truck, PenTool } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Event } from '../../types';

interface LogEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: Event | null;
}

const SERVICE_TYPES = [
    'Heavy Tow', 'Winch-out', 'Roadside Service', 'Tire Service',
    'Fuel Delivery', 'Lockout', 'Load Shift', 'Other'
];

const FLAGS = [
    'After-hours', 'Accident Recovery', 'Police/DOT',
    'Waiting Time', 'Parts Run', 'Extra Equipment'
];

export function LogEventModal({ isOpen, onClose, onSubmit, initialData }: LogEventModalProps) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        category: 'Roadside',
        type: 'Roadside Service',
        location: '',
        vendor: '',
        price: '',
        satisfaction: 'good',
        flags: [] as string[],
        outcome: 'Completed'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                category: 'Roadside', // Default or derive from type if stored
                type: initialData.type,
                location: initialData.location,
                vendor: initialData.vendor,
                price: initialData.price.toString(),
                satisfaction: initialData.satisfaction,
                flags: [], // Would need to be stored in Event if relevant
                outcome: initialData.status === 'resolved' ? 'Completed' : 'Completed with Issues'
            });
        } else {
            // Reset form for new entry
            setFormData({
                category: 'Roadside',
                type: 'Roadside Service',
                location: '',
                vendor: '',
                price: '',
                satisfaction: 'good',
                flags: [],
                outcome: 'Completed'
            });
        }
    }, [initialData, isOpen]);

    const toggleFlag = (flag: string) => {
        setFormData(prev => ({
            ...prev,
            flags: prev.flags.includes(flag)
                ? prev.flags.filter(f => f !== flag)
                : [...prev.flags, flag]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-700 w-full max-w-2xl shadow-2xl rounded-sm flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
                    <div className="flex items-center gap-2">
                        <PenTool size={16} className="text-blue-500" />
                        <span className="font-mono font-bold text-slate-100 uppercase tracking-wider">
                            {initialData ? 'Edit Service Event' : 'Log New Service Event'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Tow', 'Roadside', 'Shop'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        "py-2 px-3 rounded-sm border text-sm font-medium transition-all font-mono",
                                        formData.category === cat
                                            ? "bg-slate-100 text-slate-950 border-white"
                                            : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Service Type</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-2.5 text-slate-600" size={14} />
                                <select
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 pl-9 pr-3 focus:border-blue-500 outline-none appearance-none font-mono"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Vendor */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vendor</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 px-3 focus:border-blue-500 outline-none font-mono placeholder:text-slate-700"
                                placeholder="Find Vendor..."
                                value={formData.vendor}
                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-slate-600" size={14} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 pl-9 pr-3 focus:border-blue-500 outline-none font-mono"
                                    placeholder="City, State"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Cost (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 text-slate-600" size={14} />
                                <input
                                    type="number"
                                    className={cn(
                                        "w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 pl-9 pr-3 focus:border-blue-500 outline-none font-mono font-bold",
                                        Number(formData.price) > 1000 ? "text-rose-400" : ""
                                    )}
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-800" />

                    {/* Flags */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cost Context Flags</label>
                        <div className="flex flex-wrap gap-2">
                            {FLAGS.map(flag => (
                                <button
                                    key={flag}
                                    type="button"
                                    onClick={() => toggleFlag(flag)}
                                    className={cn(
                                        "text-[10px] uppercase px-2 py-1 rounded-full border transition-colors font-mono tracking-tight",
                                        formData.flags.includes(flag)
                                            ? "bg-blue-900/50 text-blue-300 border-blue-800"
                                            : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    {flag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Satisfaction Toggle */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Satisfaction</label>
                            <div className="flex border border-slate-800 rounded-sm overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satisfaction: 'good' })}
                                    className={cn(
                                        "flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold font-mono transition-colors",
                                        formData.satisfaction === 'good' ? "bg-emerald-900/50 text-emerald-400" : "bg-slate-900 text-slate-600 hover:bg-slate-800"
                                    )}
                                >
                                    <CheckCircle size={14} /> GOOD
                                </button>
                                <div className="w-px bg-slate-800"></div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satisfaction: 'bad' })}
                                    className={cn(
                                        "flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold font-mono transition-colors",
                                        formData.satisfaction === 'bad' ? "bg-rose-900/50 text-rose-400" : "bg-slate-900 text-slate-600 hover:bg-slate-800"
                                    )}
                                >
                                    <AlertTriangle size={14} /> BAD
                                </button>
                            </div>
                        </div>

                        {/* Outcome */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Outcome</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 px-3 focus:border-blue-500 outline-none appearance-none font-mono"
                                value={formData.outcome}
                                onChange={e => setFormData({ ...formData, outcome: e.target.value })}
                            >
                                <option value="Completed">Completed</option>
                                <option value="Completed with Issues">Completed w/ Issues</option>
                                <option value="No-show">No-show</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                </form>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 rounded-b-sm">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        CANCEL [ESC]
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit} // Trigger form submit logic
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
                    >
                        {initialData ? 'UPDATE ENTRY' : 'CONFIRM ENTRY'}
                    </button>
                </div>
            </div>
        </div>
    );
}
