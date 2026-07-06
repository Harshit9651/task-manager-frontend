import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, PenTool, Trash2, CalendarDays, Search, AlertCircle, Loader2, Clock,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { useBoards } from '../lib/hooks/useBoards';
import { showToast } from '../utils/toast';
import type { BoardSummary } from '../types/board';

const formatDateLabel = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return 'Today';
  if (same(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export default function Whiteboards() {
  const navigate = useNavigate();
  const { grouped, loading, error, refetch, createBoard, deleteBoard, todayISO } = useBoards();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [boardDate, setBoardDate] = useState(todayISO());
  const [creating, setCreating] = useState(false);

  // Client-side title filter over the grouped structure.
  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    return grouped
      .map(([date, boards]) => [date, boards.filter((b) => b.title.toLowerCase().includes(q))] as [string, BoardSummary[]])
      .filter(([, boards]) => boards.length > 0);
  }, [grouped, search]);

  const openCreate = () => {
    setTitle('');
    setBoardDate(todayISO());
    setModalOpen(true);
  };

  const handleCreate = async () => {
    const name = title.trim() || `Board — ${formatDateLabel(boardDate)}`;
    setCreating(true);
    try {
      const board = await createBoard(name, boardDate);
      setModalOpen(false);
      navigate(`/app/whiteboards/${board._id}`);
    } catch {
      showToast.error('Could not create board');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteBoard(id);
      showToast.success('Board deleted');
    } catch {
      showToast.error('Could not delete board');
    }
  };

  const isEmpty = !loading && filtered.length === 0;

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Whiteboards"
        description="Sketch notes, shapes and diagrams during client calls — every board is saved by date."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            New Board
          </Button>
        }
      />

      <div className="mb-6 max-w-md">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Search boards by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <Card className="mb-5 flex items-center gap-3 border-danger-200 bg-danger-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-danger-500" />
          <span className="text-sm text-danger-700">{error}</span>
          <button onClick={() => void refetch()} className="ml-auto text-sm font-medium text-danger-600 hover:underline">Retry</button>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-ink-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading boards…
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={PenTool}
          title={search ? 'No boards match your search' : 'No boards yet'}
          description={search ? 'Try a different name.' : 'Create your first board to start sketching during calls.'}
          action={!search ? <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>New Board</Button> : undefined}
        />
      )}

      {/* Date-grouped journal */}
      <div className="space-y-8">
        {filtered.map(([date, boards]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-ink-400" />
              <h3 className="text-sm font-semibold text-ink-700">{formatDateLabel(date)}</h3>
              <span className="text-xs text-ink-400">· {boards.length} board{boards.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <motion.div key={board._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/app/whiteboards/${board._id}`)}
                    className="group cursor-pointer overflow-hidden"
                  >
                    {/* Thumbnail / placeholder */}
                    <div className="relative flex h-36 items-center justify-center border-b border-ink-100 bg-ink-25">
                      {board.thumbnail ? (
                        <img src={board.thumbnail} alt={board.title} className="h-full w-full object-cover" />
                      ) : (
                        <PenTool className="h-8 w-8 text-ink-200" />
                      )}
                      <button
                        onClick={(e) => void handleDelete(board._id, e)}
                        className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-ink-400 opacity-0 shadow-sm transition-opacity hover:text-danger-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="truncate font-medium text-ink-800">{board.title}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                        <Clock className="h-3 w-3" /> Edited {formatTime(board.updatedAt)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Board"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={creating}>Cancel</Button>
            <Button onClick={() => void handleCreate()} disabled={creating}>
              {creating ? 'Creating…' : 'Create & Open'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Board name"
            placeholder="e.g. Call with Angel's Haven"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Date</label>
            <input
              type="date"
              value={boardDate}
              onChange={(e) => setBoardDate(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            <p className="mt-1.5 text-xs text-ink-400">This board will be filed under this date in your journal.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}