export interface Event {
    id: string;
    timestamp: string;
    status: 'resolved' | 'review' | 'pending' | 'void';
    vendor: string;
    location: string;
    type: string;
    price: number;
    satisfaction: 'good' | 'bad' | 'neutral';
}
