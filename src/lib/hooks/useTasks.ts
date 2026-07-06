import { useCallback, useEffect, useRef, useState } from 'react';
import taskService from '../services/task.service';
import type { ITask, TaskQuery, TaskScope, TaskStats } from '../../types/task';

interface TasksState {
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const getErrorMessage = (err: unknown): string => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? 'Failed to load tasks';
};

export function useTasks(scope: TaskScope, query: TaskQuery) {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    total: 0,
    page: query.page ?? 1,
    limit: query.limit ?? 50,
    totalPages: 1,
    loading: true,
    error: null,
  });
  const [stats, setStats] = useState<TaskStats | null>(null);

  const queryRef = useRef(query);
  queryRef.current = query;
  const reqId = useRef(0);
  const key = `${scope}:${JSON.stringify(query)}`;

  const fetchTasks = useCallback(async () => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await taskService.getTasks(scope, queryRef.current);
      if (id !== reqId.current) return; 
      const data = res.data; 
      setState({
        tasks: data.tasks,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        loading: false,
        error: null,
      });
    } catch (err) {
      if (id !== reqId.current) return;
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }));
    }
  }, [scope]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskService.getStats(); // today
      setStats(res.data.stats);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [key, fetchTasks]);

  useEffect(() => {
    if (scope === 'today') void fetchStats();
  }, [scope, fetchStats]);

  const refetch = useCallback(async () => {
    await fetchTasks();
    if (scope === 'today') await fetchStats();
  }, [fetchTasks, fetchStats, scope]);

  return { ...state, stats, refetch };
}