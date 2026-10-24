import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { calculateTotals } from '../lib/calculations';
import { createEmptyItem, createEmptyQuotation, createSampleQuotation } from '../lib/defaults';
import { createId, createQuotationNumber } from '../lib/ids';
import {
  clearCurrentQuotation,
  deleteDraft,
  loadCurrentQuotation,
  loadDrafts,
  saveCurrentQuotation,
  saveDraft,
} from '../lib/storage';
import { api, type QuotationSummary } from '../lib/api';
import type { FieldErrors, Quotation, QuotationTotals } from '../types/quotation';
import { validateQuotation } from '../lib/validation';

interface QuotationContextValue {
  quotation: Quotation;
  totals: QuotationTotals;
  drafts: Quotation[];
  dbQuotations: QuotationSummary[];
  isDbConnected: boolean;
  errors: FieldErrors;
  banner: string | null;
  setBanner: (message: string | null) => void;
  updateQuotation: (updater: (current: Quotation) => Quotation) => void;
  resetQuotation: () => void;
  loadSample: () => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  persistDraft: () => void;
  loadDraft: (id: string) => void;
  removeDraft: (id: string) => void;
  saveToDb: (status?: 'draft' | 'sent' | 'accepted' | 'declined') => Promise<boolean>;
  loadFromDb: (id: string) => Promise<void>;
  deleteFromDb: (id: string) => Promise<void>;
  updateStatusInDb: (id: string, status: 'draft' | 'sent' | 'accepted' | 'declined') => Promise<void>;
  refreshDbQuotations: () => Promise<void>;
  regenerateNumber: () => void;
  validateForExport: () => boolean;
  clearErrors: () => void;
}

const QuotationContext = createContext<QuotationContextValue | null>(null);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotation, setQuotation] = useState<Quotation>(() => loadCurrentQuotation() ?? createEmptyQuotation());
  const [drafts, setDrafts] = useState<Quotation[]>(() => loadDrafts());
  const [dbQuotations, setDbQuotations] = useState<QuotationSummary[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [banner, setBanner] = useState<string | null>(null);

  const totals = useMemo(() => calculateTotals(quotation), [quotation]);

  // Persist current state in local storage as backup
  useEffect(() => {
    saveCurrentQuotation(quotation);
  }, [quotation]);

  // Initial connection check & load DB quotes
  const refreshDbQuotations = useCallback(async () => {
    try {
      await api.checkHealth();
      setIsDbConnected(true);
      const list = await api.listQuotations();
      setDbQuotations(list);
    } catch {
      setIsDbConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshDbQuotations();
  }, [refreshDbQuotations]);

  const updateQuotation = useCallback((updater: (current: Quotation) => Quotation) => {
    setQuotation((current) => updater(current));
    setErrors({});
  }, []);

  const resetQuotation = useCallback(() => {
    const next = createEmptyQuotation();
    setQuotation(next);
    clearCurrentQuotation();
    setErrors({});
    setBanner('Form reset. A new quotation number was generated.');
  }, []);

  const loadSample = useCallback(() => {
    const sample = createSampleQuotation();
    setQuotation(sample);
    setErrors({});
    setBanner('Loaded sample Sri Lankan business quotation. You can edit or download it now!');
  }, []);

  const addItem = useCallback(() => {
    updateQuotation((current) => ({ ...current, items: [...current.items, createEmptyItem()] }));
  }, [updateQuotation]);

  const removeItem = useCallback(
    (id: string) => {
      updateQuotation((current) => ({
        ...current,
        items: current.items.length === 1 ? current.items : current.items.filter((item) => item.id !== id),
      }));
    },
    [updateQuotation],
  );

  const persistDraft = useCallback(() => {
    saveDraft(quotation);
    setDrafts(loadDrafts());
    setBanner(`Draft ${quotation.number} saved in local storage.`);
  }, [quotation]);

  const loadDraft = useCallback((id: string) => {
    const found = loadDrafts().find((draft) => draft.id === id);
    if (!found) return;
    setQuotation(found);
    setErrors({});
    setBanner(`Loaded draft ${found.number}.`);
  }, []);

  const removeDraft = useCallback((id: string) => {
    deleteDraft(id);
    setDrafts(loadDrafts());
    setBanner('Draft removed from this device.');
  }, []);

  // Database operations
  const saveToDb = useCallback(
    async (status: 'draft' | 'sent' | 'accepted' | 'declined' = 'draft'): Promise<boolean> => {
      try {
        const res = await api.createQuotation(quotation, status);
        setQuotation(res.quotation);
        setIsDbConnected(true);
        await refreshDbQuotations();
        setBanner(`✓ Saved quotation ${res.quotation.number} to Database (${status.toUpperCase()})`);
        return true;
      } catch (err: any) {
        setBanner(`Failed to save to database: ${err.message}. Saved locally as draft.`);
        saveDraft(quotation);
        return false;
      }
    },
    [quotation, refreshDbQuotations],
  );

  const loadFromDb = useCallback(async (id: string) => {
    try {
      const res = await api.getQuotation(id);
      setQuotation(res.quotation);
      setErrors({});
      setBanner(`Loaded quotation ${res.quotation.number} from Database.`);
    } catch (err: any) {
      setBanner(`Could not load quotation from database: ${err.message}`);
    }
  }, []);

  const deleteFromDb = useCallback(
    async (id: string) => {
      try {
        await api.deleteQuotation(id);
        await refreshDbQuotations();
        setBanner('Quotation deleted from Database.');
      } catch (err: any) {
        setBanner(`Could not delete quotation: ${err.message}`);
      }
    },
    [refreshDbQuotations],
  );

  const updateStatusInDb = useCallback(
    async (id: string, status: 'draft' | 'sent' | 'accepted' | 'declined') => {
      try {
        await api.updateStatus(id, status);
        await refreshDbQuotations();
        setBanner(`Quotation status marked as ${status.toUpperCase()}.`);
      } catch (err: any) {
        setBanner(`Could not update status: ${err.message}`);
      }
    },
    [refreshDbQuotations],
  );

  const regenerateNumber = useCallback(() => {
    updateQuotation((current) => ({
      ...current,
      id: createId('quote'),
      number: createQuotationNumber(),
    }));
    setBanner('A new quotation number was generated.');
  }, [updateQuotation]);

  const validateForExport = useCallback(() => {
    const nextErrors = validateQuotation(quotation);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [quotation]);

  const clearErrors = useCallback(() => setErrors({}), []);

  const value = useMemo(
    () => ({
      quotation,
      totals,
      drafts,
      dbQuotations,
      isDbConnected,
      errors,
      banner,
      setBanner,
      updateQuotation,
      resetQuotation,
      loadSample,
      addItem,
      removeItem,
      persistDraft,
      loadDraft,
      removeDraft,
      saveToDb,
      loadFromDb,
      deleteFromDb,
      updateStatusInDb,
      refreshDbQuotations,
      regenerateNumber,
      validateForExport,
      clearErrors,
    }),
    [
      quotation,
      totals,
      drafts,
      dbQuotations,
      isDbConnected,
      errors,
      banner,
      updateQuotation,
      resetQuotation,
      loadSample,
      addItem,
      removeItem,
      persistDraft,
      loadDraft,
      removeDraft,
      saveToDb,
      loadFromDb,
      deleteFromDb,
      updateStatusInDb,
      refreshDbQuotations,
      regenerateNumber,
      validateForExport,
      clearErrors,
    ],
  );

  return <QuotationContext.Provider value={value}>{children}</QuotationContext.Provider>;
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotation must be used within QuotationProvider');
  }
  return context;
}
