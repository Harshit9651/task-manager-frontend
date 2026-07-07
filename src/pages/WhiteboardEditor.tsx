// src/pages/WhiteboardEditor.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tldraw, type Editor, type TLEditorSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { ArrowLeft, Check, Loader2, CloudOff, Pencil, Cloud, CalendarDays } from 'lucide-react';
import { useBoardEditor } from '../lib/hooks/useBoardEditor';
import type { BoardSnapshot } from '../types/board';

// Coerce invalid meta:undefined so v5's validator accepts older saves.
function sanitizeSnapshot(snap: Record<string, unknown>): Record<string, unknown> {
  try {
    const clone = JSON.parse(JSON.stringify(snap)) as Record<string, unknown>;
    const store = (clone.document as { store?: Record<string, { meta?: unknown }> } | undefined)?.store;
    if (store && typeof store === 'object') {
      for (const rec of Object.values(store)) {
        if (rec && typeof rec === 'object' && rec.meta === undefined) rec.meta = {};
      }
    }
    return clone;
  } catch {
    return snap;
  }
}

const formatBoardDate = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function WhiteboardEditor() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { board, loading, error, saveState, scheduleSave, flush, renameBoard } = useBoardEditor(id);

  const [editor, setEditor] = useState<Editor | null>(null);
  const [titleValue, setTitleValue] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  const loadedEditorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (board) setTitleValue(board.title);
  }, [board]);

  const handleMount = useCallback((ed: Editor) => setEditor(ed), []);

  useEffect(() => {
    if (!editor || !board) return;
    if (loadedEditorRef.current === editor) return;
    loadedEditorRef.current = editor;

    const snap = board.snapshot as Record<string, unknown> | null | undefined;
    const hasSnap = !!snap && typeof snap === 'object' && Object.keys(snap).length > 0;

    if (hasSnap) {
      try {
        editor.loadSnapshot(sanitizeSnapshot(snap) as TLEditorSnapshot);
        if (editor.getCurrentPageShapeIds().size > 0) editor.zoomToFit();
      } catch (err) {
        console.error('Snapshot load failed — starting blank:', err);
      }
    }

    const unsubscribe = editor.store.listen(
      () => {
        try {
          scheduleSave(editor.getSnapshot() as unknown as BoardSnapshot);
        } catch { /* ignore teardown */ }
      },
      { source: 'user', scope: 'document' },
    );
    return () => unsubscribe();
  }, [editor, board, scheduleSave]);

  useEffect(() => () => void flush(), [flush]);

  const commitTitle = async () => {
    setEditingTitle(false);
    const next = titleValue.trim();
    if (next && next !== board?.title) await renameBoard(next);
    else if (board) setTitleValue(board.title);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center gap-3 text-sm text-ink-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading board…
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
        <CloudOff className="h-8 w-8 text-ink-300" />
        <p className="text-sm text-ink-500">{error || 'Board not found'}</p>
        <button onClick={() => navigate('/app/whiteboards')} className="text-sm font-medium text-brand-600 hover:underline">
          Back to boards
        </button>
      </div>
    );
  }

  // Animated save pill.
  const SavePill = () => {
    const base = 'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors';
    if (saveState === 'saving') return <span className={`${base} bg-amber-50 text-amber-600`}><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving</span>;
    if (saveState === 'saved') return <span className={`${base} bg-emerald-50 text-emerald-600`}><Check className="h-3.5 w-3.5" /> Saved</span>;
    if (saveState === 'error') return <span className={`${base} bg-danger-50 text-danger-600`}><CloudOff className="h-3.5 w-3.5" /> Save failed</span>;
    return <span className={`${base} bg-ink-100 text-ink-400`}><Cloud className="h-3.5 w-3.5" /> Synced</span>;
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      {/* ClickUp-style top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            onClick={() => navigate('/app/whiteboards')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
            aria-label="Back to boards"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* gradient board dot */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-[11px] font-bold text-white shadow-sm">
            {board.title.charAt(0).toUpperCase()}
          </span>

          {editingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => void commitTitle()}
              onKeyDown={(e) => e.key === 'Enter' && void commitTitle()}
              className="min-w-0 rounded-lg border border-brand-300 px-2.5 py-1 text-sm font-semibold text-ink-900 outline-none ring-4 ring-brand-100"
            />
          ) : (
            <button onClick={() => setEditingTitle(true)} className="group flex min-w-0 items-center gap-1.5" title="Rename board">
              <span className="truncate text-sm font-semibold text-ink-900">{board.title}</span>
              <Pencil className="h-3 w-3 shrink-0 text-ink-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}

          {/* date pill */}
          <span className="hidden items-center gap-1 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500 sm:flex">
            <CalendarDays className="h-3 w-3" /> {formatBoardDate(board.boardDate)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <SavePill />
        </div>
      </div>

      {/* Canvas — untouched */}
      <div className="relative flex-1">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  );
}