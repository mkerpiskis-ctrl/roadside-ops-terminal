import { Search, Filter, Plus, ChevronDown } from 'lucide-react';

interface ActionBarProps {
    onLogEvent: () => void;
}

export function ActionBar({ onLogEvent }: ActionBarProps) {
    return (
        <div className="flex items-center justify-between bg-slate-950 border-b border-t border-slate-900 py-3 mb-6">
            {/* Search Input */}
            <div className="relative w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-600" />
                </div>
                <input
                    type="text"
                    className="block w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-sm py-2 pl-10 pr-3 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-900 transition-all font-mono placeholder:text-slate-600"
                    placeholder="SEARCH TERMINAL (REF, VIN, VENDOR)..."
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Filters Dropdown (Mock) */}
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono hover:text-slate-200 hover:border-slate-700 transition-colors rounded-sm">
                    <Filter size={14} />
                    <span>FILTER: ALL</span>
                    <ChevronDown size={14} />
                </button>

                <div className="h-6 w-px bg-slate-800 mx-2"></div>

                {/* Log Event Button */}
                <button
                    onClick={onLogEvent}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-950 text-xs font-bold hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all rounded-sm tracking-wide"
                >
                    <Plus size={16} />
                    <span>LOG EVENT</span>
                </button>
            </div>
        </div>
    );
}
