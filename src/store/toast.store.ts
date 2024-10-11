import { create } from "zustand";

type Toast = {
  id: string;
  titre: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  actionValider?: {
    texte: string;
    onValider: () => void;
    variant?: "default" | "primary";
  };
  actionAnnuler?: {
    texte: string;
    onAnnuler: () => void;
    variant?: "default" | "primary";
  };
  timerId?: number; // Changé de NodeJS.Timeout à number
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "timerId">) => void;
  removeToast: (id: string) => void;
  updateToastTimer: (id: string, timerId: number | undefined) => void; // Modifié pour accepter undefined
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => {
        if (toast.id === id && toast.timerId) {
          clearTimeout(toast.timerId);
        }

        return toast.id !== id;
      }),
    })),
  updateToastTimer: (id, timerId) =>
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, timerId } : toast,
      ),
    })),
}));
