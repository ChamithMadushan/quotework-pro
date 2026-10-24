import type { Quotation } from '../types/quotation';
import { createEmptyQuotation } from './defaults';

const CURRENT_KEY = 'quotecraft.current.v1';
const DRAFTS_KEY = 'quotecraft.drafts.v1';
const MAX_DRAFTS = 20;

export interface DraftSummary {
  id: string;
  number: string;
  businessName: string;
  customerName: string;
  updatedAt: string;
  totalHint: string;
}

function canUseStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function parseQuotation(raw: unknown): Quotation | null {
  if (!raw || typeof raw !== 'object') return null;
  const fallback = createEmptyQuotation();
  const data = raw as Partial<Quotation>;
  return {
    ...fallback,
    ...data,
    business: { ...fallback.business, ...data.business },
    customer: { ...fallback.customer, ...data.customer },
    tax: { ...fallback.tax, ...data.tax },
    documentDiscount: { ...fallback.documentDiscount, ...data.documentDiscount },
    items: Array.isArray(data.items) && data.items.length > 0 ? data.items : fallback.items,
  };
}

export function loadCurrentQuotation(): Quotation | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(CURRENT_KEY);
  if (!raw) return null;
  try {
    return parseQuotation(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCurrentQuotation(quotation: Quotation): void {
  if (!canUseStorage()) return;
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ ...quotation, updatedAt: new Date().toISOString() }));
}

export function clearCurrentQuotation(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CURRENT_KEY);
}

export function loadDrafts(): Quotation[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(DRAFTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseQuotation).filter((item): item is Quotation => item !== null);
  } catch {
    return [];
  }
}

export function saveDraft(quotation: Quotation): void {
  if (!canUseStorage()) return;
  const drafts = loadDrafts().filter((draft) => draft.id !== quotation.id);
  const next = [{ ...quotation, updatedAt: new Date().toISOString() }, ...drafts].slice(0, MAX_DRAFTS);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
}

export function deleteDraft(id: string): void {
  if (!canUseStorage()) return;
  const drafts = loadDrafts().filter((draft) => draft.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function summarizeDraft(quotation: Quotation): DraftSummary {
  return {
    id: quotation.id,
    number: quotation.number,
    businessName: quotation.business.name || 'Untitled business',
    customerName: quotation.customer.company || quotation.customer.name || 'Untitled customer',
    updatedAt: quotation.updatedAt,
    totalHint: quotation.currency,
  };
}
