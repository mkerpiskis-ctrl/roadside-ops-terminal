import React from 'react';
import { LayoutDashboard, ClipboardList, Users, BarChart3, Radio, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    alertCount?: number;
}

const SidebarItem = ({ icon: Icon, label, active, alertCount }: SidebarItemProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors text-sm font-medium mb-1",
                active
                    ? "bg-slate-900 text-blue-400 border-l-2 border-blue-500"
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{label}</span>
            </div>
            {alertCount && (
                <span className="text-xs bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded font-mono">
                    {alertCount}
                </span>
            )}
        </div>
    );
};

export function Sidebar() {
    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-900 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Brand / Logo Area */}
            <div className="h-14 flex items-center px-4 border-b border-slate-900">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <Radio className="text-white" size={18} />
                </div>
                <div>
                    <h1 className="text-slate-100 font-bold text-sm tracking-wider">ROADSIDE<span className="text-blue-500">OPS</span></h1>
                    <p className="text-[10px] text-slate-500 font-mono tracking-tighter">TERMINAL v5.0</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
                <div className="mb-6">
                    <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Main Module</p>
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={ClipboardList} label="Service Log" alertCount={3} />
                    <SidebarItem icon={Users} label="Vendor Watchlist" />
                    <SidebarItem icon={BarChart3} label="Analytics" />
                </div>

                <div>
                    <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Watchlist</p>
                    <div className="space-y-1">
                        {[
                            { name: "ABS Towing", status: "ok", loc: "TX" },
                            { name: "QuickFix", status: "warn", loc: "AL" },
                            { name: "Metro Recovery", status: "crit", loc: "NY" }
                        ].map((vendor, i) => (
                            <div key={i} className="px-3 py-2 rounded hover:bg-slate-900/50 cursor-pointer group">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-xs text-slate-300 group-hover:text-white font-mono">{vendor.name}</span>
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        vendor.status === 'ok' ? "bg-emerald-500" : vendor.status === 'warn' ? "bg-amber-500" : "bg-rose-500"
                                    )} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500">{vendor.loc}</span>
                                    <span className="text-[10px] text-slate-600 group-hover:text-slate-400 font-mono tracking-tighter">REL: 9{8 - i}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="p-4 border-t border-slate-900 bg-slate-950">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <ShieldAlert size={14} />
                    <span className="text-[10px] font-mono">SECURE CONNECTION</span>
                </div>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 w-full h-full opacity-50"></div>
                </div>
            </div>
        </aside>
    );
}
