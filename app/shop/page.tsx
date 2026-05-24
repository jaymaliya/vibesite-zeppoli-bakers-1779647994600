"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "decadent, round, multi-layered", description: "This is a decadent, round, multi-layered chocolate cake, generously covered in chocolate", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "image showcases premium,", description: "This image showcases a premium, multi-layered Red Velvet cake, a classic bakery dessert.", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "image presents classic,", description: "This image presents a classic, generously proportioned circular blueberry cheesecake,", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "image presents premium,", description: "This image presents a premium, round caramel cake, clearly belonging to the Bakery /", price: 499, badge: "" }
];

  const filters = ["All Cakes", "Chocolate", "Red Velvet", "Cheesecake", "Caramel"];
  const [activeFilter, setActiveFilter] = useState("All Cakes");
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const { items } = (useCart() ?? { items: [] }) as { items: any[] };
  const cartCount = items ? items.reduce((s: number, i: any) => s + (i.quantity || 0), 0) : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');
      :root {
        --bg: #110D08;
        --surface: #A85A5F;
        --primary: #8C1C1E;
        --accent: #673926;
        --text: #F5EDE0;
        --muted: #9B8B7D;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: var(--bg); color: var(--text); font-family: 'Nunito Sans', sans-serif; }
      .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-delay-1 { transition-delay: 80ms; }
      .reveal-delay-2 { transition-delay: 160ms; }
      .reveal-delay-3 { transition-delay: 240ms; }
      .reveal-delay-4 { transition-delay: 320ms; }
      .product-card { transition: transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1); }
      .product-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(140,28,30,0.28); }
      .focus-ring:focus-visible { outline: 2px solid #B8860B; outline-offset: 3px; }
      .filter-pill { transition: background 200ms ease, color 200ms ease, border-color 200ms ease; }
      .nav-link:hover { text-shadow: 0 0 1px #B8860B; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToBag = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedStates((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedStates((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const filteredProducts = activeFilter === "All Cakes"
    ? products
    : products.filter((p) => p.category === activeFilter);

  const ChocolateSwirl = () => (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <path
        d="M60 100 C30 95, 15 70, 20 50 C25 30, 45 20, 60 25 C75 30, 85 45, 80 60 C75 75, 60 80, 55 72 C50 64, 58 55, 65 58 C72 61, 70 70, 65 68"
        fill="none"
        stroke="#F5EDE0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M30 85 Q25 70, 35 60 Q45 50, 55 55"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="90" cy="30" r="5" fill="none" stroke="#F5EDE0" strokeWidth="1.5" opacity="0.4" />
      <circle cx="85" cy="38" r="3" fill="none" stroke="#B8860B" strokeWidth="1.2" opacity="0.4" />
      <path
        d="M70 15 Q80 20, 78 30 Q76 40, 85 42"
        fill="none"
        stroke="#F5EDE0"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled ? "rgba(17,13,8,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(245,237,224,0.08)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background-color 200ms ease, border-color 200ms ease",
          padding: "0 48px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain" }} />
        </div>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {[
            { label: "Cakes", action: () => router.push("/shop") },
            { label: "Seasonal", action: () => router.push("/shop") },
            { label: "Gifting", action: () => router.push("/shop") },
            { label: "Our Story", action: () => router.push("/") },
            { label: "Contact", action: () => router.push("/") },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="nav-link focus-ring"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "'Nunito Sans', sans-serif",
                letterSpacing: "0.02em",
                padding: "4px 0",
                transition: "color 200ms ease",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Cart icon */}
        <button
          onClick={() => router.push("/checkout")}
          className="focus-ring"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            color: "var(--text)",
          }}
          aria-label="View cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#B8860B",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile hamburger — only on small screens via inline media query trick */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="focus-ring"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
            padding: "8px",
          }}
          aria-label="Open menu"
          id="hamburger-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "#110D08",
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            animation: "slideInLeft 300ms ease-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: "8px" }}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {["Cakes", "Seasonal", "Gifting", "Our Story", "Contact"].map((label) => (
            <button
              key={label}
              onClick={() => { setMobileMenuOpen(false); router.push(label === "Cakes" || label === "Seasonal" ? "/shop" : "/"); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                fontSize: "28px",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                textAlign: "left",
                padding: "16px 0",
                borderBottom: "1px solid rgba(245,237,224,0.08)",
                height: "56px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── SHOP PAGE HEADER STRIP ── */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "56px",
          paddingLeft: "48px",
          paddingRight: "48px",
          background: "linear-gradient(180deg, rgba(140,28,30,0.18) 0%, transparent 100%)",
          textAlign: "center",
        }}
      >
        <div className="reveal">
          <span
            style={{
              fontSize: "11px",
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8860B",
              display: "block",
              marginBottom: "16px",
            }}
          >
            OUR COLLECTION
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            Layers of Pure Indulgence
          </h1>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Each cake is handcrafted daily in our kitchen, using the finest cocoa,
            farm-fresh dairy, and premium ingredients — made to celebrate, share, and savour.
          </p>
        </div>

        {/* Trust strip */}
        <div
          className="reveal"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "32px",
            flexWrap: "wrap",
            fontSize: "13px",
            color: "var(--muted)",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#B8860B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            4.9 · 3,200+ Happy Customers
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
            Handcrafted Daily
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h5l3 5v3h-8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            Free Delivery over ₹1,200
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Made in India
          </span>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <section
        style={{
          paddingLeft: "48px",
          paddingRight: "48px",
          paddingBottom: "40px",
        }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="filter-pill focus-ring"
              style={{
                height: "36px",
                padding: "0 20px",
                borderRadius: "9999px",
                border: activeFilter === f ? "none" : "1px solid rgba(245,237,224,0.25)",
                backgroundColor: activeFilter === f ? "#B8860B" : "transparent",
                color: activeFilter === f ? "#fff" : "var(--text)",
                fontSize: "14px",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID (VISUAL FINGERPRINT) ── */}
      <section
        style={{
          paddingLeft: "48px",
          paddingRight: "48px",
          paddingBottom: "96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
        >
          {filteredProducts.map((p, idx) => {
            const isHovered = hoveredCard === p.id;
            const isAdded = addedStates[p.id];
            const delayClass = `reveal-delay-${idx + 1}`;

            return (
              <article
                key={p.id}
                className={`reveal ${delayClass} product-card focus-ring`}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: isHovered ? "#1e1007" : "rgba(255,255,255,0.03)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(245,237,224,0.07)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "background-color 300ms ease, transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Image container with VISUAL FINGERPRINT */}
                <div
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: isHovered ? "#A58A7B" : "#F8F5F2",
                    transition: "background-color 300ms ease",
                    aspectRatio: "1 / 1",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 400ms ease",
                      transform: isHovered ? "scale(1.03)" : "scale(1)",
                    }}
                  />

                  {/* VISUAL FINGERPRINT: SVG chocolate swirl flourish */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      width: "80px",
                      height: "80px",
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "scale(1)" : "scale(0.8)",
                      transition: "opacity 250ms ease-out, transform 250ms ease-out",
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <ChocolateSwirl />
                  </div>

                  {/* Category badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "rgba(17,13,8,0.75)",
                      backdropFilter: "blur(8px)",
                      color: "#B8860B",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "'Nunito Sans', sans-serif",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                    }}
                  >
                    {p.category}
                  </span>
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: "20px 20px 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  <h3
                    onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--text)",
                      lineHeight: 1.2,
                      cursor: "pointer",
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                      transition: "transform 200ms ease-out, color 200ms ease",
                    }}
                  >
                    {p.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {p.tagline}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#B8860B",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>

                    {/* View Details outline button */}
                    <button
                      onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                      className="focus-ring"
                      style={{
                        height: "36px",
                        padding: "0 16px",
                        border: "1px solid #B8860B",
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                        color: "#B8860B",
                        fontSize: "12px",
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        transition: "background-color 180ms ease, color 180ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#B8860B";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#B8860B";
                      }}
                    >
                      View Details
                    </button>
                  </div>

                  {/* Add to Bag button */}
                  <button
                    onClick={() => handleAddToBag(p)}
                    className="focus-ring"
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      height: "48px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: isAdded ? "#4a7c59" : "var(--primary)",
                      color: "#fff",
                      fontSize: "14px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                      transition: "background-color 200ms ease, transform 150ms ease, box-shadow 200ms ease",
                      boxShadow: isAdded ? "0 4px 16px rgba(74,124,89,0.35)" : "0 4px 16px rgba(140,28,30,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isAdded) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.backgroundColor = "#a82224";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      if (!isAdded) e.currentTarget.style.backgroundColor = "var(--primary)";
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    {isAdded ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--muted)",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "16px" }}>
              No cakes in this category yet.
            </p>
            <button
              onClick={() => setActiveFilter("All Cakes")}
              style={{
                padding: "12px 32px",
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              View All Cakes
            </button>
          </div>
        )}
      </section>

      {/* ── CRAFTED WITH PASSION SECTION ── */}
      <section
        id="crafted-with-passion"
        style={{
          padding: "96px 80px",
          backgroundColor: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(245,237,224,0.06)",
          borderBottom: "1px solid rgba(245,237,224,0.06)",
        }}
      >
        <div
          className="reveal"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "40% 60%",
            gap: "64px",
            alignItems: "center",
          }}
        >
          <div style={{ overflow: "hidden", borderRadius: "12px" }}>
            <img
              src="/product-1.jpg"
              alt="Baker carefully piping frosting onto a layered chocolate cake"
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                display: "block",
                transition: "transform 600ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={{ paddingLeft: "24px" }}>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#B8860B",
                display: "block",
                marginBottom: "20px",
              }}
            >
              OUR CRAFT
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text)",
                marginBottom: "24px",
              }}
            >
              The Art of Indulgence
            </h2>
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "16px",
                lineHeight: 1.75,
                color: "var(--muted)",
                marginBottom: "32px",
                maxWidth: "480px",
              }}
            >
              Every cake from our kitchen is a testament to timeless traditions and a
              passion for perfection. We meticulously select the finest cocoa, farm-fresh
              dairy, and premium ingredients to ensure a symphony of flavours in every bite.
            </p>
            <div
              style={{
                width: "64px",
                height: "2px",
                backgroundColor: "#B8860B",
                marginBottom: "32px",
              }}
            />
            <button
              onClick={() => router.push("/shop")}
              className="focus-ring"
              style={{
                padding: "16px 40px",
                backgroundColor: "#B8860B",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "transform 150ms ease, box-shadow 150ms ease",
                boxShadow: "0 8px 24px rgba(184,134,11,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(184,134,11,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(184,134,11,0.3)";
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Explore Our Collection
            </button>
          </div>
        </div>
      </section>

      {/* ── GIFTING BANNER ── */}
      <section
        style={{
          padding: "96px 48px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--accent)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(140,28,30,0.6) 0%, rgba(103,57,38,0.4) 100%)",
            pointerEvents: "none",
          }}
        />
        <div className="reveal" style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginBottom: "16px",
            }}
          >
            Thoughtful Gifting Made Easy
          </h2>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(245,237,224,0.8)",
              marginBottom: "32px",
            }}
          >
            Share the joy of handcrafted indulgence with our exquisite gift options.
            Custom boxes, personalised messages, and next-day delivery available.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="focus-ring"
            style={{
              height: "52px",
              padding: "0 36px",
              border: "2px solid rgba(245,237,224,0.85)",
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: "var(--text)",
              fontSize: "15px",
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "background-color 200ms ease, transform 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(245,237,224,0.12)";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Send a Sweet Surprise
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: "#0a0805",
          borderTop: "1px solid rgba(245,237,224,0.07)",
          padding: "72px 48px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr",
            gap: "48px",
            paddingBottom: "56px",
          }}
        >
          {/* Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", width: "fit-content" }}>
              <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: "240px",
              }}
            >
              Handcrafted Moments of Sweetness — baked with love, delivered with care.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "var(--text)", transition: "color 200ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B8860B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "var(--text)", transition: "color 200ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B8860B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              Shop
            </h4>
            {["Cakes", "Seasonal", "Gift Cards", "Corporate Gifting"].map((l) => (
              <button
                key={l}
                onClick={() => router.push("/shop")}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "14px",
                  color: "var(--muted)",
                  padding: "5px 0",
                  textAlign: "left",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <h4
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              Discover
            </h4>
            {["Our Story", "Ingredients", "FAQs", "Press"].map((l) => (
              <button
                key={l}
                onClick={() => router.push("/")}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "14px",
                  color: "var(--muted)",
                  padding: "5px 0",
                  textAlign: "left",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "16px",
              }}
            >
              Stay Indulged
            </h4>
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "13px",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              Seasonal menus, new launches & exclusive offers — straight to your inbox.
            </p>
            {subscribed ? (
              <p
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "14px",
                  color: "#4a7c59",
                  fontWeight: 600,
                  padding: "12px 0",
                }}
              >
                ✓ You're on the list! Welcome to the Zeppoli family.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    height: "48px",
                    padding: "0 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(245,237,224,0.15)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "var(--text)",
                    fontSize: "14px",
                    fontFamily: "'Nunito Sans', sans-serif",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <button
                  onClick={() => {
                    if (email.includes("@")) setSubscribed(true);
                  }}
                  style={{
                    height: "48px",
                    width: "100%",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#B8860B",
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid rgba(245,237,224,0.07)",
            padding: "24px 0",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "12px",
              color: "var(--muted)",
            }}
          >
            <span>© 2026 Zeppoli Bakers. All Rights Reserved.</span>
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Terms of Service
            </button>
          </div>

          {/* Payment icons */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {["VISA", "MC", "AMEX", "UPI"].map((pay) => (
              <span
                key={pay}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "26px",
                  borderRadius: "4px",
                  border: "1px solid rgba(245,237,224,0.12)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "var(--muted)",
                  fontSize: "8px",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          section[style*="padding: 96px 80px"] {
            padding: 64px 24px !important;
          }
          section[style*="padding-left: 48px"] {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}