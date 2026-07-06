import api from "./axios";
import { BoardEndpoints } from "./endpoints";

import type {
  ApiEnvelope,
  Board,
  BoardsData,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "../../types/board";

class BoardApi {
  async getAll() {
    const { data } = await api.get<ApiEnvelope<BoardsData>>(
      BoardEndpoints.list()
    );

    return data;
  }

  async getById(id: string) {
    const { data } = await api.get<ApiEnvelope<{ board: Board }>>(
      BoardEndpoints.details(id)
    );

    return data;
  }

  async create(payload: CreateBoardRequest) {
    const { data } = await api.post<ApiEnvelope<{ board: Board }>>(
      BoardEndpoints.create(),
      payload
    );

    return data;
  }

  async update(id: string, payload: UpdateBoardRequest) {
    const { data } = await api.patch<ApiEnvelope<{ board: Board }>>(
      BoardEndpoints.update(id),
      payload
    );

    return data;
  }

  async delete(id: string) {
    const { data } = await api.delete<ApiEnvelope<{ id: string }>>(
      BoardEndpoints.delete(id)
    );

    return data;
  }
}

export const boardApi = new BoardApi();

export default boardApi;