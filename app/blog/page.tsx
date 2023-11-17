"use client";

import { useToast } from "@/components/contexts/ToastContext";

export default function Home() {
  const { appendToast } = useToast();
  return (
    <div style={{ height: 2000 }} className="flex items-center">
      <button
        onClick={() => {
          appendToast("awawa");
        }}
      >
        Toast me!
      </button>
      <button
        onClick={() => {
          appendToast("bbbbb");
        }}
      >
        Toast me!
      </button>
      <button
        onClick={() => {
          appendToast("fawjkfnf");
        }}
      >
        Toast me!
      </button>
    </div>
  );
}
