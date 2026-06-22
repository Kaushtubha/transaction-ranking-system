import { create } from 'zustand';
import { getSummary, getRanking, submitTransaction } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const useStore = create((set, get) => ({
  userId: 'user_123', // Default demo user
  setUserId: (id) => set({ userId: id }),

  summary: null,
  isSummaryLoading: false,
  fetchSummary: async (userId) => {
    set({ isSummaryLoading: true });
    try {
      const data = await getSummary(userId || get().userId);
      set({ summary: data, isSummaryLoading: false });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user summary.");
      set({ summary: null, isSummaryLoading: false });
    }
  },

  rankings: [],
  isRankingLoading: false,
  fetchRankings: async () => {
    set({ isRankingLoading: true });
    try {
      const data = await getRanking();
      set({ rankings: data, isRankingLoading: false });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load rankings.");
      set({ rankings: [], isRankingLoading: false });
    }
  },

  isSubmitting: false,
  processTransaction: async (amount, type) => {
    set({ isSubmitting: true });
    const transactionId = uuidv4();
    const idempotencyKey = uuidv4();
    
    const payload = {
      transactionId,
      userId: get().userId,
      amount: parseFloat(amount),
      timestamp: new Date().toISOString(),
      type,
      metadata: { source: 'premium_web_ui' }
    };

    try {
      await submitTransaction(payload, idempotencyKey);
      toast.success('Transaction processed successfully!');
      
      // Refresh data
      await get().fetchSummary();
      await get().fetchRankings();
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Transaction failed.");
      set({ isSubmitting: false });
      return false;
    }
  }
}));
