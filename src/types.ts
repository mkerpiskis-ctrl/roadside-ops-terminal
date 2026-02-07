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
    notes?: string;
    reviewNotes?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'warning' | 'success' | 'system';
}
