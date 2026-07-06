import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, CheckCircle2, Circle, Trash2, Pencil, Clock, Flame,
  History, CalendarDays, AlertCircle, Loader2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { TaskModel } from '../models/task.model';
import { useTasks } from '../lib/hooks/useTasks';
import taskService from '../lib/services/task.service';
import { showToast } from '../utils/toast';
import type { CreateTaskRequest, ITask, TaskPriority, TaskQuery, TaskScope } from '../types/task';

type Draft = Pick<CreateTaskRequest, 'title' | 'description' | 'dueTime' | 'priority' | 'tag'>;

const emptyDraft: Draft = {
  title: '',
  description: '',
  dueTime: '',
  priority: 'medium',
  tag: 'Outreach',
};

const PAGE_LIMIT = 100; 
export default function DailyTasks() {
  const [mode, setMode] = useState<TaskScope>('today');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [historyDate, setHistoryDate] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);


  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const query: TaskQuery = useMemo(
    () => ({
      page: 1,
      limit: PAGE_LIMIT,
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
      date: mode === 'history' && historyDate ? historyDate : undefined,
      sortBy: 'date',
      sortOrder: 'desc',
    }),
    [search, statusFilter, priorityFilter, mode, historyDate],
  );

  const { tasks, stats, loading, error, refetch } = useTasks(mode, query);

  const isHistory = mode === 'history';
  const historyGroups = useMemo(() => (isHistory ? TaskModel.groupByDate(tasks) : []), [isHistory, tasks]);


  const completedCount = stats?.completed ?? 0;
  const totalCount = stats?.total ?? 0;
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEdit = (task: ITask) => {
    setEditingId(task._id);
    setDraft({
      title: task.title,
      description: task.description ?? '',
      dueTime: task.dueTime ?? '',
      priority: task.priority,
      tag: task.tag,
    });
    setModalOpen(true);
  };

  const saveTask = async () => {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await taskService.updateTask(editingId, draft);
        showToast.success('Task updated');
      } else {
        await taskService.createTask(draft); 
        showToast.success('Task created');
      }
      setModalOpen(false);
      await refetch();
    } catch (err) {
      console.error(err);
      showToast.error(editingId ? 'Could not update task' : 'Could not create task');
    } finally {
      setSaving(false);
    }
  };

 
  const toggleStatus = async (task: ITask) => {
    setTogglingId(task._id);
    const next = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await taskService.setStatus(task._id, next);
      await refetch();
    } catch (err) {
      console.error(err);
      showToast.error('Could not update status');
    } finally {
      setTogglingId(null);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      showToast.success('Task deleted');
      await refetch();
    } catch (err) {
      console.error(err);
      showToast.error('Could not delete task');
    }
  };

  
  const renderTask = (raw: ITask, readOnly: boolean) => {
    const task = TaskModel.from(raw);
    const busy = togglingId === raw._id;
    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="p-4 sm:p-5" hoverable={!readOnly}>
          <div className="flex items-start gap-4">
            {readOnly ? (
              <span className="mt-0.5 shrink-0" title={task.isCompleted ? 'Completed' : 'Not completed'}>
                {task.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-success-500" />
                ) : (
                  <Circle className="h-6 w-6 text-ink-300" />
                )}
              </span>
            ) : (
              <button onClick={() => void toggleStatus(raw)} disabled={busy} className="mt-0.5 shrink-0 disabled:opacity-50">
                {busy ? (
                  <Loader2 className="h-6 w-6 animate-spin text-ink-300" />
                ) : task.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-success-500" />
                ) : (
                  <Circle className="h-6 w-6 text-ink-300 transition-colors hover:text-brand-400" />
                )}
              </button>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={`font-semibold ${task.isCompleted ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                  {task.title}
                </h4>
                <Badge tone={task.priorityTone} className="capitalize">
                  {task.isHighPriority && <Flame className="h-3 w-3" />}
                  {task.priority}
                </Badge>
                <Badge tone="neutral">{task.tag}</Badge>
              </div>
              {task.description && <p className="mt-1 text-sm text-ink-500">{task.description}</p>}
              {task.dueTime && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
                  <Clock className="h-3.5 w-3.5" /> {task.dueTime}
                </div>
              )}
            </div>

            {!readOnly && (
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => openEdit(raw)}
                  className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => void deleteTask(raw._id)}
                  className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow="Execution"
        title="Daily Tasks"
        description="Plan your day, stay on top of follow-ups, and track completion."
        actions={
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl border border-ink-200 bg-ink-100 p-1">
              <button
                onClick={() => setMode('today')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  !isHistory ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setMode('history')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isHistory ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                <History className="h-3.5 w-3.5" /> History
              </button>
            </div>
            {!isHistory && (
              <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
                Add Task
              </Button>
            )}
          </div>
        }
      />

      {/* Progress (Today only) */}
      {!isHistory && (
        <Card className="mb-6 p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-700">
              {completedCount} of {totalCount} tasks completed
            </p>
            <span className="text-sm font-semibold text-brand-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone="success" />
        </Card>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        {isHistory && (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              icon={<CalendarDays className="h-4 w-4" />}
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              className="sm:w-[190px]"
            />
            {historyDate && (
              <button
                onClick={() => setHistoryDate('')}
                className="whitespace-nowrap text-xs font-medium text-ink-400 hover:text-ink-700"
              >
                All dates
              </button>
            )}
          </div>
        )}
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={isHistory ? 'Search past tasks...' : 'Search tasks...'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="min-w-[140px]">
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)} className="min-w-[140px]">
            <option value="all">All priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>


      {error && (
        <Card className="mb-5 flex items-center gap-3 border-danger-200 bg-danger-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-danger-500" />
          <span className="text-sm text-danger-700">{error}</span>
          <button onClick={() => void refetch()} className="ml-auto text-sm font-medium text-danger-600 hover:underline">
            Retry
          </button>
        </Card>
      )}


      {loading && tasks.length === 0 && !error && (
        <Card className="p-10 text-center text-sm text-ink-400">Loading tasks…</Card>
      )}

   
      {!isHistory && !loading && tasks.length === 0 && !error && (
        <EmptyState
          icon={CheckCircle2}
          title="No tasks found"
          description="Try adjusting your filters or add a new task to get started."
          action={<Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Task</Button>}
        />
      )}
      {!isHistory && tasks.length > 0 && (
        <div className={`space-y-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <AnimatePresence initial={false}>{tasks.map((t) => renderTask(t, false))}</AnimatePresence>
        </div>
      )}

     
      {isHistory && (
        <>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-25 px-4 py-3 text-sm text-ink-500">
            <History className="h-4 w-4 shrink-0 text-ink-400" />
            Viewing past tasks — read only.{' '}
            {historyDate ? `Showing ${TaskModel.formatDateLabel(historyDate)}.` : 'Pick a date to narrow the results.'}
          </div>

          {!loading && historyGroups.length === 0 && !error ? (
            <EmptyState
              icon={History}
              title="No past tasks"
              description={historyDate ? 'No tasks found for this date.' : 'Completed and past tasks will appear here.'}
            />
          ) : (
            <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
              {historyGroups.map(([date, items]) => (
                <div key={date}>
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-ink-400" />
                    <h3 className="text-sm font-semibold text-ink-700">{TaskModel.formatDateLabel(date)}</h3>
                    <span className="text-xs text-ink-400">· {items.length} task{items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-3">{items.map((t) => renderTask(t, true))}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

   
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Task' : 'Add New Task'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={() => void saveTask()} disabled={saving}>
              {saving ? (editingId ? 'Saving…' : 'Adding…') : editingId ? 'Save Changes' : 'Add Task'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task title"
            placeholder="e.g. Follow up with Nimbus Retail"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <Input
            label="Description"
            placeholder="Add details (optional)"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due time"
              placeholder="e.g. 02:30 PM"
              value={draft.dueTime}
              onChange={(e) => setDraft((d) => ({ ...d, dueTime: e.target.value }))}
            />
            <Select
              label="Priority"
              value={draft.priority}
              onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as TaskPriority }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <Input
            label="Tag"
            placeholder="e.g. Outreach, Sales, CRM"
            value={draft.tag}
            onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}