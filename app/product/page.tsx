"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";

const PRODUCTS = [
  { id: 1, img: "/product-1.jpg", name: "Decadent Chocolate Cake", description: "A decadent, round, multi-layered chocolate cake, generously covered in chocolate frosting and topped with chocolate shavings.", price: 999 },
  { id: 2, img: "/product-2.jpg", name: "Red Velvet Dream", description: "A premium, multi-layered Red Velvet cake with velvety cream cheese frosting and a vibrant crimson crumb.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Blueberry Cheesecake", description: "A classic, generously proportioned circular blueberry cheesecake with a buttery biscuit base and fresh berry compote.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Caramel Celebration", description: "A premium, round caramel cake layered with salted caramel buttercream and a glossy toffee drizzle.", price: 499 },
];

const SIZES = [
  { label: "Small", sub: "6 servings", multiplier: 1 },
  { label: "Medium", sub: "8 servings", multiplier: 1.4 },
  { label: "Large", sub: "12 servings", multiplier: 1.9 },
];

const REVIEWS = [
  { name: "Priya Sharma", date: "12 Jan 2025", stars: 5, text: "Absolutely divine! The chocolate layers were perfectly moist and the frosting had just the right richness. Ordered for my daughter's birthday and she was thrilled." },
  { name: "Rohan Mehta", date: "5 Feb 2025", stars: 5, text: "Best chocolate cake I've had outside of Paris. The shavings on top add such an elegant touch. Will definitely order again for our anniversary." },
  { name: "Anika Joshi", date: "28 Mar 2025", stars: 4, text: "Beautifully crafted and incredibly indulgent. The ridged frosting sides are stunning. Delivery was prompt and the cake arrived in perfect condition." },
  { name: "Vikram Nair", date: "14 Apr 2025", stars: 5, text: "Ordered the large size for an office celebration. Sixteen people and not a single crumb left. The chocolate is so intense and satisfying. Premium quality." },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#B8860B" : "none"} stroke="#B8860B" strokeWidth="1.5" style={{ display: "inline" }}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#B8860B", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700 }}>{count}</span>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, items } = useCart() ?? { addItem: () => {}, items: [] };

  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Decadent Chocolate Cake";
  const rawPrice = paramPrice && paramPrice > 0 ? paramPrice : 999;

  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [addMessage, setAddMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showMessageToggle, setShowMessageToggle] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [notification, setNotification] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const thumbImages = [displayImg, "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];
  const activeImg = thumbImages[activeThumb];
  const currentPrice = Math.round(rawPrice * SIZES[selectedSize].multiplier);
  const cartCount = items?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = useCallback(() => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: currentPrice, quantity, image: displayImg });
    setAdded(true);
    setNotification(true);
    setTimeout(() => setAdded(false), 1500);
    setTimeout(() => setNotification(false), 3000);
  }, [addItem, displayName, currentPrice, quantity, displayImg]);

  const handleBuyNow = useCallback(() => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: currentPrice, quantity, image: displayImg });
    router.push("/checkout");
  }, [addItem, displayName, currentPrice, quantity, displayImg, router]);

  const navBg = scrolled ? "rgba(17,13,8,0.97)" : "transparent";
  const navBorder = scrolled ? "1px solid rgba(245,237,224,0.08)" : "none";

  const relatedProducts = PRODUCTS.filter((p) => p.img !== displayImg).slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif", color: "var(--text)", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');
        :root { --bg:#110D08; --surface:#A85A5F; --primary:#8C1C1E; --accent:#673926; --text:#F5EDE0; --muted:#9B8B7D; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); }
        ::selection { background: #8C1C1E40; color: var(--text); }
        a { text-decoration: none; color: inherit; }
        button:focus-visible, a:focus-visible { outline: 2px solid #B8860B; outline-offset: 2px; border-radius: 4px; }
        @media (max-width: 768px) {
          .product-layout { flex-direction: column !important; }
          .image-col { width: 100% !important; position: static !important; }
          .info-col { width: 100% !important; padding: 32px 20px !important; }
          .desktop-cta { display: none !important; }
          .mobile-cta { display: flex !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .nav-links-desktop { display: none !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .footer-bottom { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
        }
        @media (min-width: 769px) {
          .mobile-cta { display: none !important; }
        }
      `}</style>

      {/* Notification */}
      <div style={{ position: "fixed", top: notification ? "24px" : "-80px", right: "24px", zIndex: 9999, background: "#B8860B", color: "#fff", padding: "14px 24px", borderRadius: "8px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", transition: "top 0.4s cubic-bezier(0.4,0,0.2,1)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        Item added to bag
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div onClick={() => setShowLightbox(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <button onClick={() => setShowLightbox(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <CloseIcon />
          </button>
          <img src={activeImg} alt={displayName} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px" }} />
        </div>
      )}

      {/* Mobile Nav Overlay */}
      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9997, background: "var(--bg)", display: "flex", flexDirection: "column", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "36px", objectFit: "contain" }} onClick={() => { router.push("/"); setMobileNav(false); }} className="cursor-pointer" />
            <button onClick={() => setMobileNav(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}><CloseIcon /></button>
          </div>
          {["Cakes", "Seasonal", "Gifting", "Our Story", "Contact"].map((link) => (
            <button key={link} onClick={() => { router.push("/shop"); setMobileNav(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "28px", fontWeight: 600, color: "var(--text)", textAlign: "left", padding: "16px 0", borderBottom: "1px solid rgba(245,237,224,0.08)" }}>{link}</button>
          ))}
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, background: navBg, borderBottom: navBorder, transition: "background 0.2s ease, border 0.2s ease", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }} className="nav-links-desktop" style2={{}}>
            <div style={{ display: "none" }} className="nav-links-desktop" />
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <div className="nav-links-desktop" style={{ display: "none" }} />
            <span style={{ display: "block" }} className="block md:hidden">
              <MenuIcon />
            </span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(245,237,224,0.08)" }}>
              <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
            </div>
          </div>

          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {["Cakes", "Seasonal", "Gifting", "Our Story", "Contact"].map((l) => (
              <button key={l} onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.01em", transition: "color 0.2s ease", opacity: 0.85 }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}>{l}</button>
            ))}
          </div>

          <div onClick={() => router.push("/checkout")} style={{ cursor: "pointer" }}>
            <CartIcon count={cartCount} />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ paddingTop: "96px", paddingBottom: "0", paddingLeft: "24px", paddingRight: "24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", color: "var(--muted)" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px" }}>Home</button>
          <span style={{ opacity: 0.5 }}>/</span>
          <button onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px" }}>Shop</button>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--text)", opacity: 0.7 }}>{displayName}</span>
        </div>
      </div>

      {/* Product Layout */}
      <div className="product-layout" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 96px", display: "flex", gap: "48px", alignItems: "flex-start" }}>
        {/* Image Column */}
        <div className="image-col" style={{ width: "55%", position: "sticky", top: "88px" }}>
          {/* Main Image */}
          <div style={{ overflow: "hidden", borderRadius: "16px", background: "rgba(168,90,95,0.12)", cursor: "zoom-in", position: "relative" }} onClick={() => setShowLightbox(true)}>
            <img
              src={activeImg}
              alt={`${displayName} - main product view`}
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", transition: "transform 0.6s ease", display: "block" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(17,13,8,0.6)", borderRadius: "8px", padding: "8px", backdropFilter: "blur(4px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {thumbImages.map((src, i) => (
              <button key={i} onClick={() => setActiveThumb(i)} style={{ flex: 1, background: "none", border: activeThumb === i ? "2px solid #B8860B" : "2px solid transparent", borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s ease", padding: 0 }}>
                <img src={src} alt={`${displayName} view ${i + 1}`} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", transition: "transform 0.4s ease", filter: activeThumb === i ? "none" : "brightness(0.7)" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </button>
            ))}
          </div>

          {/* Trust badge */}
          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "rgba(168,90,95,0.1)", borderRadius: "12px", border: "1px solid rgba(168,90,95,0.2)" }}>
            <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(s => <StarIcon key={s} filled={true} />)}</div>
            <span style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>4.9 · 1,200+ Happy Customers · Handcrafted Daily</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="info-col" style={{ width: "45%", paddingTop: "8px" }}>
          {/* Eyebrow */}
          <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8860B", display: "block", marginBottom: "12px" }}>Zeppoli Bakers · Signature Collection</span>

          {/* Product Name */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2.4rem, 4vw, 3.2rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "16px" }}>{displayName}</h1>

          {/* Rating row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(s => <StarIcon key={s} filled={true} />)}</div>
            <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>4.9 (128 reviews)</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(245,237,224,0.15)", display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: "#B8860B", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>In Stock</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#B8860B", transition: "opacity 0.15s ease-in-out" }}>₹{currentPrice.toLocaleString("en-IN")}</span>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", color: "var(--muted)", textDecoration: "line-through" }}>₹{Math.round(currentPrice * 1.15).toLocaleString("en-IN")}</span>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", fontWeight: 700, background: "rgba(140,28,30,0.3)", color: "#F5EDE0", padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.05em" }}>SAVE 15%</span>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: "1px", background: "rgba(245,237,224,0.08)", marginBottom: "28px" }} />

          {/* Description */}
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", marginBottom: "32px" }}>
            {displayName === "Decadent Chocolate Cake"
              ? "A decadent, round, multi-layered chocolate cake, generously covered in silky chocolate frosting and topped with abundant, finely chopped chocolate shavings. Ridged bands of frosting encircle the sides while elegant piped swirls crown the top edge — a masterpiece of classic confectionery artistry."
              : PRODUCTS.find(p => p.img === displayImg)?.description ?? "A beautifully handcrafted cake made fresh daily in our kitchen using premium ingredients sourced with care."}
          </p>

          {/* Size Selector */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Select Size</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {SIZES.map((s, i) => (
                <button key={i} onClick={() => setSelectedSize(i)} style={{ padding: "10px 20px", borderRadius: "8px", border: selectedSize === i ? "none" : "1px solid rgba(245,237,224,0.15)", background: selectedSize === i ? "#B8860B" : "rgba(245,237,224,0.05)", color: selectedSize === i ? "#fff" : "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                  <span>{s.label}</span>
                  <span style={{ fontSize: "11px", opacity: 0.75, fontWeight: 400 }}>{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0", width: "fit-content", border: "1px solid rgba(245,237,224,0.15)", borderRadius: "8px", overflow: "hidden" }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "44px", height: "44px", background: "rgba(245,237,224,0.05)", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s ease", fontFamily: "'Nunito Sans', sans-serif" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,237,224,0.12)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,237,224,0.05)")}>−</button>
              <span style={{ width: "52px", textAlign: "center", fontFamily: "'Nunito Sans', sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--text)", userSelect: "none" }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(10, q + 1))} style={{ width: "44px", height: "44px", background: "rgba(245,237,224,0.05)", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s ease", fontFamily: "'Nunito Sans', sans-serif" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,237,224,0.12)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,237,224,0.05)")}>+</button>
            </div>
          </div>

          {/* Add Message Toggle */}
          <div style={{ marginBottom: "28px" }}>
            <button onClick={() => setShowMessageToggle(t => !t)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", color: "#B8860B", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              {showMessageToggle ? "Hide" : "Add a Personal Message"}
            </button>
            {showMessageToggle && (
              <textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Write your heartfelt message here..." rows={3} style={{ marginTop: "12px", width: "100%", padding: "12px 16px", background: "rgba(245,237,224,0.04)", border: "1px solid rgba(245,237,224,0.12)", borderRadius: "8px", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", lineHeight: 1.6, resize: "vertical", outline: "none" }} />
            )}
          </div>

          {/* CTA Buttons — Desktop */}
          <div className="desktop-cta" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={handleAddToCart} style={{ width: "100%", height: "60px", background: added ? "rgba(140,28,30,0.9)" : "#B8860B", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "17px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.25s ease, transform 0.15s ease", letterSpacing: "0.02em" }} onMouseEnter={e => { if (!added) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#A07508"; } }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; if (!added) e.currentTarget.style.background = "#B8860B"; }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              {added ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Added to Bag
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                  Add to Cart
                </>
              )}
            </button>
            <button onClick={handleBuyNow} style={{ width: "100%", height: "60px", background: "transparent", color: "var(--text)", border: "1.5px solid rgba(245,237,224,0.25)", borderRadius: "12px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "17px", fontWeight: 700, cursor: "pointer", transition: "border-color 0.25s ease, transform 0.15s ease, background 0.25s ease", letterSpacing: "0.02em" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#B8860B"; e.currentTarget.style.background = "rgba(184,134,11,0.08)"; e.currentTarget.style.transform = "scale(1.02)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,224,0.25)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              Buy Now
            </button>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: "24px", marginTop: "28px", flexWrap: "wrap" }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free delivery over ₹1,200" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Made fresh daily" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: "Made in India" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {t.icon}
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--muted)" }}>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Ingredients highlight */}
          <div style={{ marginTop: "32px", padding: "20px", background: "rgba(103,57,38,0.15)", borderRadius: "12px", border: "1px solid rgba(103,57,38,0.3)" }}>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>Key Ingredients</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Belgian Dark Chocolate", "Farm-fresh Cream", "Imported Cocoa", "Pure Vanilla", "Free-range Eggs"].map(ing => (
                <span key={ing} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--text)", background: "rgba(245,237,224,0.07)", padding: "5px 12px", borderRadius: "999px", border: "1px solid rgba(245,237,224,0.1)" }}>{ing}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="mobile-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 998, background: "rgba(17,13,8,0.97)", borderTop: "1px solid rgba(245,237,224,0.08)", padding: "12px 20px 20px", backdropFilter: "blur(12px)", alignItems: "center", gap: "16px" }}>
        <div style={{ flex: "0 0 auto" }}>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", color: "var(--muted)", lineHeight: 1 }}>Total</p>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#B8860B", lineHeight: 1.2 }}>₹{(currentPrice * quantity).toLocaleString("en-IN")}</p>
        </div>
        <button onClick={handleAddToCart} style={{ flex: 1, height: "52px", background: added ? "rgba(140,28,30,0.9)" : "#B8860B", color: "#fff", border: "none", borderRadius: "10px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.25s ease" }}>
          {added ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>Added to Bag</>
          ) : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} style={{ flex: 1, height: "52px", background: "transparent", color: "var(--text)", border: "1.5px solid rgba(245,237,224,0.2)", borderRadius: "10px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Buy Now</button>
      </div>

      {/* Reviews Section */}
      <section className="reveal" style={{ background: "rgba(103,57,38,0.08)", padding: "96px 24px", marginBottom: "0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8860B", display: "block", marginBottom: "12px" }}>What Our Customers Say</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)" }}>Moments of Pure Indulgence</h2>
          </div>
          <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="reveal" style={{ background: "rgba(245,237,224,0.04)", border: "1px solid rgba(245,237,224,0.08)", borderRadius: "16px", padding: "28px 24px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(140,28,30,0.15)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                  {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= r.stars} />)}
                </div>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "var(--muted)", marginBottom: "20px" }}>"{r.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{r.name}</span>
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--muted)" }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="reveal" style={{ padding: "96px 24px", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8860B", display: "block", marginBottom: "12px" }}>You May Also Love</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)" }}>More from Our Kitchen</h2>
          </div>
          <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {relatedProducts.map((p, i) => {
              const productPrice = p.price > 0 ? p.price : 999;
              return (
                <article key={p.id} className="reveal" onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${productPrice}&img=${encodeURIComponent(p.img)}`)} style={{ cursor: "pointer", background: "rgba(245,237,224,0.03)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(245,237,224,0.07)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(140,28,30,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <img src={p.img} alt={`${p.name} - related product`} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.6s ease" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                    {/* Visual Fingerprint: SVG flourish overlay on hover */}
                    <div className={`card-flourish-${i}`} style={{ position: "absolute", bottom: "12px", right: "12px", opacity: 0, transform: "scale(0.8)", transition: "opacity 0.2s ease-out, transform 0.2s ease-out", pointerEvents: "none" }}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M24 44 C10 36, 6 24, 14 14 C20 6, 30 8, 34 16 C40 28, 30 40, 24 44Z" stroke="rgba(245,237,224,0.6)" strokeWidth="1.5" fill="none" />
                        <path d="M24 38 C16 32, 14 24, 18 18" stroke="rgba(245,237,224,0.4)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                        <circle cx="24" cy="12" r="3" fill="rgba(184,134,11,0.7)" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "18px", fontWeight: 600, color: "var(--text)", marginBottom: "6px", transition: "transform 0.2s ease-out" }}>{p.name}</h3>
                    <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, marginBottom: "16px" }}>{p.description.slice(0, 60)}…</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#B8860B" }}>₹{productPrice.toLocaleString("en-IN")}</span>
                      <button onClick={e => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${productPrice}&img=${encodeURIComponent(p.img)}`); }} style={{ padding: "8px 16px", background: "none", border: "1px solid #B8860B", borderRadius: "6px", color: "#B8860B", fontFamily: "'Nunito Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.12)"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>View Details</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button onClick={() => router.push("/shop")} style={{ padding: "16px 48px", background: "var(--primary)", color: "var(--text)", border: "none", borderRadius: "12px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "16px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 10px 30px -10px rgba(140,28,30,0.5)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(140,28,30,0.6)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(140,28,30,0.5)"; }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>Explore Our Collection</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "rgba(10,7,4,0.95)", borderTop: "1px solid rgba(245,237,224,0.07)", padding: "72px 24px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "48px", paddingBottom: "64px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
              </div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "240px" }}>Handcrafted Moments of Sweetness. Every cake baked fresh, every day, with love.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)", marginBottom: "20px" }}>Shop</p>
              {["Cakes", "Seasonal", "Gift Cards", "Corporate Gifting"].map(l => (
                <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", color: "var(--muted)", padding: "5px 0", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>{l}</button>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)", marginBottom: "20px" }}>Discover</p>
              {["Our Story", "Ingredients", "FAQs", "Press"].map(l => (
                <button key={l} onClick={() => router.push("/")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", color: "var(--muted)", padding: "5px 0", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>{l}</button>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "20px", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Stay Indulged</p>
              <input type="email" placeholder="Enter your email" style={{ width: "100%", height: "48px", padding: "0 16px", background: "rgba(245,237,224,0.05)", border: "1px solid rgba(245,237,224,0.12)", borderRadius: "8px", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", marginBottom: "10px", outline: "none" }} />
              <button style={{ width: "100%", height: "48px", background: "#B8860B", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "background 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.background = "#A07508")} onMouseLeave={e => (e.currentTarget.style.background = "#B8860B")}>Subscribe</button>
            </div>
          </div>
          <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderTop: "1px solid rgba(245,237,224,0.07)" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--muted)" }}>© 2026 Zeppoli Bakers, All Rights Reserved.</span>
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--muted)", textDecoration: "underline" }}>Privacy Policy</button>
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px", color: "var(--muted)", textDecoration: "underline" }}>Terms of Service</button>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px", color: "var(--muted)" }}>We accept</span>
              {["UPI", "Visa", "MC", "Amex"].map(p => (
                <span key={p} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "10px", fontWeight: 700, padding: "3px 7px", border: "1px solid rgba(245,237,224,0.15)", borderRadius: "4px", color: "var(--muted)", letterSpacing: "0.05em" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}