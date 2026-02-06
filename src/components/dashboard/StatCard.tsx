import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ label, value, trend, className }: StatCardProps) {
    return (
        <div className={cn("bg-slate-900 border border-slate-800 p-4 rounded-sm flex flex-col justify-between h-24 relative overflow-hidden group", className)}>
            <div className="flex justify-between items-start z-10">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                {trend && (
                    <div className={cn("flex items-center text-xs font-mono", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
                        {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>

            <div className="z-10 mt-auto">
                <span className="text-2xl font-mono font-bold text-slate-100 tracking-tight block">
                    {value}
                </span>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </div>
    );
}
