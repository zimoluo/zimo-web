"use client";

import { useToast } from "../contexts/ToastContext";
import ToastCardManager from "./ToastCardManager";

export default function ToastReceiver() {
  const { toast, removeGivenToast } = useToast();

  return (
    <>
      <div className="z-50 fixed top-10 left-2 hidden md:block">
        <ToastCardManager toasts={toast} removeToast={removeGivenToast} />
      </div>
    </>
  );
}
