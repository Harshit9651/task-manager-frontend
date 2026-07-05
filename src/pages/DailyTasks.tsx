import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, CheckCircle2, Circle, Trash2, Pencil, Clock, Flame } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { tasks as initialTasks } from '../data/dummyData';
import type { Task, TaskPriority } from '../types';

const priorityTone: Record<TaskPriority, 'brand' | 'warning' | 'danger'> = {
  low: 'brand',
  medium: 'warning',
  high: 'danger',
};

const emptyDraft: Omit<Task, 'id' | 'status'> = {
  title: '',
  description: '',
  dueTime: '',
  priority: 'medium',
  tag: 'Outreach',
};

export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === 'all' || t.status === filter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, filter, priorityFilter]);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setDraft({ title: task.title, description: task.description, dueTime: task.dueTime, priority: task.priority, tag: task.tag });
    setModalOpen(true);
  };

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
    );
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const saveTask = () => {
    if (!draft.title.trim()) return;
    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...draft } : t)));
    } else {
      setTasks((prev) => [
        { id: `t${Date.now()}`, status: 'pending', ...draft },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Execution"
        title="Daily Tasks"
        description="Plan your day, stay on top of follow-ups, and track completion."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Task
          </Button>
        }
      />

      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-ink-700">
            {completedCount} of {tasks.length} tasks completed
          </p>
          <span className="text-sm font-semibold text-brand-600">{progress}%</span>
        </div>
        <ProgressBar value={progress} tone="success" />
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="min-w-[140px]">
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No tasks found"
          description="Try adjusting your filters or add a new task to get started."
          action={<Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Task</Button>}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="p-4 sm:p-5" hoverable>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleStatus(task.id)} className="mt-0.5 shrink-0">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-success-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-ink-300 hover:text-brand-400 transition-colors" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`font-semibold ${task.status === 'completed' ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                          {task.title}
                        </h4>
                        <Badge tone={priorityTone[task.priority]} className="capitalize">
                          {task.priority === 'high' && <Flame className="h-3 w-3" />}
                          {task.priority}
                        </Badge>
                        <Badge tone="neutral">{task.tag}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-ink-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-ink-400">
                        <Clock className="h-3.5 w-3.5" /> {task.dueTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(task)}
                        className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg p-2 text-ink-400 hover:bg-danger-50 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Task' : 'Add New Task'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveTask}>{editingId ? 'Save Changes' : 'Add Task'}</Button>
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
