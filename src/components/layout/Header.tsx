import { Bell, Search, ChevronRight } from 'lucide-react';

export function Header() {
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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold tracking-wider">SYSTEM CONNECTED</span>
                </div>

                {/* Notifications */}
                <button className="relative text-slate-400 hover:text-slate-200 transition-colors">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full border border-slate-950"></span>
                </button>

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
