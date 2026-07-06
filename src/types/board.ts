export type BoardSnapshot = Record<string, unknown>;

export interface BoardSummary {
  _id: string;
  user: string;
  title: string;
  boardDate: string;
  thumbnail?: string | null; 
  createdAt: string;
  updatedAt: string;
}


export interface Board extends BoardSummary {
  snapshot?: BoardSnapshot | null;
}

export interface CreateBoardRequest {
  title: string;
  boardDate: string; // YYYY-MM-DD
}

export interface UpdateBoardRequest {
  title?: string;
  snapshot?: BoardSnapshot;
  thumbnail?: string | null;
}

export interface BoardsData {
  boards: BoardSummary[];
  total: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}