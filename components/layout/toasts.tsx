"use client";

import React, { useEffect } from "react";

import { useToastStore } from "@/src/store/toast.store";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const TOAST_DURATION = 5000; // Durée en millisecondes avant la suppression automatique

export function Toasts() {
  const { toasts, removeToast, updateToastTimer } = useToastStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!toast.timerId) {
        const timerId = window.setTimeout(() => {
          removeToast(toast.id);
        }, TOAST_DURATION);

        updateToastTimer(toast.id, timerId);
      }
    });

    return () => {
      toasts.forEach((toast) => {
        if (toast.timerId) {
          clearTimeout(toast.timerId);
        }
      });
    };
  }, [toasts, removeToast, updateToastTimer]);

  const getVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, titre, message, type, actionValider, actionAnnuler }) => (
          <Toast
            key={id}
            variant={getVariant(type)}
            onMouseEnter={() => {
              const toast = toasts.find((t) => t.id === id);

              if (toast?.timerId) {
                clearTimeout(toast.timerId);
                updateToastTimer(id, undefined);
              }
            }}
            onMouseLeave={() => {
              const timerId = window.setTimeout(() => {
                removeToast(id);
              }, TOAST_DURATION);

              updateToastTimer(id, timerId);
            }}
          >
            <div className="grid gap-1">
              {titre && <ToastTitle>{titre}</ToastTitle>}
              {message && <ToastDescription>{message}</ToastDescription>}
            </div>
            {(actionValider || actionAnnuler) && (
              <div className="mt-2 flex space-x-2">
                {actionAnnuler && (
                  <ToastAction
                    altText={actionAnnuler.texte}
                    variant={actionAnnuler.variant || "default"}
                    onClick={() => {
                      actionAnnuler.onAnnuler();
                      removeToast(id);
                    }}
                  >
                    {actionAnnuler.texte}
                  </ToastAction>
                )}
                {actionValider && (
                  <ToastAction
                    altText={actionValider.texte}
                    variant={actionValider.variant || "default"}
                    onClick={() => {
                      actionValider.onValider();
                      removeToast(id);
                    }}
                  >
                    {actionValider.texte}
                  </ToastAction>
                )}
              </div>
            )}
            <ToastClose onClick={() => removeToast(id)} />
          </Toast>
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
