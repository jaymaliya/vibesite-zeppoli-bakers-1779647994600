"use client";
import { useState, useEffect, useCallback } from "react";

export interface ToastMessage { id: string; message: string; type?: "success" | "error" | "info"; }

let _setToast: ((t: ToastMessage | null) => void) | null = null;

export function toast(message: string, type: ToastMessage["type"] = "success") {
  _setToast?.({ id: Date.now().toString(), message, type });
}

export default function Toast() {
  const [current, setCurrent] = useState<ToastMessage | null>(null);

  useEffect(() => {
    _setToast = setCurrent;
    return () => { _setToast = null; };
  }, []);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), 3000);
    return () => clearTimeout(t);
  }, [current]);

  if (!current) return null;

  const bg = current.type === "error" ? "#ef4444" : current.type === "info" ? "#3b82f6" : "#8C1C1E";

  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
      background: bg, color: "#fff",
      padding: "14px 22px", borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      fontSize: "14px", fontWeight: 600,
      display: "flex", alignItems: "center", gap: "10px",
      animation: "slideInRight 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      maxWidth: "340px",
    }}>
      <span>{current.type === "error" ? "❌" : current.type === "info" ? "ℹ️" : "✅"}</span>
      <span>{current.message}</span>
    </div>
  );
}