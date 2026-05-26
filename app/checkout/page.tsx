"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const appClickTimeRef = useRef<number>(0);

  useEffect(() => {
    if (payData && !payData.upiMode && !paid) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/order-status?orderId=${payData.orderId}`);
          const data = await res.json();
          if (data.paid) {
            setPaid(true);
            clearCart?.();
            if (pollRef.current) clearInterval(pollRef.current);
          }
        } catch {}
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [payData, paid]);

  useEffect(() => {
    if (!payData?.upiMode) return;
    const handler = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - appClickTimeRef.current;
        if (elapsed > 8000) {
          setPaymentLaunched(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [payData]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required.";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number.";
    if (!address.trim()) errs.address = "Address is required.";
    if (!city.trim()) errs.city = "City is required.";
    if (!state.trim()) errs.state = "State is required.";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch {
      alert("Payment initiation failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  async function handleConfirmOrder() {
    setConfirming(true);
    try {
      const res = await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Zeppoli Bakers",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      const data = await res.json();
      if (data.success || data.paid) {
        setPaid(true);
        clearCart?.();
      }
    } catch {
      alert("Could not confirm order. Please contact support.");
    } finally {
      setConfirming(false);
    }
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== 'undefined') {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: 'https://tez.google.com/pay', data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: 'INR' } }],
          { total: { label: 'Total', amount: { currency: 'INR', value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) { const resp = await req.show(); await resp.complete('success'); setPaymentLaunched(true); return; }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #3a2a1e",
    background: "#1e1208",
    color: "var(--text)",
    fontFamily: "'Nunito Sans', sans-serif",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 200ms ease",
  };

  const inputError: React.CSSProperties = { ...inputBase, borderColor: "#e05050" };

  if (paid && payData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito Sans', sans-serif",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#1e1208",
            border: "1.5px solid #3a2a1e",
            borderRadius: "24px",
            padding: "56px 48px",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 24px 64px rgba(140,28,30,0.25)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8C1C1E, #673926)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#F5EDE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Payment Successful!
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "8px" }}>
            Thank you for your order, <strong style={{ color: "var(--text)" }}>{name}</strong>.
          </p>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "32px" }}>
            Order #{payData.orderId?.slice(-8)?.toUpperCase()}
          </p>
          <p style={{ color: "#9B8B7D", fontSize: "13px", marginBottom: "32px" }}>
            A confirmation has been sent to <strong style={{ color: "var(--text)" }}>{email}</strong>
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "var(--primary)",
              color: "var(--text)",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 8px 24px rgba(140,28,30,0.35)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito Sans', sans-serif",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#1e1208",
            border: "1.5px solid #3a2a1e",
            borderRadius: "24px",
            padding: "64px 48px",
            maxWidth: "420px",
            width: "100%",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 24px", display: "block" }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#673926" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#673926" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 10a4 4 0 01-8 0" stroke="#673926" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Your cart is empty
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "32px", lineHeight: 1.7 }}>
            Looks like you haven't added any indulgences yet. Browse our collection of handcrafted cakes.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              border: "none",
              background: "var(--primary)",
              color: "var(--text)",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(140,28,30,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Nunito+Sans:wght@400;500;600;700&display=swap');
        :root {
          --bg: #110D08;
          --surface: #A85A5F;
          --primary: #8C1C1E;
          --accent: #673926;
          --text: #F5EDE0;
          --muted: #9B8B7D;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #8C1C1E !important;
          box-shadow: 0 0 0 3px rgba(140,28,30,0.18);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1e1208; }
        ::-webkit-scrollbar-thumb { background: #3a2a1e; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#110D08",
          borderBottom: "1px solid #2a1a10",
          padding: "0 32px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => router.push("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "12px",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Secure Checkout
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "13px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9B8B7D" strokeWidth="1.5" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9B8B7D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          SSL Secured
        </div>
      </nav>

      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "var(--bg)",
          fontFamily: "'Nunito Sans', sans-serif",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {/* Page heading */}
          <div style={{ marginBottom: "40px" }}>
            <p
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--surface)",
                fontFamily: "'Nunito Sans', sans-serif",
                marginBottom: "8px",
              }}
            >
              Almost There
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Complete Your Order
            </h1>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "48px", maxWidth: "400px" }}>
            {["Cart", "Details", "Payment"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", flex: i < 2 ? "1" : "0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: i <= 1 ? "var(--primary)" : "#2a1a10",
                      border: i === 2 ? "1.5px solid #3a2a1e" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {i === 0 ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#F5EDE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span style={{ fontSize: "10px", color: i <= 1 ? "var(--text)" : "var(--muted)", fontWeight: 600, letterSpacing: "0.06em" }}>
                    {step}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      background: i === 0 ? "var(--primary)" : "#2a1a10",
                      margin: "0 8px",
                      marginBottom: "18px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                alignItems: "start",
              }}
            >
              {/* LEFT: Form */}
              <div
                style={{
                  background: "#1a1008",
                  border: "1.5px solid #2a1a10",
                  borderRadius: "20px",
                  padding: "36px 32px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "28px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Delivery Details
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                      placeholder="Your full name"
                      style={errors.name ? inputError : inputBase}
                    />
                    {errors.name && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.name}</p>}
                  </div>

                  {/* Email + Phone row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="you@email.com"
                        style={errors.email ? inputError : inputBase}
                      />
                      {errors.email && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((p) => ({ ...p, phone: "" })); }}
                        placeholder="10-digit mobile"
                        style={errors.phone ? inputError : inputBase}
                      />
                      {errors.phone && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Address *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                      placeholder="Flat / House No., Street, Area"
                      rows={3}
                      style={{
                        ...(errors.address ? inputError : inputBase),
                        resize: "vertical",
                        minHeight: "80px",
                      }}
                    />
                    {errors.address && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.address}</p>}
                  </div>

                  {/* City + State */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: "" })); }}
                        placeholder="Mumbai"
                        style={errors.city ? inputError : inputBase}
                      />
                      {errors.city && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.city}</p>}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => { setState(e.target.value); setErrors((p) => ({ ...p, state: "" })); }}
                        placeholder="Maharashtra"
                        style={errors.state ? inputError : inputBase}
                      />
                      {errors.state && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.state}</p>}
                    </div>
                  </div>

                  {/* PIN */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={pin}
                      onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors((p) => ({ ...p, pin: "" })); }}
                      placeholder="400001"
                      style={{ ...(errors.pin ? inputError : inputBase), maxWidth: "180px" }}
                    />
                    {errors.pin && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "6px" }}>{errors.pin}</p>}
                  </div>
                </div>

                {/* Trust line */}
                <div
                  style={{
                    marginTop: "28px",
                    padding: "14px 16px",
                    background: "#110D08",
                    borderRadius: "10px",
                    border: "1px solid #2a1a10",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#8C1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                    Your information is encrypted and secure. We never store payment data.
                  </p>
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div
                  style={{
                    background: "#1a1008",
                    border: "1.5px solid #2a1a10",
                    borderRadius: "20px",
                    padding: "32px",
                    position: "sticky",
                    top: "88px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "24px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                    {items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "12px",
                          background: "#110D08",
                          borderRadius: "12px",
                          border: "1px solid #2a1a10",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid #2a1a10",
                          }}
                        >
                          <img
                            src={item.image || "/product-1.jpg"}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "var(--text)",
                              lineHeight: 1.3,
                              marginBottom: "4px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "var(--muted)" }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--surface)",
                            flexShrink: 0,
                          }}
                        >
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "#2a1a10", marginBottom: "20px" }} />

                  {/* Pricing breakdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", color: "var(--muted)" }}>Delivery</span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: shipping === 0 ? "#5cb85c" : "var(--text)",
                        }}
                      >
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(103,57,38,0.2)",
                          borderRadius: "8px",
                          border: "1px solid rgba(103,57,38,0.3)",
                        }}
                      >
                        <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                          Add ₹{(500 - subtotal + 1).toLocaleString("en-IN")} more for FREE delivery!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "#2a1a10", marginBottom: "20px" }} />

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--text)",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        color: "var(--surface)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    style={{
                      width: "100%",
                      padding: "17px",
                      borderRadius: "12px",
                      border: "none",
                      background: paying ? "#4a2020" : "var(--primary)",
                      color: "var(--text)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: paying ? "not-allowed" : "pointer",
                      letterSpacing: "0.04em",
                      boxShadow: paying ? "none" : "0 8px 32px rgba(140,28,30,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "transform 200ms ease, box-shadow 200ms ease",
                    }}
                    onMouseEnter={(e) => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    onMouseDown={(e) => { if (!paying) e.currentTarget.style.transform = "scale(0.98)"; }}
                    onMouseUp={(e) => { if (!paying) e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {paying ? (
                      <>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            border: "2px solid rgba(245,237,224,0.3)",
                            borderTop: "2px solid var(--text)",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        Processing…
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="#F5EDE0" strokeWidth="1.8" />
                          <line x1="1" y1="10" x2="23" y2="10" stroke="#F5EDE0" strokeWidth="1.8" />
                        </svg>
                        Pay via UPI · ₹{total.toLocaleString("en-IN")}
                      </>
                    )}
                  </button>

                  {/* Trust badges */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid #2a1a10",
                    }}
                  >
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((badge) => (
                      <div
                        key={badge}
                        style={{
                          padding: "5px 10px",
                          background: "#110D08",
                          borderRadius: "6px",
                          border: "1px solid #2a1a10",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "var(--muted)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery promise */}
                <div
                  style={{
                    background: "#1a1008",
                    border: "1.5px solid #2a1a10",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#8C1C1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                      text: "Same-day delivery in Mumbai, Delhi, Bangalore",
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#8C1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                      text: "Freshness guarantee on every order",
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#8C1C1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><polyline points="17 6 23 6 23 12" stroke="#8C1C1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                      text: "Handcrafted fresh daily, no preservatives",
                    },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {item.icon}
                      <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.4 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== UPI INTENT MODE MODAL ===== */}
      {payData?.upiMode && !paid && (
        <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(10,6,2,0.92)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",overflowY:"auto" }}>
          <div style={{ background:"#1e1208",border:"1.5px solid #3a2a1e",borderRadius:"24px",padding:"40px 32px",maxWidth:"400px",width:"100%",boxShadow:"0 32px 80px rgba(140,28,30,0.4)",fontFamily:"'Nunito Sans',sans-serif",textAlign:"center" }}>

            <img src="/logo.png" alt="Zeppoli Bakers" style={{ height:"28px",objectFit:"contain",marginBottom:"14px" }} />

            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em",margin:"0 0 4px" }}>
              ₹{payData.amount?.toLocaleString("en-IN")}
            </p>
            <p style={{ fontSize:"13px",color:"var(--muted)",marginBottom:"28px" }}>Complete your Zeppoli Bakers order</p>

            {isMobile ? (
              <div style={{ marginBottom:"20px" }}>
                {!paymentLaunched ? (
                  <button
                    onClick={payNow}
                    style={{ width:"100%",padding:"18px",borderRadius:"14px",border:"none",background:"linear-gradient(135deg,#8C1C1E,#673926)",color:"#F5EDE0",fontFamily:"'Nunito Sans',sans-serif",fontSize:"17px",fontWeight:800,cursor:"pointer",letterSpacing:"0.02em",boxShadow:"0 8px 28px rgba(140,28,30,0.5)",marginBottom:"10px" }}
                  >
                    Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                  </button>
                ) : (
                  <div style={{ padding:"14px",background:"rgba(140,28,30,0.12)",borderRadius:"12px",border:"1px solid rgba(140,28,30,0.3)",marginBottom:"10px" }}>
                    <p style={{ fontSize:"14px",fontWeight:700,color:"var(--text)",margin:"0 0 4px" }}>Payment app opened</p>
                    <p style={{ fontSize:"12px",color:"var(--muted)",margin:0 }}>Confirm payment there, then tap below</p>
                  </div>
                )}
                <p style={{ fontSize:"11px",color:"var(--muted)" }}>Opens Google Pay · PhonePe · Paytm</p>
              </div>
            ) : (
              <div style={{ marginBottom:"20px" }}>
                <p style={{ fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,color:"var(--muted)",marginBottom:"10px" }}>
                  Scan QR with any UPI app
                </p>
                <div style={{ background:"#fff",borderRadius:"14px",padding:"12px",display:"inline-block",boxShadow:"0 4px 20px rgba(140,28,30,0.2)",marginBottom:"6px" }}>
                  <img src={`data:image/png;base64,${payData.qrBase64}`} width={200} height={200} alt="UPI QR Code" style={{ display:"block" }} />
                </div>
                <p style={{ fontSize:"11px",color:"var(--muted)" }}>Open GPay / PhonePe / Paytm → Scan → Pay</p>
              </div>
            )}

            <div style={{ borderTop:"1px solid #2a1a10",paddingTop:"20px" }}>
              <p style={{ fontSize:"12px",color:"var(--muted)",marginBottom:"10px",textAlign:"left" }}>After paying, confirm your order:</p>
              <input
                type="text"
                value={upiTxnId}
                onChange={(e) => setUpiTxnId(e.target.value)}
                placeholder="UPI Transaction ID (optional)"
                style={{ width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1.5px solid #3a2a1e",background:"#110D08",color:"var(--text)",fontFamily:"'Nunito Sans',sans-serif",fontSize:"14px",outline:"none",boxSizing:"border-box" as const,marginBottom:"10px",textAlign:"left" }}
              />
              <button
                onClick={handleConfirmOrder}
                disabled={confirming}
                style={{ width:"100%",padding:"15px",borderRadius:"12px",border:"none",background:confirming?"#4a2020":"var(--primary)",color:"var(--text)",fontFamily:"'Nunito Sans',sans-serif",fontSize:"15px",fontWeight:700,cursor:confirming?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:confirming?"none":"0 6px 20px rgba(140,28,30,0.4)" }}
              >
                {confirming ? (
                  <><div style={{ width:"15px",height:"15px",border:"2px solid rgba(245,237,224,0.3)",borderTop:"2px solid var(--text)",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />Confirming…</>
                ) : "I've Paid — Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* ===== CASHFREE QR MODE MODAL ===== */}
      {payData && !payData.upiMode && !paid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,6,2,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "#1e1208",
              border: "1.5px solid #3a2a1e",
              borderRadius: "24px",
              padding: "40px 36px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 32px 80px rgba(140,28,30,0.3)",
              textAlign: "center",
            }}
          >
            {/* Brand */}
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "inline-block", marginBottom: "16px" }}>
              <img src="/logo.png" alt="Zeppoli Bakers" style={{ height: "34px", objectFit: "contain" }} />
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "6px",
                letterSpacing: "-0.02em",
              }}
            >
              Scan & Pay
            </h3>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--surface)", marginBottom: "24px" }}>
              ₹{payData.amount?.toLocaleString("en-IN")}
            </p>

            {/* QR */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px",
                display: "inline-block",
                marginBottom: "24px",
                boxShadow: "0 8px 32px rgba(140,28,30,0.2)",
              }}
            >
              <img
                src={`data:image/png;base64,${payData.qrBase64}`}
                width={220}
                height={220}
                alt="UPI QR Code for payment"
                style={{ display: "block" }}
              />
            </div>

            {/* Waiting indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#8C1C1E",
                  animation: "pulse-dot 1.4s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: 500 }}>
                Waiting for payment…
              </span>
            </div>

            {/* UPI badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              {["GPay", "PhonePe", "Paytm", "BHIM"].map((b) => (
                <div
                  key={b}
                  style={{
                    padding: "5px 12px",
                    background: "#110D08",
                    borderRadius: "6px",
                    border: "1px solid #2a1a10",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {b}
                </div>
              ))}
            </div>

            <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "20px", lineHeight: 1.6, opacity: 0.8 }}>
              Open any UPI app and scan the QR code above.<br />
              This page will update automatically once payment is confirmed.
            </p>
          </div>
        </div>
      )}
    </>
  );
}