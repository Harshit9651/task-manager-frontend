// src/pages/Whiteboards.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, PenTool, Trash2, CalendarDays, Search, AlertCircle, Loader2, Clock,
  ArrowUpRight, LayoutGrid, Sparkles,
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

// Each board gets a stable, colorful cover — ClickUp's boards feel lively, not grey.
const COVERS = [
  { grad: 'from-violet-500 to-purple-600', soft: 'bg-violet-500' },
  { grad: 'from-sky-500 to-blue-600', soft: 'bg-sky-500' },
  { grad: 'from-amber-400 to-orange-500', soft: 'bg-amber-500' },
  { grad: 'from-emerald-500 to-teal-600', soft: 'bg-emerald-500' },
  { grad: 'from-rose-500 to-pink-600', soft: 'bg-rose-500' },
  { grad: 'from-indigo-500 to-blue-600', soft: 'bg-indigo-500' },
  { grad: 'from-fuchsia-500 to-purple-600', soft: 'bg-fuchsia-500' },
  { grad: 'from-cyan-500 to-teal-600', soft: 'bg-cyan-500' },
];
const coverFor = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVERS[h % COVERS.length];
};

export default function Whiteboards() {
  const navigate = useNavigate();
  const { grouped, loading, error, refetch, createBoard, deleteBoard, todayISO } = useBoards();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [boardDate, setBoardDate] = useState(todayISO());
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    return grouped
      .map(([date, boards]) => [date, boards.filter((b) => b.title.toLowerCase().includes(q))] as [string, BoardSummary[]])
      .filter(([, boards]) => boards.length > 0);
  }, [grouped, search]);

  const totalBoards = useMemo(() => grouped.reduce((s, [, b]) => s + b.length, 0), [grouped]);
  const activeDays = grouped.length;
  const todaysCount = grouped.find(([d]) => d === todayISO())?.[1].length ?? 0;

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

      {/* Stat pills — ClickUp-style quick metrics */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:max-w-lg">
        {[
          { icon: LayoutGrid, label: 'Total boards', value: totalBoards, tint: 'text-violet-600 bg-violet-50' },
          { icon: CalendarDays, label: 'Active days', value: activeDays, tint: 'text-sky-600 bg-sky-50' },
          { icon: Sparkles, label: 'Today', value: todaysCount, tint: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-3 px-4 py-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tint}`}>
              <s.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-lg font-bold leading-none text-ink-900">{s.value}</p>
              <p className="mt-1 text-xs text-ink-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

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

      {/* Date-grouped journal with a timeline rail */}
      <div className="space-y-8">
        {filtered.map(([date, boards]) => (
          <div key={date} className="relative">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-4 ring-violet-50/40">
                <CalendarDays className="h-4 w-4" />
              </span>
              <h3 className="text-[15px] font-bold text-ink-900">{formatDateLabel(date)}</h3>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-500">
                {boards.length} board{boards.length > 1 ? 's' : ''}
              </span>
              <div className="ml-1 h-px flex-1 bg-gradient-to-r from-ink-100 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => {
                const cover = coverFor(board._id);
                return (
                  <motion.div key={board._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/app/whiteboards/${board._id}`)}
                      className="group relative cursor-pointer overflow-hidden !p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Colorful cover with a subtle grid/doodle overlay */}
                      <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${cover.grad}`}>
                        {board.thumbnail ? (
                          <img src={board.thumbnail} alt={board.title} className="h-full w-full object-cover" />
                        ) : (
                          <>
                            {/* dotted-grid pattern -> reads as a whiteboard */}
                            <div
                              className="absolute inset-0 opacity-30"
                              style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
                                backgroundSize: '16px 16px',
                              }}
                            />
                            <PenTool className="absolute left-4 top-4 h-6 w-6 text-white/70" />
                          </>
                        )}
                        {/* hover actions */}
                        <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-all group-hover:opacity-100">
                          <button
                            onClick={(e) => void handleDelete(board._id, e)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-ink-400 shadow-sm backdrop-blur transition-colors hover:text-danger-500"
                            aria-label="Delete board"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {/* open affordance */}
                        <div className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-lg bg-white/95 text-ink-700 opacity-0 shadow-md backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${cover.soft}`} />
                          <p className="truncate font-semibold text-ink-800">{board.title}</p>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
                          <Clock className="h-3 w-3" /> Edited {formatTime(board.updatedAt)}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
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