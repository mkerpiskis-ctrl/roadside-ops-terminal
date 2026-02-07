import { useState, useEffect } from 'react';
import { X, Save, Plus, XCircle } from 'lucide-react';


export interface VendorData {
    id: string;
    name: string;
    location: string;
    rating: number;
    status: string;
    joined: string;
    reliability: number;
    // New Fields
    address?: string;
    phone?: string;
    services?: string[];
}

interface EditVendorModalProps {
    vendor: VendorData;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedVendor: VendorData) => void;
}

export function EditVendorModal({ vendor, isOpen, onClose, onSave }: EditVendorModalProps) {
    const [formData, setFormData] = useState<VendorData>(vendor);
    const [newService, setNewService] = useState('');

    useEffect(() => {
        setFormData(vendor);
    }, [vendor, isOpen]);

    if (!isOpen) return null;

    const handleAddService = () => {
        if (newService.trim()) {
            setFormData(prev => ({
                ...prev,
                services: [...(prev.services || []), newService.trim()]
            }));
            setNewService('');
        }
    };

    const handleRemoveService = (serviceToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            services: (prev.services || []).filter(s => s !== serviceToRemove)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        Edit Vendor Profile
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {vendor.id}
                        </span>
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Company Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone Number</label>
                            <input
                                type="text"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Address</label>
                        <input
                            type="text"
                            value={formData.address || ''}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Service Rd, City, State ZIP"
                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Services Provided</label>

                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newService}
                                onChange={e => setNewService(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddService()}
                                placeholder="Add service (e.g. Heavy Tow)"
                                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={handleAddService}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-900/30 rounded border border-slate-900/50">
                            {formData.services?.map(service => (
                                <span key={service} className="flex items-center gap-1 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-full border border-slate-700">
                                    {service}
                                    <button onClick={() => handleRemoveService(service)} className="text-slate-400 hover:text-rose-400">
                                        <XCircle size={12} />
                                    </button>
                                </span>
                            ))}
                            {(!formData.services || formData.services.length === 0) && (
                                <span className="text-xs text-slate-600 italic px-1">No services listed</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-900 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded text-xs font-bold transition-colors uppercase tracking-wider shadow-lg shadow-blue-900/20"
                    >
                        <Save size={14} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
