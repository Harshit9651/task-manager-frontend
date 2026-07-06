import { useCallback, useEffect, useState } from 'react';
import boardService from '../services/board.service';
import type { BoardSummary } from '../../types/board';

const todayISO = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export function useBoards() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBoards(await boardService.listBoards());
    } catch (err) {
      setError((err as Error).message || 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBoards();
  }, [fetchBoards]);

  const createBoard = useCallback(async (title: string, boardDate: string) => {
    const board = await boardService.createBoard({ title, boardDate });
    await fetchBoards();
    return board;
  }, [fetchBoards]);

  const deleteBoard = useCallback(async (id: string) => {
    await boardService.deleteBoard(id);
    setBoards((prev) => prev.filter((b) => b._id !== id));
  }, []);


  const grouped: [string, BoardSummary[]][] = (() => {
    const map = new Map<string, BoardSummary[]>();
    for (const b of boards) {
      const arr = map.get(b.boardDate);
      if (arr) arr.push(b);
      else map.set(b.boardDate, [b]);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  })();

  return { boards, grouped, loading, error, refetch: fetchBoards, createBoard, deleteBoard, todayISO };
}