"use client";

import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertStore } from "@/src/store/alert-dialog.store";

export function Alerts() {
  const { alerts, removeAlert } = useAlertStore();

  return (
    <>
      {alerts.map(({ id, titre, message, onConfirm, onCancel }) => (
        <AlertDialog key={id} open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{titre}</AlertDialogTitle>
              <AlertDialogDescription>{message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  if (onCancel) onCancel();
                  removeAlert(id);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onConfirm();
                  removeAlert(id);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  );
}
