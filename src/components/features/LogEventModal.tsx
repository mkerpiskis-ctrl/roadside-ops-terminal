import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, DollarSign, MapPin, Truck, PenTool } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Event } from '../../types';
import { supabase } from '../../lib/supabase';

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
        job_status: 'Completed',
        reviewNotes: ''
    });

    const [vendors, setVendors] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch vendors for autocomplete
        const fetchVendors = async () => {
            const { data } = await supabase.from('vendors').select('name, location');
            if (data) setVendors(data);
        };
        fetchVendors();

        // Click outside to close suggestions
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                category: initialData.type.includes('Tow') ? 'Roadside' : 'Roadside', // Default or map if needed
                type: initialData.type,
                location: initialData.location,
                vendor: initialData.vendor,
                price: initialData.price.toString(),
                satisfaction: initialData.satisfaction,
                flags: [],
                job_status: initialData.job_status || 'Completed',
                reviewNotes: initialData.reviewNotes || ''
            });
        } else {
            // Reset form
            setFormData({
                category: 'Roadside',
                type: 'Roadside Service',
                location: '',
                vendor: '',
                price: '',
                satisfaction: 'good',
                flags: [],
                job_status: 'On Call', // Default for new? Or Completed? User asked for On Call option.
                reviewNotes: ''
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

    const handleVendorSelect = (name: string, location?: string) => {
        setFormData(prev => ({
            ...prev,
            vendor: name,
            location: (location && !prev.location) ? location : prev.location
        }));
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Derive App Status from Job Status
        let newStatus: Event['status'] = 'resolved';
        if (formData.job_status === 'Cancelled') newStatus = 'void';
        else if (formData.job_status === 'On Call') newStatus = 'pending';
        else if (initialData?.status === 'review') newStatus = 'review'; // Keep review if already reviewing

        onSubmit({
            ...formData,
            status: newStatus
        });
        onClose();
    };

    const handleTransition = (newStatus: 'pending' | 'resolved') => {
        onSubmit({
            ...formData,
            status: newStatus
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-700 w-full max-w-2xl shadow-2xl rounded-sm flex flex-col max-h-[90vh]">

                {/* Modal Header containing Status Alert if needed */}
                <div className="flex flex-col border-b border-slate-800 bg-slate-900">
                    <div className="flex items-center justify-between px-6 py-4">
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

                    {/* Review Alert */}
                    {initialData?.status === 'review' && (
                        <div className="px-6 py-2 bg-rose-950/30 border-t border-slate-800 flex items-center gap-2 text-rose-400">
                            <AlertTriangle size={14} />
                            <span className="text-xs font-bold font-mono uppercase tracking-wide">Attention: This event requires manager review</span>
                        </div>
                    )}
                </div>

                {/* Form Content */}
                <form className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Review Notes Section (Only show if in review or has notes) */}
                    {(initialData?.status === 'review' || formData.reviewNotes) && (
                        <div className="space-y-2 bg-slate-900/50 p-4 border border-rose-900/30 rounded-sm">
                            <label className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-2">
                                Review Notes / Action Items
                            </label>
                            <textarea
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 px-3 focus:border-rose-500 outline-none font-mono min-h-[60px]"
                                placeholder="Enter notes for review..."
                                value={formData.reviewNotes}
                                onChange={e => setFormData({ ...formData, reviewNotes: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</label>
                        <div className="flex gap-3">
                            {['Roadside', 'Shop'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        "flex-1 py-2 px-3 rounded-sm border text-sm font-medium transition-all font-mono",
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

                        {/* Vendor with Autocomplete */}
                        <div className="space-y-2 relative" ref={wrapperRef}>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vendor</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 px-3 focus:border-blue-500 outline-none font-mono placeholder:text-slate-700"
                                    placeholder="Find Vendor..."
                                    value={formData.vendor}
                                    onChange={e => {
                                        setFormData({ ...formData, vendor: e.target.value });
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {showSuggestions && formData.vendor.length > 0 && (
                                    <div className="absolute z-10 w-full bg-slate-900 border border-slate-700 mt-1 rounded-sm shadow-xl max-h-48 overflow-y-auto">
                                        {vendors
                                            .filter(v => v.name.toLowerCase().includes(formData.vendor.toLowerCase()))
                                            .map(v => (
                                                <div
                                                    key={v.id}
                                                    onClick={() => handleVendorSelect(v.name, v.location)}
                                                    className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0"
                                                >
                                                    <div className="font-bold">{v.name}</div>
                                                    <div className="text-[10px] text-slate-500">{v.location}</div>
                                                </div>
                                            ))}
                                        {vendors.filter(v => v.name.toLowerCase().includes(formData.vendor.toLowerCase())).length === 0 && (
                                            <div className="px-3 py-2 text-xs text-slate-500 italic">No matches found</div>
                                        )}
                                    </div>
                                )}
                            </div>
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
                        {/* Service Status (Renamed from Outcome) */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Service Status</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-2.5 text-slate-600" size={14} />
                                <select
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-sm py-2 pl-9 pr-3 focus:border-blue-500 outline-none appearance-none font-mono"
                                    value={formData.job_status}
                                    onChange={e => setFormData({ ...formData, job_status: e.target.value })}
                                >
                                    <option>On Call</option>
                                    <option>Completed</option>
                                    <option>Completed with Issues</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Satisfaction */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Satisfaction</label>
                        <div className="flex gap-4">
                            {(['good', 'neutral', 'bad'] as const).map(sat => (
                                <div
                                    key={sat}
                                    onClick={() => setFormData({ ...formData, satisfaction: sat })}
                                    className="flex items-center gap-2 cursor-pointer group outline-none select-none"
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                                        formData.satisfaction === sat
                                            ? sat === 'good' ? "border-emerald-500 bg-emerald-500" :
                                                sat === 'bad' ? "border-rose-500 bg-rose-500" : "border-slate-400 bg-slate-400"
                                            : "border-slate-700 group-hover:border-slate-500"
                                    )}>
                                        {formData.satisfaction === sat && <CheckCircle size={10} className="text-slate-950" />}
                                    </div>
                                    <span className="text-xs font-mono uppercase text-slate-400 group-hover:text-slate-200">{sat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </form>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                    <button onClick={onClose} className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
                        CANCEL
                    </button>

                    <div className="flex gap-2">
                        {initialData?.status === 'review' ? (
                            <>
                                <button
                                    onClick={() => handleTransition('pending')}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold rounded-sm transition-all flex items-center gap-2"
                                >
                                    <CheckCircle size={14} />
                                    APPROVE TO PENDING
                                </button>
                                <button
                                    onClick={() => handleTransition('resolved')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                                >
                                    <CheckCircle size={14} />
                                    RESOLVE CASE
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
                            >
                                {initialData ? 'UPDATE ENTRY' : 'CONFIRM ENTRY'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
