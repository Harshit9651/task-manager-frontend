export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  _id: string;
  user: string;
  title: string;
  description?: string;
  dueTime?: string;
  priority: TaskPriority;
  tag: string;
  status: TaskStatus;
  date: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueTime?: string;
  priority?: TaskPriority;
  tag?: string;
  status?: TaskStatus;
  date?: string; 
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

export type TaskScope = 'today' | 'history';

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  date?: string; 
  sortBy?: 'date' | 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TasksData {
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  high: number;
  medium: number;
  low: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}