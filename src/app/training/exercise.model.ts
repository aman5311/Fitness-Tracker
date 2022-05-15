export interface Exercise{
    id: string;
    name: string;
    duration: number;
    calories: number;
    date?: any;
    state?: 'completed' | 'cancelled' | null;
}