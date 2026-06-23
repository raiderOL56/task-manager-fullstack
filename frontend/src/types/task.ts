export type TaskStatus = 'pending' | 'completed';

export interface Task{
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at: string;
}

export interface TaskCreate {
    title: string;
    description?: string | null;
    status: TaskStatus;
}

export interface TaskUpdate{
    title?: string;
    description?: string | null;
    status?: TaskStatus;
}