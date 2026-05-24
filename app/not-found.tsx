"use client";
import { useRouter } from "next/navigation";
export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Page Not Found</h1>
      <button onClick={() => router.push("/")} style={{ background: "#8C1C1E", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Go Home</button>
    </div>
  );
}