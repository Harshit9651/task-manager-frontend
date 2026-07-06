import taskApi from '../api/task.api';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQuery,
  TaskScope,
  TaskStatus,
} from '../../types/task';

class TaskService {
  async createTask(payload: CreateTaskRequest) {
    const body: CreateTaskRequest = {
      ...payload,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      dueTime: payload.dueTime?.trim(),
      tag: payload.tag?.trim(),
    };
    return await taskApi.create(body);
  }


  async getTasks(scope: TaskScope, query?: TaskQuery) {
    return scope === 'history' ? await taskApi.getHistory(query) : await taskApi.getAll(query);
  }

  async getStats(date?: string) {
    return await taskApi.getStats(date);
  }

  async getTask(id: string) {
    return await taskApi.getById(id);
  }

  async updateTask(id: string, payload: UpdateTaskRequest) {
    const body: UpdateTaskRequest = {
      ...payload,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      dueTime: payload.dueTime?.trim(),
      tag: payload.tag?.trim(),
    };
    return await taskApi.update(id, body);
  }


  async setStatus(id: string, status: TaskStatus) {
    return await taskApi.setStatus(id, status);
  }

  async deleteTask(id: string) {
    return await taskApi.delete(id);
  }

  async restoreTask(id: string) {
    return await taskApi.restore(id);
  }
}

const taskService = new TaskService();
export default taskService;