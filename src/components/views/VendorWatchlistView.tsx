import { useState, useEffect } from 'react';
import { Search, MapPin, Star, MoreHorizontal, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Event } from '../../types';
import { VendorProfile } from './VendorProfile';
import { VendorData } from '../features/EditVendorModal';

// Mock Vendor Data (Ideally this would come from a prop or context as well)
const INITIAL_VENDORS: VendorData[] = [
    {
        id: 'V-001',
        name: 'ABS Towing',
        location: 'Dallas, TX',
        address: '124 Industrial Blvd, Dallas, TX 75207',
        phone: '+1 (214) 555-0123',
        services: ['Heavy Tow', 'Flatbed', 'Winch-out'],
        rating: 4.8,
        status: 'ok',
        reliability: 98,
        joined: '2022-03-15'
    },
    {
        id: 'V-002',
        name: 'Midwest Recovery',
        location: 'Chicago, IL',
        address: '8899 W North Ave, Melrose Park, IL 60160',
        phone: '+1 (312) 555-0987',
        services: ['Tire Service', 'Jump Start', 'Lockout'],
        rating: 4.2,
        status: 'ok',
        reliability: 94,
        joined: '2023-01-10'
    },
    {
        id: 'V-003',
        name: 'QuickFix Mobile',
        location: 'Atlanta, GA',
        address: '4500 Peachtree Rd, Atlanta, GA 30319',
        phone: '+1 (404) 555-4567',
        services: ['Fuel Delivery', 'Battery Replacement', 'Diagnostics'],
        rating: 3.5,
        status: 'warn',
        reliability: 82,
        joined: '2021-11-05'
    },
    {
        id: 'V-004',
        name: 'Lone Star Tire',
        location: 'Denver, CO',
        address: '2200 Colorado Blvd, Denver, CO 80205',
        phone: '+1 (303) 555-7890',
        services: ['Tire Service', 'Alignment'],
        rating: 4.9,
        status: 'ok',
        reliability: 99,
        joined: '2023-08-20'
    },
    {
        id: 'V-005',
        name: 'Global Heavy Ops',
        location: 'Phoenix, AZ',
        address: '101 S Central Ave, Phoenix, AZ 85004',
        phone: '+1 (602) 555-3210',
        services: ['Heavy Tow', 'Rotator Service', 'Hazmat Cleanup'],
        rating: 3.1,
        status: 'crit',
        reliability: 65,
        joined: '2024-01-12'
    },
    {
        id: 'V-006',
        name: 'Metro Recovery',
        location: 'New York, NY',
        address: '500 W 30th St, New York, NY 10001',
        phone: '+1 (212) 555-6543',
        services: ['Impround', 'Parking Enforcement', 'Light Duty'],
        rating: 2.8,
        status: 'crit',
        reliability: 45,
        joined: '2024-02-01'
    },
];

interface VendorWatchlistViewProps {
    events: Event[];
    onEditEvent: (event: Event) => void;
    onDeleteEvent: (id: string) => void;
}

import { supabase } from '../../lib/supabase';

// ...

export function VendorWatchlistView({ events, onEditEvent, onDeleteEvent }: VendorWatchlistViewProps) {
    const [vendors, setVendors] = useState<VendorData[]>(INITIAL_VENDORS);
    const [filter, setFilter] = useState('');
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

    // Fetch Vendors from Supabase
    useEffect(() => {
        const fetchVendors = async () => {
            const { data: remoteVendors, error } = await supabase
                .from('vendors')
                .select('*')
                .order('name');

            if (!error) {
                if (remoteVendors && remoteVendors.length > 0) {
                    setVendors(remoteVendors);
                } else if (!localStorage.getItem('roadside_vendors_seeded')) {
                    // Seed if empty
                    setVendors(INITIAL_VENDORS);
                    localStorage.setItem('roadside_vendors_seeded', 'true');
                    // Sync initial to DB
                    await supabase.from('vendors').insert(INITIAL_VENDORS);
                } else {
                    setVendors([]);
                }
            } else {
                console.log("Vendors fetch error:", error.message);
                const saved = localStorage.getItem('roadside_vendors');
                if (saved) setVendors(JSON.parse(saved));
            }
        };
        fetchVendors();
    }, []);

    const handleUpdateVendor = async (updated: VendorData) => {
        setVendors(vendors.map(v => v.id === updated.id ? updated : v));

        // Sync to Supabase
        const { error } = await supabase
            .from('vendors')
            .update(updated)
            .eq('id', updated.id);

        if (error) {
            console.error('Error updating vendor:', error);
            // Fallback to local storage
            localStorage.setItem('roadside_vendors', JSON.stringify(vendors.map(v => v.id === updated.id ? updated : v)));
        }
    };

    // Profile View
    if (selectedVendorId) {
        const vendor = vendors.find(v => v.id === selectedVendorId);
        if (vendor) {
            return (
                <VendorProfile
                    vendor={vendor}
                    events={events}
                    onBack={() => setSelectedVendorId(null)}
                    onEditEvent={onEditEvent}
                    onDeleteEvent={onDeleteEvent}
                    onUpdateVendor={handleUpdateVendor}
                />
            );
        }
    }

    // List View
    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(filter.toLowerCase()) ||
        v.location.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-wide">VENDOR WATCHLIST</h2>
                    <p className="text-xs text-slate-500 font-mono">PREFERRED PARTNER NETWORK</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-600" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH VENDORS..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded pl-9 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
                {filteredVendors.map((vendor) => (
                    <div
                        key={vendor.id}
                        onClick={() => setSelectedVendorId(vendor.id)}
                        className="cursor-pointer bg-slate-900/50 border border-slate-800 rounded p-4 hover:border-slate-600 hover:bg-slate-900 transition-all group active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded flex items-center justify-center font-bold text-slate-950",
                                    vendor.status === 'ok' ? "bg-emerald-500" : vendor.status === 'warn' ? "bg-amber-500" : "bg-rose-500"
                                )}>
                                    {vendor.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">{vendor.name}</h3>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <MapPin size={10} />
                                        {vendor.location}
                                    </div>
                                </div>
                            </div>
                            <button className="text-slate-600 hover:text-slate-300"><MoreHorizontal size={16} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                                <span className="text-[10px] text-slate-500 block mb-1">RELIABILITY</span>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-lg font-mono font-bold",
                                        vendor.reliability > 90 ? "text-emerald-400" : vendor.reliability > 75 ? "text-amber-400" : "text-rose-400"
                                    )}>{vendor.reliability}%</span>
                                    {vendor.reliability > 90 ? <ShieldCheck size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                                </div>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800/50 hover:bg-slate-900 transition-colors">
                                <span className="text-[10px] text-slate-500 block mb-1">SERVICES</span>
                                <span className="text-xs font-mono font-bold text-slate-300">
                                    {vendor.services && vendor.services.length > 0 ? vendor.services.length : 0}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={12} className={cn(i < Math.floor(vendor.rating) ? "text-amber-400 fill-amber-400" : "text-slate-800")} />
                                ))}
                                <span className="text-xs text-slate-500 ml-1">({vendor.rating})</span>
                            </div>
                            <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">
                                ID: {vendor.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
