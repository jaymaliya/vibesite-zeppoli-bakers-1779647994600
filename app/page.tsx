"use client";
import { useRouter } from "next/navigation"
import { useCart } from "../components/CartContext"
import { useState, useEffect, useRef } from "react"

const products = [
  { id: 1, img: "/product-1.jpg", name: "Decadent Chocolate Cake", description: "Layers of rich cocoa and smooth chocolate ganache", price: 999 },
  { id: 2, img: "/product-2.jpg", name: "Classic Red Velvet", description: "Velvety layers with luscious cream cheese frosting", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Blueberry Cheesecake", description: "Creamy cheesecake crowned with fresh blueberries", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Salted Caramel Dream", description: "Rich caramel layers with buttery toffee drizzle", price: 499 },
]

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1"
          ;(e.target as HTMLElement).style.transform = "translateY(0)"
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    els.forEach((el) => {
      ;(el as HTMLElement).style.opacity = "0"
      ;(el as HTMLElement).style.transform = "translateY(24px)"
      ;(el as HTMLElement).style.transition = "opacity 600ms ease-out, transform 600ms ease-out"
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
}

export default function HomePage() {
  const router = useRouter()
  const { addItem, items } = useCart()
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  useScrollReveal()

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleAddItem(p: typeof products[0]) {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!carouselRef.current) return
    isDragging.current = true
    startX.current = e.pageX - carouselRef.current.offsetLeft
    scrollLeft.current = carouselRef.current.scrollLeft
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    carouselRef.current.scrollLeft = scrollLeft.current - (x - startX.current)
  }
  function onMouseUp() { isDragging.current = false }

  return (
    <>
      <style>{`
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
        body { background: var(--bg); color: var(--text); font-family: 'Nunito Sans', sans-serif; overflow-x: hidden; }
        h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-track { -ms-overflow-style: none; scrollbar-width: none; }
        .flourish-svg { opacity: 0; transform: scale(0.8); transition: opacity 300ms ease, transform 300ms ease; pointer-events: none; }
        .card-hover:hover .flourish-svg { opacity: 1; transform: scale(1); }
        button:focus-visible, a:focus-visible { outline: 2px solid var(--surface); outline-offset: 3px; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { display: none !important; }
          .crafted-grid { grid-template-columns: 1fr !important; }
          .seasonal-grid { grid-template-columns: 1fr !important; }
          .story-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? "rgba(17,13,8,0.97)" : "transparent",
        borderBottom: navScrolled ? "1px solid rgba(245,237,224,0.08)" : "none",
        transition: "background 200ms ease, border-color 200ms ease",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
            {["Cakes","Seasonal","Gifting","Our Story"].map((link) => (
              <button key={link} onClick={() => {
                if (link === "Cakes" || link === "Seasonal") router.push("/shop")
                else if (link === "Gifting") router.push("/shop")
                else document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })
              }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", fontWeight: 600, letterSpacing: "0.02em", transition: "color 200ms ease, text-shadow 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--surface)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                {link}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Cart icon */}
            <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", padding: "8px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "2px", right: "2px", background: "var(--surface)", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
            {/* Hamburger */}
            <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", flexDirection: "column", gap: "5px", padding: "8px" }}>
              <span style={{ width: "22px", height: "2px", background: "currentColor", display: "block", borderRadius: "2px" }} />
              <span style={{ width: "22px", height: "2px", background: "currentColor", display: "block", borderRadius: "2px" }} />
              <span style={{ width: "22px", height: "2px", background: "currentColor", display: "block", borderRadius: "2px" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAV OVERLAY ── */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(17,13,8,0.98)", display: "flex", flexDirection: "column", padding: "32px 24px", transition: "opacity 300ms ease-out" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {["Cakes","Seasonal","Gifting","Our Story","Contact"].map((link) => (
            <button key={link} onClick={() => {
              setMobileOpen(false)
              if (link === "Cakes" || link === "Seasonal" || link === "Gifting") router.push("/shop")
              else if (link === "Our Story") document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })
              else router.push("/shop")
            }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontStyle: "italic", fontWeight: 500, textAlign: "left", padding: "0 0 24px", borderBottom: "1px solid rgba(245,237,224,0.08)", marginBottom: "24px" }}>
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--bg)", paddingTop: "72px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "60fr 40fr", alignItems: "center", minHeight: "calc(100vh - 72px)" }} className="hero-grid">
          {/* Left text col */}
          <div style={{ padding: "80px 64px 80px 48px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Zeppoli Bakers · Handcrafted Daily</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.8rem, 6.5vw, 5.5rem)", fontWeight: 700, fontStyle: "italic", lineHeight: 1.05, letterSpacing: "-0.04em", color: "var(--text)" }}>
              Pure Indulgence,<br />Perfected
            </h1>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "480px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              Each cake crafted with the finest cocoa, farm-fresh dairy, and generations of artisanal know-how. Made for moments worth celebrating.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => router.push("/shop")} style={{ padding: "16px 40px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--primary)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.02em", boxShadow: "0 10px 40px -10px #8C1C1E80", transition: "transform 150ms ease, box-shadow 150ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 50px -10px #8C1C1E99" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 40px -10px #8C1C1E80" }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                Explore Our Collection
              </button>
              <button onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "16px 32px", borderRadius: "12px", border: "2px solid rgba(245,237,224,0.2)", cursor: "pointer", background: "transparent", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "15px", transition: "border-color 200ms ease, transform 150ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--surface)"; e.currentTarget.style.transform = "scale(1.02)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,224,0.2)"; e.currentTarget.style.transform = "scale(1)" }}>
                Our Story
              </button>
            </div>
            {/* Trust signals */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", paddingTop: "8px" }}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#A85A5F" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, text: "4.9 · 3,200+ Reviews" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A85A5F" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, text: "Handcrafted Daily" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A85A5F" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free Delivery ₹1200+" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
                  {t.icon}<span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right image col — bleeds to edge */}
          <div className="hero-image-col" style={{ height: "100%", minHeight: "calc(100vh - 72px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e1108 0%, #2a1510 100%)", overflow: "hidden" }}>
            <div style={{ overflow: "hidden", width: "85%", borderRadius: "20px", boxShadow: "0 40px 80px -20px rgba(140,28,30,0.3)" }}>
              <img src="/product-1.jpg" alt="Decadent multi-layered chocolate cake with ridged frosting and chocolate shavings" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 700ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #110D08 0%, transparent 30%)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* ── A TASTE OF OUR CRAFT (Carousel) ── */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }} className="reveal">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", marginBottom: "48px" }}>
          <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Featured</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 4.5vw, 4rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginTop: "8px" }}>A Taste of Our Craft</h2>
        </div>
        <div ref={carouselRef} className="carousel-track" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          style={{ display: "flex", gap: "32px", overflowX: "auto", paddingLeft: "48px", paddingRight: "48px", cursor: "grab", paddingBottom: "16px", userSelect: "none" }}>
          {products.map((p, i) => (
            <div key={p.id} className="card-hover reveal" style={{ flex: "0 0 calc(30% - 16px)", minWidth: "280px", borderRadius: "16px", background: hoveredCard === p.id ? "#2A1810" : "rgba(255,255,255,0.03)", border: "1px solid rgba(245,237,224,0.06)", overflow: "hidden", cursor: "pointer", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1), background 300ms ease", animationDelay: `${i * 80}ms`, position: "relative" }}
              onMouseEnter={e => { setHoveredCard(p.id); e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(140,28,30,0.25)" }}
              onMouseLeave={e => { setHoveredCard(null); e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
              {/* Image */}
              <div style={{ overflow: "hidden", position: "relative", background: "#1E1208" }}>
                <img src={p.img} alt={p.name + " cake"} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 400ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                {/* SVG flourish on hover */}
                <svg className="flourish-svg" width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", bottom: "12px", right: "12px" }}>
                  <path d="M60 20 Q70 40 60 60 Q40 70 20 60 Q10 40 20 20 Q40 10 60 20Z" fill="none" stroke="rgba(168,90,95,0.6)" strokeWidth="1.5" />
                  <path d="M50 30 Q55 40 50 50 Q40 55 30 50 Q25 40 30 30 Q40 25 50 30Z" fill="none" stroke="rgba(168,90,95,0.4)" strokeWidth="1" />
                  <circle cx="40" cy="40" r="4" fill="rgba(168,90,95,0.5)" />
                </svg>
              </div>
              {/* Card content */}
              <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 600, color: "var(--text)", transition: "transform 200ms ease-out", transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)" }}>{p.name}</h3>
                <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, fontFamily: "'Nunito Sans', sans-serif" }}>{p.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                  <span style={{ color: "var(--surface)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "18px" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  <button onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`) }}
                    style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid rgba(168,90,95,0.5)", background: "transparent", color: "var(--surface)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: "background 200ms ease, color 200ms ease" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "#fff" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--surface)" }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CRAFTED WITH PASSION ── */}
      <section style={{ padding: "96px 48px", background: "rgba(255,255,255,0.02)" }} className="reveal">
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "40fr 60fr", gap: "80px", alignItems: "center" }} className="crafted-grid">
          <div style={{ overflow: "hidden", borderRadius: "8px" }}>
            <img src="/product-2.jpg" alt="Baker carefully piping frosting onto an artisan cake, showcasing handcraft" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", transition: "transform 700ms ease", borderRadius: "8px" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Our Process</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)" }}>The Art of Indulgence</h2>
            <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", maxWidth: "560px" }}>
              Every cake from our kitchen is a testament to timeless traditions and a passion for perfection. We meticulously select the finest cocoa, farm-fresh dairy, and premium ingredients to ensure a symphony of flavours in every single bite.
            </p>
            <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", maxWidth: "560px" }}>
              From the first fold of batter to the final chocolate shaving placed by hand, each creation carries the quiet pride of people who truly love what they make.
            </p>
            <div style={{ width: "60px", height: "1px", background: "var(--surface)", opacity: 0.6 }} />
            <button onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })} style={{ alignSelf: "flex-start", padding: "14px 32px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--accent)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "15px", transition: "transform 150ms ease, box-shadow 150ms ease", boxShadow: "0 8px 24px -8px #67392650" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px #67392680" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px #67392650" }}>
              Discover Our Heritage
            </button>
          </div>
        </div>
      </section>

      {/* ── SEASONAL INDULGENCE ── */}
      <section style={{ padding: "96px 48px", background: "var(--bg)" }} className="reveal">
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Limited Offerings</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginTop: "12px" }}>Seasonal Indulgence</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="seasonal-grid">
            {/* Block 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ overflow: "hidden", borderRadius: "8px", background: "rgba(168,90,95,0.08)" }}>
                <img src="/product-2.jpg" alt="Classic Red Velvet cake on a white ceramic plate with seasonal rose garnish" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Spring Collection</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>Spring Bloom Collection</h3>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
                Experience the vibrant flavours of spring with our light and airy Red Velvet, topped with cream cheese frosting and delicate edible flowers. Each bite is a celebration.
              </p>
              <span style={{ color: "var(--surface)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "20px" }}>From ₹{(1150).toLocaleString("en-IN")}</span>
              <button onClick={() => router.push("/shop")} style={{ alignSelf: "flex-start", padding: "14px 32px", borderRadius: "8px", border: "none", cursor: "pointer", background: "var(--primary)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "15px", transition: "transform 150ms ease", boxShadow: "0 8px 24px -8px #8C1C1E60" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                Shop Spring
              </button>
            </div>
          </div>
          {/* Block 2 reversed */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center", marginTop: "80px" }} className="seasonal-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Summer Special</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>Berry Bliss Edition</h3>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
                Our Blueberry Cheesecake arrives with fresh seasonal blueberries piled generously over a silken cream filling. Cool, refreshing, and impossibly indulgent.
              </p>
              <span style={{ color: "var(--surface)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "20px" }}>From ₹{(1299).toLocaleString("en-IN")}</span>
              <button onClick={() => router.push("/shop")} style={{ alignSelf: "flex-start", padding: "14px 32px", borderRadius: "8px", border: "none", cursor: "pointer", background: "var(--primary)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "15px", transition: "transform 150ms ease", boxShadow: "0 8px 24px -8px #8C1C1E60" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                Shop Summer
              </button>
            </div>
            <div style={{ overflow: "hidden", borderRadius: "8px", background: "rgba(103,57,38,0.15)" }}>
              <img src="/product-3.jpg" alt="Blueberry Cheesecake with fresh blueberries on a pristine ceramic plate" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PERFECT GIFT ── */}
      <section style={{ position: "relative", overflow: "hidden" }} className="reveal">
        <div style={{ position: "relative", minHeight: "560px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/product-4.jpg" alt="Beautifully presented caramel cake gift box with satin ribbon" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(2px) brightness(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(17,13,8,0.4), rgba(17,13,8,0.4))" }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "80px 48px", maxWidth: "760px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 5vw, 4rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#FFFFFF", marginBottom: "20px" }}>Thoughtful Gifting Made Easy</h2>
            <p style={{ fontSize: "18px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", marginBottom: "36px", fontFamily: "'Nunito Sans', sans-serif" }}>Share the joy of handcrafted indulgence with our exquisite gift options — perfect for every occasion worth remembering.</p>
            <button onClick={() => router.push("/shop")} style={{ padding: "16px 40px", borderRadius: "6px", border: "2px solid rgba(255,255,255,0.85)", background: "transparent", color: "#fff", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "16px", cursor: "pointer", transition: "background 200ms ease, transform 150ms ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "scale(1.02)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)" }}>
              Send a Sweet Surprise
            </button>
          </div>
        </div>
      </section>

      {/* ── BEHIND THE BAKE (video-style with pull quote) ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "400px", display: "flex", alignItems: "flex-end", background: "#1A0E08" }} className="reveal">
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {["/product-1.jpg", "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"].map((src, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <img src={src} alt={`Baking process detail ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.6)" }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,13,8,0.9) 40%, rgba(17,13,8,0.2) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", textAlign: "center", padding: "60px 48px 80px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontStyle: "italic", fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
            "Where Every Ingredient Tells a Story."
          </p>
        </div>
      </section>

      {/* ── OUR STORY & PHILOSOPHY ── */}
      <section id="our-story" style={{ padding: "96px 48px", background: "rgba(103,57,38,0.08)" }} className="reveal">
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "25fr 50fr 25fr", gap: "48px", alignItems: "stretch" }} className="story-grid">
          {/* Left accent bar */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "4px", background: "var(--surface)", borderRadius: "4px", alignSelf: "stretch", minHeight: "200px", opacity: 0.7 }} />
          </div>
          {/* Middle content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--surface)" }}>Our Heritage</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)" }}>A Legacy of Sweetness</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              Zeppoli Bakers was born from a simple belief: that the finest cake is one made with unhurried care, the best ingredients, and an unwavering commitment to the happiness of the person eating it.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              We source single-origin cocoa, use dairy from trusted local farms, and bake every item fresh each morning. No shortcuts. No compromises. Just pure, unforgettable indulgence — crafted with the kind of patience that only comes from truly loving your craft.
            </p>
            <div style={{ width: "60px", height: "1px", background: "var(--surface)", opacity: 0.5, marginTop: "8px" }} />
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontStyle: "italic" }}>
              "Every layer is a memory waiting to be made." — Founder, Zeppoli Bakers
            </p>
          </div>
          {/* Right archival image */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ border: "4px solid var(--accent)", borderRadius: "4px", overflow: "hidden", width: "100%", maxWidth: "220px" }}>
              <img src="/product-4.jpg" alt="Vintage baking tools and artisan craft elements representing Zeppoli heritage" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", filter: "sepia(30%) brightness(0.85)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0C0906", borderTop: "1px solid rgba(245,237,224,0.06)", padding: "80px 48px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }} className="footer-grid">
          {/* Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", alignSelf: "flex-start" }}>
              <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>Handcrafted Moments of Sweetness</p>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", transition: "color 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--surface)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", transition: "color 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--surface)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
          {/* Col 2 */}
          <div>
            <p style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text)", marginBottom: "20px" }}>Shop</p>
            {["Cakes","Seasonal","Gift Cards","Corporate Gifting"].map(l => (
              <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", lineHeight: 1.6, marginBottom: "10px", padding: 0, textAlign: "left", transition: "color 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {l}
              </button>
            ))}
          </div>
          {/* Col 3 */}
          <div>
            <p style={{ fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text)", marginBottom: "20px" }}>Discover</p>
            {["Our Story","Ingredients","FAQs","Press"].map(l => (
              <button key={l} onClick={() => l === "Our Story" ? document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }) : undefined} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", lineHeight: 1.6, marginBottom: "10px", padding: 0, textAlign: "left", transition: "color 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {l}
              </button>
            ))}
          </div>
          {/* Col 4 newsletter */}
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Stay Indulged</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "16px", lineHeight: 1.5, fontFamily: "'Nunito Sans', sans-serif" }}>Be the first to hear about new cakes, seasonal drops, and exclusive offers.</p>
            {!subscribed ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={{ height: "48px", padding: "0 16px", borderRadius: "8px", border: "1px solid rgba(245,237,224,0.15)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px", outline: "none", width: "100%" }} />
                <button onClick={() => { if (email.includes("@")) setSubscribed(true) }} style={{ height: "48px", borderRadius: "8px", border: "none", cursor: "pointer", background: "var(--primary)", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "15px", transition: "transform 150ms ease, box-shadow 150ms ease", boxShadow: "0 8px 24px -8px #8C1C1E50" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                  Subscribe
                </button>
              </div>
            ) : (
              <p style={{ fontSize: "14px", color: "var(--surface)", fontFamily: "'Nunito Sans', sans-serif", lineHeight: 1.5, padding: "12px 16px", background: "rgba(168,90,95,0.12)", borderRadius: "8px", border: "1px solid rgba(168,90,95,0.2)" }}>
                ✓ You're on the list! Sweet things ahead.
              </p>
            )}
          </div>
        </div>
        {/* Bottom strip */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", borderTop: "1px solid rgba(245,237,224,0.06)", marginTop: "64px", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>© 2026 Zeppoli Bakers, All Rights Reserved.</span>
            {["Privacy Policy","Terms of Service"].map(l => (
              <button key={l} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", transition: "color 200ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Payment icons */}
            {["VISA","MC","AMEX","UPI"].map(pay => (
              <div key={pay} style={{ height: "24px", padding: "0 8px", borderRadius: "4px", background: "rgba(245,237,224,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}>{pay}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}