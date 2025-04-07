import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      timer: { running: false, startTime: null, pauseTime: 0, totalPaused: 0 },
      workRecords: [],
      finances: [],
      debts: [],
      settings: {
        categories: ['Úklid', 'Komunikace', 'Wellness'],
        rates: { Maru: 275, Marty: 400 },
        deductions: { Maru: 1 / 3, Marty: 1 / 2 },
        rent: { amount: 24500, day: 5 },
      },
      startTimer: (time) => set({ timer: { ...get().timer, running: true, startTime: time || Date.now() } }),
      pauseTimer: () => set({ timer: { ...get().timer, running: false, pauseTime: Date.now() } }),
      resumeTimer: () => set({
        timer: {
          ...get().timer,
          running: true,
          totalPaused: get().timer.totalPaused + (Date.now() - get().timer.pauseTime),
          pauseTime: 0,
        },
      }),
      stopTimer: (record) => set((state) => ({
        workRecords: [...state.workRecords, record],
        timer: { running: false, startTime: null, pauseTime: 0, totalPaused: 0 },
      })),
      addFinance: (entry) => set((state) => ({ finances: [...state.finances, entry] })),
      addDebt: (debt) => set((state) => ({ debts: [...state.debts, debt] })),
      updateDebt: (id, updates) => set((state) => ({
        debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      })),
      setSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),
    }),
    { name: 'work-finance-storage' }
  )
);