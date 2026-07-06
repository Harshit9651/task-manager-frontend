import api from "./axios";
import Endpoints from "./endpoints";

import type {
  ApiEnvelope,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQuery,
  TaskStatus,
  TasksData,
  TaskStats,
  ITask,
} from "../../types/task";

class TaskApi {
  async create(payload: CreateTaskRequest) {
    const { data } = await api.post<ApiEnvelope<{ task: ITask }>>(
      Endpoints.tasks.create(),
      payload
    );

    return data;
  }

  async getAll(query?: TaskQuery) {
    const { data } = await api.get<ApiEnvelope<TasksData>>(
      Endpoints.tasks.list(),
      {
        params: query,
      }
    );

    return data;
  }

  async getHistory(query?: TaskQuery) {
    const { data } = await api.get<ApiEnvelope<TasksData>>(
      Endpoints.tasks.history(),
      {
        params: query,
      }
    );

    return data;
  }

  async getStats(date?: string) {
    const { data } = await api.get<ApiEnvelope<{ stats: TaskStats }>>(
      Endpoints.tasks.stats(),
      {
        params: date ? { date } : undefined,
      }
    );

    return data;
  }

  async getById(id: string) {
    const { data } = await api.get<ApiEnvelope<{ task: ITask }>>(
      Endpoints.tasks.details(id)
    );

    return data;
  }

  async update(id: string, payload: UpdateTaskRequest) {
    const { data } = await api.patch<ApiEnvelope<{ task: ITask }>>(
      Endpoints.tasks.update(id),
      payload
    );

    return data;
  }

  async setStatus(id: string, status: TaskStatus) {
    const { data } = await api.patch<ApiEnvelope<{ task: ITask }>>(
      Endpoints.tasks.status(id),
      { status }
    );

    return data;
  }

  async delete(id: string) {
    const { data } = await api.delete<ApiEnvelope<{ id: string }>>(
      Endpoints.tasks.delete(id)
    );

    return data;
  }

  async restore(id: string) {
    const { data } = await api.patch<ApiEnvelope<{ task: ITask }>>(
      Endpoints.tasks.restore(id)
    );

    return data;
  }
}

export const taskApi = new TaskApi();

export default taskApi;