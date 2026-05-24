"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const [prevTotal, setPrevTotal] = useState(totalItems);

  useEffect(() => {
    if (totalItems !== prevTotal) {
      setBadgePulse(true);
      setPrevTotal(totalItems);
      const t = setTimeout(() => setBadgePulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems, prevTotal]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToAbout = () => {
    setMobileOpen(false);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks: { label: string; action: () => void }[] = [
    { label: "Shop", action: () => { setMobileOpen(false); router.push("/shop"); } },
    { label: "Seasonal", action: scrollToAbout },
    { label: "Gifting", action: scrollToAbout },
    { label: "Our Story", action: scrollToAbout },
    { label: "Contact", action: scrollToAbout },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#110D08",
          boxShadow: scrolled ? "0 2px 24px 0 rgba(140,28,30,0.18)" : "none",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderBottom: scrolled ? "1px solid rgba(103,57,38,0.25)" : "1px solid transparent",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          {/* Logo */}
          <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex"
            style={{
              flex: "2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  letterSpacing: "0.01em",
                  color: "#F5EDE0",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5EDE0";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(103,57,38,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5EDE0";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: Cart + Hamburger */}
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            {/* Cart Button */}
            <button
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              onClick={() => router.push("/checkout")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "8px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(103,57,38,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {/* Cart SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5EDE0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>

              {/* Badge */}
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#8C1C1E",
                    color: "#F5EDE0",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "'Nunito Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    border: "1.5px solid #110D08",
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {mobileOpen ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5EDE0"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5EDE0"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            backgroundColor: "#110D08",
            display: "flex",
            flexDirection: "column",
            paddingTop: "72px",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          {/* Backdrop tap to close */}
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          />
          <nav
            aria-label="Mobile navigation links"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "16px 24px",
              gap: "4px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#F5EDE0",
                  padding: "16px 0",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(103,57,38,0.3)",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#A85A5F";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5EDE0";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile cart link */}
            <button
              onClick={() => { setMobileOpen(false); router.push("/checkout"); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                color: "#F5EDE0",
                padding: "16px 0",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Cart {totalItems > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#8C1C1E",
                    color: "#F5EDE0",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}