import type { Quotation, QuotationTotals } from '../types/quotation';

const API_BASE = '/api';

export interface QuotationSummary {
  id: string;
  number: string;
  date: string;
  validUntil: string | null;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  customerName: string;
  projectReference: string | null;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalQuotes: number;
  draftCount: number;
  sentCount: number;
  acceptedCount: number;
  declinedCount: number;
  totalVolume: number;
  acceptedVolume: number;
  currencyBreakdown: { currency: string; count: number; totalSum: number }[];
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  description: string | null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorBody.error || `API error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; database: string; quotationsCount: number }>('/health'),

  // Quotations
  listQuotations: (params?: { q?: string; status?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const queryStr = searchParams.toString();
    return request<QuotationSummary[]>(`/quotations${queryStr ? `?${queryStr}` : ''}`);
  },

  getQuotation: (id: string) =>
    request<{ quotation: Quotation; totals: QuotationTotals }>(`/quotations/${id}`),

  createQuotation: (quotation: Quotation, status = 'draft') =>
    request<{ quotation: Quotation; totals: QuotationTotals }>('/quotations', {
      method: 'POST',
      body: JSON.stringify({ ...quotation, status }),
    }),

  updateQuotation: (id: string, quotation: Quotation, status = 'draft') =>
    request<{ quotation: Quotation; totals: QuotationTotals }>(`/quotations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...quotation, status }),
    }),

  deleteQuotation: (id: string) =>
    request<{ success: boolean; id: string }>(`/quotations/${id}`, {
      method: 'DELETE',
    }),

  updateStatus: (id: string, status: 'draft' | 'sent' | 'accepted' | 'declined') =>
    request<{ success: boolean; status: string }>(`/quotations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  duplicateQuotation: (id: string) =>
    request<{ quotation: Quotation; totals: QuotationTotals }>(`/quotations/${id}/duplicate`, {
      method: 'POST',
    }),

  // Business Profile
  getBusinessProfile: () => request<Quotation['business'] | null>('/business'),
  saveBusinessProfile: (business: Quotation['business']) =>
    request<{ success: boolean; business: Quotation['business'] }>('/business', {
      method: 'POST',
      body: JSON.stringify(business),
    }),

  // Customers
  listCustomers: () => request<any[]>('/customers'),

  // Product Catalog
  listCatalog: () => request<CatalogItem[]>('/catalog'),
  addCatalogItem: (item: { name: string; category?: string; unitPrice: number; description?: string }) =>
    request<{ success: boolean; id: string }>('/catalog', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  // Analytics
  getAnalytics: () => request<AnalyticsData>('/analytics'),
};
