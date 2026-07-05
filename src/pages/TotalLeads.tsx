// pages/TotalLeads.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MoreHorizontal, ChevronLeft, ChevronRight, ChevronDown, Check,
  Trash2, Eye, Pencil, CalendarClock, Users, AlertCircle, Loader2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import { LeadModel } from '../models/lead.model';
import { useLeads } from '../lib/hooks/useLeads';
import leadService from '../lib/services/lead.service';
import { showToast } from '../utils/toast';
import type { ILead, LeadQuery, LeadStatus, LeadTemperature } from '../types/lead';

const PAGE_SIZE = 6;

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow up' },
  { value: 'meeting_scheduled', label: 'Meeting scheduled' },
  { value: 'proposal_sent', label: 'Proposal sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
   { value: "converted_to_client", label: "Converted to Client" },
];

const SORTS = {
  newest: { sortBy: 'createdAt', sortOrder: 'desc' },
  oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
  company: { sortBy: 'company', sortOrder: 'asc' },
  name: { sortBy: 'contactName', sortOrder: 'asc' },
} as const;
type SortKey = keyof typeof SORTS;

function pageWindow(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '...')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('...');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('...');
  out.push(total);
  return out;
}

export default function TotalLeads() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [tempFilter, setTempFilter] = useState<'all' | LeadTemperature>('all');
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ILead | null>(null);

  // Single popover at a time: which row + which menu.
  const [popover, setPopover] = useState<{ id: string; kind: 'status' | 'actions' } | null>(null);
  // Optimistic status while a save is in flight.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, LeadStatus>>({});
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);

  // Debounce the search box -> reset to page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const query: LeadQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      temperature: tempFilter === 'all' ? undefined : tempFilter,
      ...SORTS[sortKey],
    }),
    [page, search, statusFilter, tempFilter, sortKey],
  );

  const { leads, total, totalPages, loading, error, refetch } = useLeads(query);

  const goToPage = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));
  const goEdit = (id: string) => { setPopover(null);   navigate(`/app/leads/edit/${id}`); };

  const handleDelete = async (id: string) => {
    await leadService.deleteLead(id);
    setPopover(null);
    setSelected(null);
    if (leads.length === 1 && page > 1) setPage((p) => p - 1);
    else await refetch();
  };

  const handleSaveFollowUp = async (id: string, nextFollowUp: string | null) => {
    console.log("we are in total lead handle save Folloup")
    await leadService.setFollowUp(id, nextFollowUp);
    setSelected((prev) => (prev ? { ...prev, nextFollowUp: nextFollowUp ?? undefined } : prev));
    await refetch();
  };


  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setPopover(null);
    const current = statusOverrides[id] ?? leads.find((l) => l._id === id)?.status;
    if (status === current) return;

    setStatusOverrides((p) => ({ ...p, [id]: status }));
    setSavingStatusId(id);
    try {
      await leadService.updateStatus(id, status);
      showToast.success('Status updated');
      await refetch();
      setStatusOverrides((p) => { const n = { ...p }; delete n[id]; return n; });
    } catch (err) {
      console.error(err);
      showToast.error('Could not update status');
      setStatusOverrides((p) => { const n = { ...p }; delete n[id]; return n; });
    } finally {
      setSavingStatusId(null);
    }
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="Total Leads"
        description={`${total} leads across your pipeline`}
      />

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search by name, company or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
          className="sm:min-w-[160px]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select
          value={tempFilter}
          onChange={(e) => { setTempFilter(e.target.value as typeof tempFilter); setPage(1); }}
          className="sm:min-w-[140px]"
        >
          <option value="all">All temps</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="unknown">Unknown</option>
        </Select>
        <Select
          value={sortKey}
          onChange={(e) => { setSortKey(e.target.value as SortKey); setPage(1); }}
          className="sm:min-w-[150px]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="name">Name A–Z</option>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-5 flex items-center gap-3 border-danger-200 bg-danger-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-danger-500" />
          <span className="text-sm text-danger-700">{error}</span>
          <button onClick={() => void refetch()} className="ml-auto text-sm font-medium text-danger-600 hover:underline">
            Retry
          </button>
        </Card>
      )}

      {/* Loading (first load) */}
      {loading && leads.length === 0 && !error && (
        <Card className="p-10 text-center text-sm text-ink-400">Loading leads…</Card>
      )}

      {/* Empty */}
      {!loading && leads.length === 0 && !error && (
        <EmptyState icon={Users} title="No leads found" description="Try a different keyword or clear your filters." />
      )}

      {/* Table */}
      {leads.length > 0 && (
        <Card className="overflow-hidden">
          <div className={`overflow-x-auto scrollbar-thin transition-opacity ${loading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-25 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5">Lead</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Temp</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Next follow-up</th>
                  <th className="px-5 py-3.5">Added</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((raw) => {
                  const effectiveStatus = statusOverrides[raw._id] ?? raw.status;
                  const lead = LeadModel.from(
                    effectiveStatus === raw.status ? raw : { ...raw, status: effectiveStatus },
                  );
                  const statusOpen = popover?.id === raw._id && popover.kind === 'status';
                  const actionsOpen = popover?.id === raw._id && popover.kind === 'actions';

                  return (
                    <tr
                      key={lead.id}
                      className="cursor-pointer border-b border-ink-50 transition-colors last:border-0 hover:bg-ink-25"
                      onClick={() => setSelected(raw)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} size={36} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink-800">{lead.name}</p>
                            <p className="truncate text-xs text-ink-400">{lead.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-[200px] truncate text-ink-700">{lead.email}</p>
                        {lead.phone && <p className="mt-0.5 text-xs text-ink-400">{lead.phone}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 capitalize text-ink-600">
                          <span className={`h-2 w-2 rounded-full ${lead.temperatureDotClass}`} />
                          {lead.temperatureLabel}
                        </span>
                      </td>

                      {/* Inline status picker */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => setPopover(statusOpen ? null : { id: raw._id, kind: 'status' })}
                            disabled={savingStatusId === raw._id}
                            className="inline-flex items-center gap-1 rounded-lg px-0.5 py-0.5 hover:opacity-80 disabled:opacity-60"
                            title="Change status"
                          >
                            <Badge tone={lead.statusTone} className="capitalize">{lead.statusLabel}</Badge>
                            {savingStatusId === raw._id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" />
                              : <ChevronDown className="h-3.5 w-3.5 text-ink-400" />}
                          </button>

                          {statusOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setPopover(null)} />
                              <div className="absolute left-0 top-9 z-20 w-52 rounded-xl border border-ink-100 bg-white py-1.5 shadow-pop">
                                {STATUS_OPTIONS.map((opt) => {
                                  const optModel = LeadModel.from({ ...raw, status: opt.value });
                                  const active = opt.value === effectiveStatus;
                                  return (
                                    <button
                                      key={opt.value}
                                      onClick={() => void handleStatusChange(raw._id, opt.value)}
                                      className={`flex w-full items-center justify-between px-3.5 py-2 hover:bg-ink-50 ${active ? 'bg-ink-25' : ''}`}
                                    >
                                      <Badge tone={optModel.statusTone} className="capitalize">{opt.label}</Badge>
                                      {active && <Check className="h-3.5 w-3.5 text-brand-600" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {lead.hasFollowUp ? (
                          <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${lead.followUpBadgeClass}`}>
                            {lead.followUpLabel}
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(raw); }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                          >
                            <CalendarClock className="h-3.5 w-3.5" /> Schedule
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-500">{lead.createdAtLabel}</td>

                      {/* Actions */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setPopover(actionsOpen ? null : { id: raw._id, kind: 'actions' })}
                            className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {actionsOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setPopover(null)} />
                              <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-ink-100 bg-white py-1.5 shadow-pop">
                                <button
                                  onClick={() => { setSelected(raw); setPopover(null); }}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                                >
                                  <Eye className="h-4 w-4 text-ink-400" /> View details
                                </button>
                                <button
                                  onClick={() => goEdit(raw._id)}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                                >
                                  <Pencil className="h-4 w-4 text-ink-400" /> Edit lead
                                </button>
                                <button
                                  onClick={() => { setSelected(raw); setPopover(null); }}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                                >
                                  <CalendarClock className="h-4 w-4 text-ink-400" /> Schedule follow-up
                                </button>
                                <button
                                  onClick={() => void handleDelete(raw._id)}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-danger-500 hover:bg-danger-50"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-5 py-4 sm:flex-row">
            <p className="text-xs text-ink-400">Showing {rangeStart}–{rangeEnd} of {total} leads</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageWindow(page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="px-1 text-ink-300">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Detail + follow-up modal */}
      {selected && (
        <LeadDetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onEdit={(id) => { setSelected(null); navigate(`/leads/edit/${id}`); }}
          onSaveFollowUp={(nextFollowUp) => handleSaveFollowUp(selected._id, nextFollowUp)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}