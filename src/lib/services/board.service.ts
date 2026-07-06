
import boardApi from "../api/board.api";
import type {
  Board,
  BoardSummary,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "../../types/board";


const USE_LOCAL = false;
const LS_KEY = "wb_boards_v1";

// ── localStorage fallback (only used when USE_LOCAL = true) ───────────────────
const readLocal = (): Board[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") as Board[]; }
  catch { return []; }
};
const writeLocal = (boards: Board[]) => localStorage.setItem(LS_KEY, JSON.stringify(boards));
const nowISO = () => new Date().toISOString();
const uid = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const localService = {
  async list(): Promise<BoardSummary[]> {
    return readLocal().map(({ snapshot, ...rest }) => rest).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async get(id: string): Promise<Board> {
    const board = readLocal().find((b) => b._id === id);
    if (!board) throw new Error("Board not found");
    return board;
  },
  async create(payload: CreateBoardRequest): Promise<Board> {
    const board: Board = { _id: uid(), user: "local", title: payload.title, boardDate: payload.boardDate, snapshot: null, thumbnail: null, createdAt: nowISO(), updatedAt: nowISO() };
    writeLocal([board, ...readLocal()]);
    return board;
  },
  async update(id: string, payload: UpdateBoardRequest): Promise<Board> {
    const boards = readLocal();
    const idx = boards.findIndex((b) => b._id === id);
    if (idx === -1) throw new Error("Board not found");
    boards[idx] = { ...boards[idx], ...payload, updatedAt: nowISO() };
    writeLocal(boards);
    return boards[idx];
  },
  async remove(id: string): Promise<void> {
    writeLocal(readLocal().filter((b) => b._id !== id));
  },
};

// ── API impl (real backend) ───────────────────────────────────────────────────
const apiService = {
  list: () => boardApi.getAll().then((r) => r.data.boards),
  get: (id: string) => boardApi.getById(id).then((r) => r.data.board),
  create: (payload: CreateBoardRequest) => boardApi.create(payload).then((r) => r.data.board),
  update: (id: string, payload: UpdateBoardRequest) => boardApi.update(id, payload).then((r) => r.data.board),
  remove: (id: string) => boardApi.delete(id).then(() => undefined),
};

const impl = USE_LOCAL ? localService : apiService;

class BoardService {
  listBoards() { return impl.list(); }
  getBoard(id: string) { return impl.get(id); }
  createBoard(payload: CreateBoardRequest) { return impl.create(payload); }
  updateBoard(id: string, payload: UpdateBoardRequest) { return impl.update(id, payload); }
  deleteBoard(id: string) { return impl.remove(id); }
}

const boardService = new BoardService();
export default boardService;