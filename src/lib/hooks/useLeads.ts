import { useCallback, useEffect, useRef, useState } from 'react';
import leadService from '../services/lead.service';
import type { ILead, LeadQuery, LeadsResponse } from '../../types/lead';

interface LeadsState {
  leads: ILead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const getErrorMessage = (err: unknown): string => {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string };
  return anyErr?.response?.data?.message ?? anyErr?.message ?? 'Failed to load leads';
};

export function useLeads(query: LeadQuery) {
  const [state, setState] = useState<LeadsState>({
    leads: [],
    total: 0,
    page: query.page ?? 1,
    limit: query.limit ?? 6,
    totalPages: 1,
    loading: true,
    error: null,
  });

 
  const queryRef = useRef(query);
  queryRef.current = query;
  const reqId = useRef(0);
  const key = JSON.stringify(query);

  const fetchLeads = useCallback(async () => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = (await leadService.getLeads(queryRef.current)) as LeadsResponse;
      if (id !== reqId.current) return; 

      const data = res.data; 
      setState({
        leads: data.leads,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        loading: false,
        error: null,
      });
    } catch (err) {
      if (id !== reqId.current) return;
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }));
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [key, fetchLeads]);

  return { ...state, refetch: fetchLeads };
}