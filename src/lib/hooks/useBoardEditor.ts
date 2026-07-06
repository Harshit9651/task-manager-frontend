import { useCallback, useEffect, useRef, useState } from 'react';
import boardService from '../services/board.service';
import type { Board, BoardSnapshot } from '../../types/board';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function useBoardEditor(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<BoardSnapshot | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const b = await boardService.getBoard(boardId);
        if (active) setBoard(b);
      } catch (err) {
        if (active) setError((err as Error).message || 'Failed to load board');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [boardId]);

  const flush = useCallback(async () => {
    if (!latest.current) return;
    setSaveState('saving');
    try {
      await boardService.updateBoard(boardId, { snapshot: latest.current });
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }, [boardId]);


  const scheduleSave = useCallback((snapshot: BoardSnapshot) => {
    latest.current = snapshot;
    setSaveState('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void flush(), 1200);
  }, [flush]);

  const renameBoard = useCallback(async (title: string) => {
    await boardService.updateBoard(boardId, { title });
    setBoard((prev) => (prev ? { ...prev, title } : prev));
  }, [boardId]);

  return { board, loading, error, saveState, scheduleSave, flush, renameBoard };
}