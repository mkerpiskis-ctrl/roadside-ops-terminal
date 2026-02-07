export interface Event {
    id: string;
    timestamp: string;
    created_at?: string; // Cloud timestamp
    status: 'resolved' | 'review' | 'pending' | 'void';
    vendor: string;
    location: string;
    type: string;
    price: number;
    satisfaction: 'good' | 'bad' | 'neutral';
    job_status?: string; // e.g. 'On Call', 'Completed', 'Cancelled'
    rating?: number; // 1-5 Star Rating
    notes?: string;
    reviewNotes?: string;
    // Financials
    total_estimate?: number | null;
    hourly_rate?: number | null;
    callout_fee?: number | null;
    cost_context?: string[]; // e.g. ['Overtime', 'Weekend', 'Heavy Duty']
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'warning' | 'success' | 'system';
}
