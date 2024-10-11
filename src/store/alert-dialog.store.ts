import { create } from "zustand";

type AlertDialog = {
  id: string;
  titre: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type AlertStore = {
  alerts: AlertDialog[];
  addAlert: (alert: Omit<AlertDialog, "id">) => void;
  removeAlert: (id: string) => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id: Date.now().toString() }],
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));
