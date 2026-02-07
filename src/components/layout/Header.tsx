import { Bell, Search, ChevronRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Notification } from '../../types';
import { cn } from '../../lib/utils';

interface HeaderProps {
    notifications?: Notification[];
    onClearNotifications?: () => void;
    connectionStatus?: 'connecting' | 'online' | 'offline' | 'error';
}

export function Header({ notifications = [], onClearNotifications, connectionStatus = 'online' }: HeaderProps) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const unreadCount = notifications.length;

    return (
        <header className="h-14 fixed top-0 left-64 right-0 bg-slate-950 border-b border-slate-900 z-40 flex items-center justify-between px-6">
            {/* Left: Breadcrumbs / Pager */}
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-slate-500 font-mono">
                    <span>SYS</span>
                    <ChevronRight size={14} />
                    <span>OPS</span>
                    <ChevronRight size={14} />
                </div>
                <span className="text-slate-200 font-semibold tracking-wide">DASHBOARD_OVERVIEW</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/50 font-mono ml-2">
                    LIVE
                </span>
            </div>

            {/* Center: Search (Optional global command palette) */}
            <div className="absolute left-1/2 -translate-x-1/2 w-96 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full bg-slate-900/50 border border-slate-800 text-slate-300 text-xs rounded-sm py-1.5 pl-9 pr-3 focus:outline-none focus:border-blue-700 focus:bg-slate-900 transition-all font-mono placeholder:text-slate-600"
                        placeholder="CMD+K TO SEARCH..."
                    />
                </div>
            </div>

            {/* Right: Status & User */}
            <div className="flex items-center gap-6">
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className={cn(
                            "absolute inline-flex h-full w-full rounded-full opacity-75",
                            connectionStatus === 'online' ? "animate-ping bg-emerald-400" :
                                connectionStatus === 'connecting' ? "animate-pulse bg-blue-400" :
                                    "bg-rose-400"
                        )}></span>
                        <span className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            connectionStatus === 'online' ? "bg-emerald-500" :
                                connectionStatus === 'connecting' ? "bg-blue-500" :
                                    "bg-rose-500"
                        )}></span>
                    </span>
                    <span className={cn(
                        "text-[10px] font-mono font-bold tracking-wider",
                        connectionStatus === 'online' ? "text-emerald-500" :
                            connectionStatus === 'connecting' ? "text-blue-500" :
                                "text-rose-500"
                    )}>
                        {connectionStatus === 'online' ? 'SYSTEM ONLINE' :
                            connectionStatus === 'connecting' ? 'SYNCING...' :
                                'OFFLINE (MOCK DATA)'}
                    </span>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        className={cn(
                            "relative text-slate-400 hover:text-slate-200 transition-colors",
                            isNotifOpen && "text-slate-100"
                        )}
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-slate-900/50">
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Notifications</span>
                                <button
                                    onClick={onClearNotifications}
                                    className="text-[10px] text-slate-500 hover:text-slate-300 uppercase font-mono"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-600 italic">No new notifications</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className="p-3 border-b border-slate-900 hover:bg-slate-900/30 transition-colors flex gap-3">
                                            <div className="mt-0.5">
                                                {n.type === 'success' ? <CheckCircle size={14} className="text-emerald-500" /> :
                                                    n.type === 'warning' ? <AlertTriangle size={14} className="text-amber-500" /> :
                                                        <Info size={14} className="text-blue-500" />}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-300">{n.title}</h4>
                                                <p className="text-[10px] text-slate-500 leading-relaxed">{n.message}</p>
                                                <span className="text-[9px] text-slate-600 font-mono mt-1 block">{n.timestamp}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-900">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-200 font-medium">L. KOWALSKI</div>
                        <div className="text-[10px] text-slate-500 font-mono">DISPATCH_L1</div>
                    </div>
                    <div className="h-8 w-8 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                        LK
                    </div>
                </div>
            </div>
        </header>
    );
}
