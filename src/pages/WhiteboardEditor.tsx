// src/pages/WhiteboardEditor.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tldraw, type Editor, type TLEditorSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { ArrowLeft, Check, Loader2, CloudOff, Pencil } from 'lucide-react';
import { useBoardEditor } from '../lib/hooks/useBoardEditor';
import type { BoardSnapshot } from '../types/board';

function sanitizeSnapshot(snap: Record<string, unknown>): Record<string, unknown> {
  try {
    const clone = JSON.parse(JSON.stringify(snap)) as Record<string, unknown>;
    const doc = clone.document as { store?: Record<string, { meta?: unknown }> } | undefined;
    const store = doc?.store;
    if (store && typeof store === 'object') {
      for (const rec of Object.values(store)) {
        if (rec && typeof rec === 'object' && rec.meta === undefined) {
          rec.meta = {};
        }
      }
    }
    return clone;
  } catch {
    return snap; // if anything goes wrong, fall back to the original
  }
}
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

  const handleMount = useCallback((ed: Editor) => {
    setEditor(ed);
  }, []);

  useEffect(() => {
    if (!editor || !board) return;
    if (loadedEditorRef.current === editor) return;
    loadedEditorRef.current = editor;

    const snap = board.snapshot as Record<string, unknown> | null | undefined;
    const hasSnap = !!snap && typeof snap === 'object' && Object.keys(snap).length > 0;

   // WhiteboardEditor.tsx — load ke andar, editor.loadSnapshot() se pehle
if (hasSnap) {
  try {

    const sanitized = sanitizeSnapshot(snap);
    editor.loadSnapshot(sanitized as TLEditorSnapshot);
    if (editor.getCurrentPageShapeIds().size > 0) editor.zoomToFit();
  } catch (err) {
    console.error('Snapshot load failed — starting blank:', err);
  }
}
    // Autosave: v5 save via the EDITOR method too -> returns { document, session }.
    const unsubscribe = editor.store.listen(
      () => {
        try {
          const snapshot = editor.getSnapshot() as unknown as BoardSnapshot;
          scheduleSave(snapshot);
        } catch {
          // ignore transient errors during teardown
        }
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
        <button onClick={() => navigate('/whiteboards')} className="text-sm font-medium text-brand-600 hover:underline">
          Back to boards
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate('/app/whiteboards')}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            <ArrowLeft className="h-4 w-4" /> Boards
          </button>
          <div className="h-5 w-px bg-ink-200" />
          {editingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => void commitTitle()}
              onKeyDown={(e) => e.key === 'Enter' && void commitTitle()}
              className="min-w-0 rounded-lg border border-ink-200 px-2.5 py-1 text-sm font-medium text-ink-900 outline-none focus:border-brand-400"
            />
          ) : (
            <button onClick={() => setEditingTitle(true)} className="group flex min-w-0 items-center gap-1.5" title="Rename board">
              <span className="truncate text-sm font-semibold text-ink-900">{board.title}</span>
              <Pencil className="h-3 w-3 shrink-0 text-ink-300 opacity-0 group-hover:opacity-100" />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-ink-400">
          {saveState === 'saving' && (<><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>)}
          {saveState === 'saved' && (<><Check className="h-3.5 w-3.5 text-success-500" /> Saved</>)}
          {saveState === 'error' && (<><CloudOff className="h-3.5 w-3.5 text-danger-500" /> <span className="text-danger-500">Save failed</span></>)}
        </div>
      </div>

      <div className="relative flex-1">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  );
}