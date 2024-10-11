"use client";

import React from "react";

import { useToastStore } from "@/src/store/toast.store";
import { Toasts } from "@/components/layout/toasts";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toasts key={toast.id} {...toast} />
        ))}
      </div>
    </>
  );
};
