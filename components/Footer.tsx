"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const quickLinks = [
    { label: "Home", action: () => router.push("/") },
    { label: "Shop", action: () => router.push("/shop") },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#110D08",
        color: "#F5EDE0",
        fontFamily: "'Nunito Sans', sans-serif",
        borderTop: "1px solid rgba(103,57,38,0.35)",
      }}
    >
      {/* Main Footer Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px 64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
        }}
      >
        {/* Brand Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <img
            src="/logo.png"
            alt="Zeppoli Bakers logo"
            style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }}
          />
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#9B8B7D",
              maxWidth: "280px",
              margin: 0,
            }}
          >
            Layers of pure indulgence — handcrafted in India with love, tradition, and the finest ingredients. Every bite tells a story.
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#9B8B7D",
              margin: 0,
            }}
          >
            Made in India &nbsp;·&nbsp; Free shipping above ₹999
          </p>

          {/* Social Icons */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px" }}>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zeppoli Bakers on Instagram"
              style={{
                color: "#9B8B7D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "9999px",
                backgroundColor: "rgba(103,57,38,0.18)",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5EDE0";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9B8B7D";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.18)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zeppoli Bakers on Twitter"
              style={{
                color: "#9B8B7D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "9999px",
                backgroundColor: "rgba(103,57,38,0.18)",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5EDE0";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9B8B7D";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.18)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/91"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Zeppoli Bakers on WhatsApp"
              style={{
                color: "#9B8B7D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "9999px",
                backgroundColor: "rgba(103,57,38,0.18)",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5EDE0";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9B8B7D";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(103,57,38,0.18)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "20px",
              letterSpacing: "-0.01em",
              color: "#F5EDE0",
              margin: 0,
            }}
          >
            Quick Links
          </h3>
          <nav aria-label="Footer navigation" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#9B8B7D",
                  padding: "4px 0",
                  textAlign: "left",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5EDE0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#9B8B7D";
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
          </nav>

          {/* Contact Us */}
          <div style={{ marginTop: "8px" }}>
            <h4
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: "17px",
                color: "#F5EDE0",
                margin: "0 0 8px 0",
              }}
            >
              Contact Us
            </h4>
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                color: "#9B8B7D",
                fontSize: "14px",
                fontFamily: "'Nunito Sans', sans-serif",
                textDecoration: "none",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5EDE0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9B8B7D";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #A85A5F";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              maliyajay77@gmail.com
            </a>
          </div>
        </div>

        {/* Newsletter Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "20px",
              letterSpacing: "-0.01em",
              color: "#F5EDE0",
              margin: 0,
            }}
          >
            Stay in the Loop
          </h3>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#9B8B7D",
              margin: 0,
            }}
          >
            Be the first to know about seasonal drops, exclusive flavours, and celebration offers.
          </p>

          {subscribed ? (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "rgba(103,57,38,0.25)",
                border: "1px solid rgba(103,57,38,0.45)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A85A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: "#F5EDE0", fontSize: "14px", fontFamily: "'Nunito Sans', sans-serif" }}>
                Thank you — you&apos;re on the list!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              noValidate
            >
              <label htmlFor="footer-email" style={{ display: "none" }}>
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: inputFocused ? "1.5px solid #A85A5F" : "1.5px solid rgba(103,57,38,0.45)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#F5EDE0",
                  fontSize: "14px",
                  fontFamily: "'Nunito Sans', sans-serif",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#8C1C1E",
                  color: "#F5EDE0",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: "'Nunito Sans', sans-serif",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A85A5F";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#8C1C1E";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #A85A5F";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Subscribe
              </button>
            </form>
          )}

          {/* Trust signals */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {[
              { icon: "★★★★★", label: "4.9 / 5 Rating" },
              { icon: null, label: "Free shipping ₹999+" },
              { icon: null, label: "UPI accepted" },
            ].map((signal) => (
              <span
                key={signal.label}
                style={{
                  fontSize: "12px",
                  color: "#9B8B7D",
                  fontFamily: "'Nunito Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {signal.icon && (
                  <span style={{ color: "#A85A5F", fontSize: "11px" }} aria-hidden="true">
                    {signal.icon}
                  </span>
                )}
                {signal.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(103,57,38,0.25)",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#9B8B7D",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          © {new Date().getFullYear()} Zeppoli Bakers. All rights reserved.
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#9B8B7D",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Made with care in India &nbsp;·&nbsp;
          <a
            href="mailto:maliyajay77@gmail.com"
            style={{
              color: "#9B8B7D",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              fontFamily: "'Nunito Sans', sans-serif",
              transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#F5EDE0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#9B8B7D";
            }}
          >
            maliyajay77@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}