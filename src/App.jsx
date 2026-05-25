import { useState, useEffect, useRef } from "react"
import "./index.css"

/* ============================================================
   HOOKS
   ============================================================ */

function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible")
            io.unobserve(el)
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

function useParallax(speed = 0.05) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return
    let raf = 0
    let inView = false
    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting },
      { rootMargin: "200px 0px 200px 0px" }
    )
    io.observe(el)
    const update = () => {
      raf = 0
      if (!inView) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const elCenter = rect.top + rect.height / 2
      const progress = (elCenter - vh / 2) / vh
      const offset = -progress * vh * speed * 0.5
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
      if (el) el.style.transform = ""
    }
  }, [speed])
  return ref
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { rootMargin: "-30% 0px -60% 0px" }
      )
      io.observe(el)
      return io
    })
    return () => observers.forEach((io) => io?.disconnect())
  }, [])
  return active
}

/* ============================================================
   PRIMITIVES
   ============================================================ */

function Rev({ children, delay = 0, as: Tag = "div", className = "", style = {} }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay * 0.1}s`, ...style }}
    >
      {children}
    </Tag>
  )
}

function Label({ children, style = {} }) {
  return <span className="label" style={style}>{children}</span>
}

function Dash() {
  return <span className="dash" aria-hidden="true" />
}

function Pull({ text, cite }) {
  return (
    <blockquote className="pull">
      {text}
      {cite && <cite>{cite}</cite>}
    </blockquote>
  )
}

function SectionMargin({ num, vertical, note, noteCite }) {
  return (
    <aside className="section-margin" aria-hidden="true">
      <span className="margin-num">{num}</span>
      <span className="margin-vertical">{vertical}</span>
      {note && (
        <p className="margin-note">
          <i>{note}</i>
          {noteCite && <span className="margin-cite">{noteCite}</span>}
        </p>
      )}
    </aside>
  )
}

function CrossLink({ prompt, links }) {
  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  return (
    <div className="cross-link">
      <p className="cross-link-prompt">{prompt}</p>
      <div className="cross-link-actions">
        {links.map((link, i) => (
          <button
            key={i}
            className="cross-link-btn"
            onClick={() => go(link.target)}
          >
            <span>{link.label}</span>
            <span className="cross-link-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   LOADER
   ============================================================ */

function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`loader${hidden ? " hidden" : ""}`} aria-hidden="true">
      <svg className="loader-svg" viewBox="0 0 262 70"
           xmlns="http://www.w3.org/2000/svg">
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        >
          {/* M */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0s"}}
            d="M0,60 L0,10 L25,55 L50,10 L50,60" />
          {/* L */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.15s"}}
            d="M65,10 L65,60 L95,60" />
          {/* N */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.3s"}}
            d="M110,60 L110,10 L145,60 L145,10" />
          {/* separator */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.5s"}}
            d="M158,35 L176,35" />
          {/* 1 */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.6s"}}
            d="M188,18 L196,12 L196,60" />
          {/* 1 */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.72s"}}
            d="M214,18 L222,12 L222,60" />
          {/* 1 */}
          <path className="loader-path" pathLength="100"
            style={{"--delay":"0.84s"}}
            d="M240,18 L248,12 L248,60" />
        </g>
      </svg>
      <div className="loader-bar" />
      <span className="loader-label">
        Nhận thức · Thực tiễn · Group 7
      </span>
    </div>
  )
}

/* ============================================================
   NAV
   ============================================================ */

function Nav({ showPrep }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionIds = ["theory","stats","compare","quiz","rebuttal","glossary","ai","references"]
  const active = useActiveSection(sectionIds)

  const go = (id) => {
    setMenuOpen(false)
    document.body.style.overflow = ""
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const links = [
    ["theory","Lý thuyết"],
    ["stats","Thực tiễn"],
    ["compare","So sánh"],
    ["quiz","Ôn tập"],
    ...(showPrep ? [["rebuttal","Phản biện"]] : []),
    ["glossary","Thuật ngữ"],
    ["ai","Phụ lục AI"],
    ["references","Tài liệu"],
  ]

  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`}
               className={active === id ? "is-active" : ""}
               onClick={(e) => { e.preventDefault(); go(id) }}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-center">
          <span>20</span>
          <div className="nav-pill">MLN</div>
          <span>26</span>
        </div>
        <div className="nav-right">
          <button className="pill-btn">MLN111</button>
          <div className="arrow-btn">↘</div>
          <button
            className="nav-burger"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}
           onClick={() => setMenuOpen(false)}>
        <div className="nav-drawer-inner"
             onClick={(e) => e.stopPropagation()}>
          {links.map(([id, label], i) => (
            <a key={id} href={`#${id}`}
               style={{ transitionDelay: `${i * 60}ms` }}
               onClick={(e) => { e.preventDefault(); go(id) }}>
              <span className="drawer-num">
                {String(i+1).padStart(2,"0")}
              </span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const bookRef = useParallax(0.03)
  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  return (
    <header className="hero">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <img src="/img/manuscript-bg.jpg" alt="" aria-hidden="true" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, mixBlendMode: "screen", filter: "grayscale(1)" }} />
      </div>

      <div ref={bookRef} className="hero-book-bg" aria-hidden="true">
        <img src="/img/book-notes.jpg" alt="" loading="lazy" decoding="async" />
      </div>

      <span className="hero-watermark" aria-hidden="true">NHẬN THỨC</span>

      <div className="hero-portrait hero-portrait-cutout">
        <img src="/img/socrates.png" alt="" loading="eager" decoding="async" />
      </div>

      <div className="hero-content" style={{ position: "relative", zIndex: 2, paddingBottom: "4rem" }}>
        <Rev>
          <Label style={{ color: "var(--color-accent)", letterSpacing: "0.24em", fontWeight: 500 }}>
            (MLN111 · Chủ nghĩa Duy vật Biện chứng · 2026)
          </Label>
        </Rev>
        <Rev delay={1}>
          <h1 className="hero-h1" style={{ marginTop: "1rem" }}>
            Nhận thức
            <br />
            <i>và Thực tiễn</i>
          </h1>
        </Rev>
      </div>

      <Rev delay={2} style={{ position: "absolute", bottom: "3rem", left: "calc(var(--space-section-h) + 0.5rem)", zIndex: 2 }}>
        <button className="hero-scroll" onClick={() => go("theory")}>
          Scroll ↓
        </button>
      </Rev>
    </header>
  )
}

/* ============================================================
   CQ SECTION
   ============================================================ */

function CQSection() {
  return (
    <section className="section-border-b cq-section">
      <div className="cq-main">
        <Rev>
          <Label>(Câu hỏi chủ đề)</Label>
        </Rev>
        <Rev delay={1}>
          <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
            Cứ học giỏi<br />
            thì sẽ thành công<br />
            <i>trong sự nghiệp?</i>
          </h2>
        </Rev>
        <Rev delay={2}>
          <p className="cq-body">
            Nhận thức này đúng chưa đủ ở chỗ nào? Thực tiễn kiểm nghiệm điều
            gì mà học đường không thể dạy? Mối quan hệ biện chứng được Triết
            học Mác–Lênin lý giải ra sao?
          </p>
        </Rev>
      </div>
      <Rev delay={1} className="cq-image">
        <img
          src="/img/student-library.jpg"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </Rev>
    </section>
  )
}

/* ============================================================
   THEORY SECTION
   ============================================================ */

function TheorySection() {
  const floatRef = useParallax(0.05)
  return (
    <section id="theory" className="section-narrow">
      <Rev>
        <Label>(Phần 01 · Lý thuyết)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)", marginBottom: "var(--space-stack-lg)" }}>
          Thực tiễn <Dash /> <i>ba vai trò cốt lõi</i>
        </h2>
      </Rev>

      <div className="theory-float" ref={floatRef}>
        <img src="/img/bookshelf.jpg" alt="" loading="lazy" decoding="async" />
      </div>

      <Rev delay={2}>
        <div className="point">
          <span className="point-num">01 ──────</span>
          <h3 className="point-h">
            Cơ sở <i>hình thành</i>
          </h3>
          <p className="point-body">
            Con người không thể nhận thức thế giới bằng suy nghĩ thuần túy
            mà phải qua lao động, trải nghiệm và hoạt động cải biến hiện
            thực.
          </p>
        </div>
      </Rev>

      <Rev delay={3}>
        <div className="point">
          <span className="point-num">02 ──────</span>
          <h3 className="point-h">
            Tiêu chuẩn <i>của chân lý</i>
          </h3>
          <p className="point-body">
            Nhận thức dù logic đến đâu vẫn cần kiểm nghiệm qua thực tế.
            Chỉ khi mang lại kết quả phù hợp hiện thực khách quan thì mới
            được xem là đúng.
          </p>
        </div>
      </Rev>

      <Rev delay={4}>
        <div className="point">
          <span className="point-num">03 ──────</span>
          <h3 className="point-h">
            Mục đích <i>cuối cùng</i>
          </h3>
          <p className="point-body">
            Con người nhận thức không chỉ để "biết" mà để cải tạo hiện
            thực. Tri thức chỉ có ý nghĩa khi được vận dụng vào đời sống
            thực tế.
          </p>
        </div>
      </Rev>

      <Rev delay={2}>
        <div className="theory-quote-grid">
          <Pull
            text='"Tri thức là cơ sở trực tiếp hình thành thế giới quan, nhưng tri thức chỉ gia nhập thế giới quan khi đã được kiểm nghiệm ít nhiều trong thực tiễn và trở thành niềm tin."'
            cite="Giáo trình Triết học Mác-Lênin · NXB Chính trị Quốc gia"
          />
          <div className="theory-quote-image">
            <img src="/img/hands-book.jpg" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </Rev>

      <Rev delay={2}>
        <CrossLink
          prompt="Lý thuyết đã rõ. Tiếp theo —"
          links={[
            { label: "Xem dẫn chứng thực tế", target: "stats" },
            { label: "Làm quiz kiểm tra", target: "quiz" },
          ]}
        />
      </Rev>
    </section>
  )
}

/* ============================================================
   STATS SECTION
   ============================================================ */

function StatsSection() {
  const bgRef = useParallax(0.04)
  return (
    <section
      id="stats"
      className="section-border-t section-border-b"
      style={{ overflow: "hidden" }}
    >
      <div className="stats-bg" ref={bgRef}>
        <img src="/img/gears.jpg" alt="" loading="lazy" decoding="async" />
      </div>

      <div className="stats-inner">
        <Rev>
          <Label>(Phần 02 · Gắn kết thực tiễn · Tiêu chí 5)</Label>
        </Rev>

        <hr className="hr-line" />

        <Rev delay={1}>
          <div className="stat-row">
            <span className="stat-num">70-80%</span>
            <div className="stat-meta">
              <span className="label-small">Doanh nghiệp</span>
              <p className="stat-body">
                đánh giá cao kỹ năng mềm vào tiêu chí quyết định tuyển
                dụng — bao gồm: thích ứng linh hoạt, làm việc nhóm,
                giao tiếp và kỷ luật lao động
              </p>
              <a
                href="https://nhandan.vn/tao-nguon-nhan-luc-phuc-vu-chuyen-doi-so-post800037.html"
                target="_blank"
                rel="noopener noreferrer"
                className="stat-source stat-source-link"
              >
                Báo Nhân Dân · Chuyên đề Nguồn nhân lực 2024 · nhandan.vn ↗
              </a>
            </div>
          </div>
        </Rev>

        <hr className="hr-line" />

        <Rev delay={1}>
          <div className="stat-row">
            <span className="stat-num">&gt;80%</span>
            <div className="stat-meta">
              <span className="label-small">Sinh viên tốt nghiệp</span>
              <p className="stat-body">
                có việc làm sau 12 tháng (toàn quốc). Các ngành Kỹ thuật,
                Công nghệ đạt 85–95%
              </p>
              <a
                href="https://moet.gov.vn/giaoducquocdan/giao-duc-dai-hoc/Pages/Default.aspx?ItemID=9705"
                target="_blank"
                rel="noopener noreferrer"
                className="stat-source stat-source-link"
              >
                Bộ Giáo dục và Đào tạo · Hội nghị GD Đại học tháng
                8-9/2024 · moet.gov.vn ↗
              </a>
            </div>
          </div>
        </Rev>

        <hr className="hr-line" />

        <div style={{ width: "100%", height: "clamp(200px, 25vw, 320px)", overflow: "hidden", margin: "2rem 0", position: "relative" }}>
          <img src="/img/student-work.jpg" alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(0.7) contrast(1.1) brightness(0.8)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(11,10,8,0.3) 0%, rgba(11,10,8,0.7) 100%)" }} />
        </div>

        <Rev delay={1}>
          <div className="stat-row">
            <span className="stat-num-quote">
              "Học đi đôi với hành,<br />
              lý luận gắn liền với thực tiễn."
            </span>
            <div className="stat-meta">
              <a
                href="https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/sach-chinh-tri/van-kien-dai-hoi-dai-bieu-toan-quoc-lan-thu-xiii-tap-1-403"
                target="_blank"
                rel="noopener noreferrer"
                className="stat-source stat-source-link"
              >
                Văn kiện Đại hội XIII · Đảng Cộng sản Việt Nam · 2021 ·
                tulieuvankien.dangcongsan.vn ↗
              </a>
            </div>
          </div>
        </Rev>

        <Rev delay={2}>
          <Pull
            text='"Nếu chúng ta có thể chứng minh được tính chính xác... bằng cách tự làm ra hiện tượng ấy... thì sẽ không còn có cái vật tự nó không thể nắm được của Cantơ nữa."'
            cite="Ph. Ăngghen · Biện chứng của tự nhiên"
          />
        </Rev>
      </div>
    </section>
  )
}

/* ============================================================
   TRIPTYCH
   ============================================================ */

function TriptychDivider() {
  return (
    <section className="triptych">
      <img src="/img/triptych.jpg" alt="" loading="lazy" decoding="async" />
      <div className="triptych-overlay" />
    </section>
  )
}

/* ============================================================
   COMPARE
   ============================================================ */

function CompareSection() {
  const rows = [
    {
      tag: "Nhận thức Đúng",
      school: "Hiểu đúng giáo trình, trả lời chính xác theo yêu cầu học thuật.",
      work: "Hiểu đúng con người, đúng bối cảnh, đúng nhu cầu thực tế. Thuộc mô hình quản trị nhưng đọc sai tâm lý khách hàng → vẫn thất bại.",
    },
    {
      tag: "Nhận thức Đủ",
      school: "Kiến thức toàn diện để hoàn thành môn học và vượt qua kỳ thi.",
      work: "Chuyên ngành + kỹ năng mềm + kinh nghiệm thực tế + hợp tác + quản lý cảm xúc.",
    },
    {
      tag: "Nhận thức Hiệu quả",
      school: "Điểm số, học bổng, thành tích — đo bằng thang đánh giá chuẩn hóa.",
      work: "Năng suất lao động, giải quyết vấn đề, giá trị thực tiễn tạo ra cho tổ chức và xã hội.",
    },
  ]
  return (
    <section id="compare" className="section-narrow">
      <Rev>
        <Label>(Phần 03 · Phân tích so sánh)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          Nhận thức <Dash /> <i>Đúng · Đủ · Hiệu quả</i>
        </h2>
      </Rev>

      <Rev delay={2}>
        <div className="compare-intro-image" style={{ width: "100%", height: "clamp(180px, 20vw, 280px)", overflow: "hidden", marginTop: "var(--space-stack-lg)", marginBottom: "var(--space-stack-md)", position: "relative" }}>
          <img src="/img/theory-practice.jpg" alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "grayscale(0.4) contrast(1.1) brightness(0.75)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,10,8,0.85) 0%, rgba(11,10,8,0.2) 60%, rgba(11,10,8,0.85) 100%)" }} />
        </div>
      </Rev>

      <Rev delay={3}>
        <div className="compare-headers">
          <span className="compare-h-left">Môi trường học đường</span>
          <span className="compare-h-right">Môi trường nghề nghiệp</span>
        </div>
      </Rev>

      {rows.map((r, i) => (
        <Rev delay={i + 1} key={r.tag}>
          <div className="compare-row">
            <div className="compare-cell compare-cell-left">
              <span className="compare-tag">{r.tag}</span>
              {r.school}
            </div>
            <div className="compare-cell compare-cell-right">
              <span className="compare-tag">{r.tag}</span>
              {r.work}
            </div>
          </div>
        </Rev>
      ))}

      <Rev delay={1}>
        <Pull text="Giá trị của nhận thức không nằm ở lượng tri thức sở hữu mà nằm ở khả năng biến tri thức thành hành động và kết quả cụ thể." />
      </Rev>
    </section>
  )
}

/* ============================================================
   QUIZ
   ============================================================ */

const QUIZ = [
  {
    q: "Theo triết học Mác-Lênin, thực tiễn giữ vai trò gì đối với nhận thức?",
    opts: [
      "Thực tiễn chỉ là kết quả của nhận thức",
      "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của chân lý",
      "Nhận thức quyết định và chi phối thực tiễn hoàn toàn",
      "Thực tiễn và nhận thức hoàn toàn độc lập nhau",
    ],
    ans: 1,
    ex:
      "Triết học Mác-Lênin: thực tiễn vừa là cơ sở hình thành nhận thức, vừa là động lực thúc đẩy, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
  {
    q: "Điều gì chủ yếu khiến người 'học xuất sắc' vẫn gặp khó khăn trong doanh nghiệp?",
    opts: [
      "Thiếu bằng cấp phù hợp",
      "Thiếu kỹ năng thực hành, kỹ năng mềm và khả năng ứng biến",
      "Kiến thức chuyên môn chưa đủ sâu",
      "Chưa có đủ kinh nghiệm quản lý",
    ],
    ans: 1,
    ex:
      "Doanh nghiệp đòi hỏi không chỉ lý thuyết mà còn khả năng hành động, giao tiếp, hợp tác — không đo được bằng điểm số.",
  },
  {
    q: "Ph. Ăngghen khẳng định chân lý được xác định bằng cách nào?",
    opts: [
      "Bằng suy luận logic thuần túy",
      "Bằng đồng thuận của đa số nhà khoa học",
      "Bằng kết quả hoạt động thực tiễn — tự làm ra hiện tượng đó",
      "Bằng quyền uy của các triết gia kinh điển",
    ],
    ans: 2,
    ex:
      "Ăngghen: nếu tự làm ra hiện tượng thì không còn 'vật tự nó không thể nắm được' của Cantơ nữa.",
  },
  {
    q: "Trong môi trường nghề nghiệp, 'nhận thức đủ' bao gồm gì?",
    opts: [
      "Chỉ cần kiến thức chuyên ngành sâu",
      "Chỉ cần GPA cao và bằng cấp trường top",
      "Chuyên ngành + kỹ năng mềm + kinh nghiệm + thích nghi",
      "Chỉ cần kỹ năng giao tiếp và networking",
    ],
    ans: 2,
    ex:
      "Nhận thức đủ trong nghề nghiệp còn gồm kỹ năng mềm, kinh nghiệm, hợp tác và quản lý cảm xúc.",
  },
  {
    q: "Mối quan hệ giữa kiến thức học thuật và khả năng hành động là gì?",
    opts: [
      "Kiến thức học thuật là yếu tố quyết định",
      "Khả năng hành động quan trọng hơn, kiến thức không cần",
      "Hai yếu tố bổ sung — kiến thức nền tảng, hành động tạo giá trị",
      "Hai yếu tố hoàn toàn độc lập",
    ],
    ans: 2,
    ex:
      "Kiến thức cung cấp nền tảng tư duy. Hành động biến tri thức thành giá trị thực tiễn. Tách rời cả hai đều thất bại.",
  },
  {
    q: "Trong ba hình thức cơ bản của thực tiễn, hình thức nào đóng vai trò quyết định?",
    opts: [
      "Hoạt động chính trị - xã hội",
      "Hoạt động sản xuất vật chất",
      "Thực nghiệm khoa học",
      "Cả ba có vai trò ngang nhau",
    ],
    ans: 1,
    ex:
      "Giáo trình Mác-Lênin: sản xuất vật chất có sớm nhất, cơ bản nhất, là cơ sở vật chất cho hai hình thức còn lại tồn tại và phát triển.",
  },
  {
    q: "V.I. Lê-nin tổng kết con đường biện chứng của nhận thức chân lý như thế nào?",
    opts: [
      "Từ lý luận đến thực tiễn rồi quay lại lý luận",
      "Từ trực quan sinh động đến tư duy trừu tượng, từ tư duy trừu tượng đến thực tiễn",
      "Từ thực tiễn cá nhân đến chân lý phổ biến",
      "Từ kinh nghiệm đến triết học, từ triết học đến khoa học",
    ],
    ans: 1,
    ex:
      "Câu nói nổi tiếng của Lê-nin trong 'Bút ký triết học' — vạch ra ba giai đoạn: cảm tính (trực quan sinh động) → lý tính (tư duy trừu tượng) → thực tiễn để kiểm nghiệm.",
  },
  {
    q: "Sinh viên thuộc lòng định nghĩa nhưng không biết áp dụng vào thực tế là biểu hiện của lỗi nhận thức nào?",
    opts: [
      "Chủ nghĩa kinh nghiệm",
      "Chủ nghĩa duy tâm",
      "Bệnh giáo điều — tuyệt đối hóa lý luận, tách rời thực tiễn",
      "Chủ nghĩa thực dụng",
    ],
    ans: 2,
    ex:
      "Bệnh giáo điều biến lý thuyết thành công thức cứng nhắc, mất khả năng vận dụng. Ngược lại bệnh kinh nghiệm chủ nghĩa lại tuyệt đối hóa kinh nghiệm, coi thường lý luận. Cả hai đều vi phạm nguyên tắc 'lý luận gắn liền với thực tiễn'.",
  },
  {
    q: "C. Mác viết: 'Vấn đề tìm hiểu xem tư duy của con người có thể đạt tới chân lý khách quan hay không, hoàn toàn không phải là vấn đề lý luận mà là một vấn đề ___'. Điền từ còn thiếu?",
    opts: [
      "khoa học",
      "thực tiễn",
      "triết học",
      "logic",
    ],
    ans: 1,
    ex:
      "C. Mác trong 'Luận cương về Phơ-bách' — luận cương số 2: chỉ thực tiễn mới chứng minh được tư duy có đạt chân lý hay không. Đây là một trong những luận điểm nền tảng của triết học Mác về vai trò thực tiễn.",
  },
  {
    q: "Đặc điểm nào KHÔNG thuộc về giai đoạn nhận thức cảm tính?",
    opts: [
      "Phản ánh trực tiếp qua cảm giác, tri giác, biểu tượng",
      "Đem lại hình ảnh sinh động về sự vật",
      "Phân biệt được bản chất và hiện tượng, nguyên nhân và kết quả",
      "Gắn liền trực tiếp với hoạt động thực tiễn",
    ],
    ans: 2,
    ex:
      "Nhận thức cảm tính chưa phân biệt được bản chất / hiện tượng, nguyên nhân / kết quả — đó là việc của nhận thức lý tính (tư duy trừu tượng). Cảm tính chỉ phản ánh BỀ NGOÀI của sự vật, lý tính mới đi sâu vào BẢN CHẤT.",
  },
  {
    q: "Trong thời đại AI và mạng xã hội, vì sao tính KHÁCH QUAN của chân lý vẫn được khẳng định?",
    opts: [
      "Vì AI luôn cung cấp thông tin đúng",
      "Vì nội dung chân lý phản ánh hiện thực khách quan, không phụ thuộc ý chí con người",
      "Vì đa số người dùng mạng đồng thuận về chân lý",
      "Vì chân lý do các chuyên gia uy tín xác định",
    ],
    ans: 1,
    ex:
      "Chân lý có tính khách quan vì NỘI DUNG phản ánh là hiện thực khách quan — không phụ thuộc số đông, không phụ thuộc uy tín. Đây là cơ sở triết học để phản bác fake news, deepfake, và 'chân lý đa số' trong thời AI.",
  },
  {
    q: "Câu nói nào KHÔNG phù hợp với quan điểm của triết học Mác-Lênin về mối quan hệ giữa nhận thức và thực tiễn?",
    opts: [
      "Học đi đôi với hành, lý luận gắn liền với thực tiễn",
      "Tri thức chỉ có giá trị khi được kiểm nghiệm qua thực tiễn",
      "Chỉ cần đọc nhiều sách là sẽ thành công trong cuộc sống",
      "Thực tiễn là tiêu chuẩn của chân lý",
    ],
    ans: 2,
    ex:
      "Câu C tách rời tri thức khỏi thực tiễn — vi phạm nguyên tắc cơ bản của nhận thức luận Mác-Lênin. Đây cũng chính là câu hỏi đặt vấn đề mở đầu của bài: 'Cứ học giỏi thì sẽ thành công?' — đáp án là KHÔNG nếu thiếu thực tiễn.",
  },
]

function Quiz() {
  const [q, setQ] = useState(0)
  const [sel, setSel] = useState(null)
  const [ans, setAns] = useState([])
  const [done, setDone] = useState(false)
  const cur = QUIZ[q]
  const score = ans.filter((a,i) => a === QUIZ[i].ans).length

  const pick = (i) => { if (sel !== null) return; setSel(i) }

  const next = () => {
    const newAns = [...ans, sel]
    if (q + 1 >= QUIZ.length) {
      setAns(newAns); setDone(true)
    } else {
      setAns(newAns); setSel(null); setQ(q + 1)
    }
  }

  const back = () => {
    if (q === 0) return
    const newAns = ans.slice(0, -1)
    setAns(newAns); setSel(null); setQ(q - 1)
  }

  const restart = () => {
    setQ(0); setSel(null); setAns([]); setDone(false)
  }

  useEffect(() => {
    if (done) return
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return
      const k = e.key.toLowerCase()
      if (["a","b","c","d"].includes(k) && sel === null) {
        const idx = k.charCodeAt(0) - 97
        if (idx < cur.opts.length) pick(idx)
      } else if (e.key === "Enter" && sel !== null) {
        next()
      } else if (e.key === "ArrowLeft" && q > 0 && sel !== null) {
        back()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [q, sel, done])

  const pct = done ? 100 : (q / QUIZ.length) * 100

  const optColor = (i) => {
    if (sel === null) return "var(--color-text-muted)"
    if (i === QUIZ[q].ans) return "#90B880"
    if (i === sel) return "#B88080"
    return "var(--color-text-label)"
  }
  const optBorder = (i) => {
    if (sel === null) return "var(--color-line)"
    if (i === QUIZ[q].ans) return "#90B880"
    if (i === sel) return "#B88080"
    return "var(--color-line)"
  }

  return (
    <section id="quiz" className="section-border-t section-with-margin">
      <div className="section-main">
      <div style={{ maxWidth: 640 }}>
        <Rev><Label>(Phần 04 · Ôn tập tương tác · Tiêu chí 3)</Label></Rev>
        <Rev delay={0.1}>
          <h2 style={{
            fontFamily:"var(--font-display)",
            fontSize:"var(--type-h2)",
            fontWeight:"var(--weight-display)",
            lineHeight:"var(--leading-display)",
            letterSpacing:"var(--tracking-h2)",
            marginBottom:"var(--space-stack-lg)",
          }}>
            Kiểm tra <Dash /> <i style={{fontStyle:"italic"}}>hiểu bài</i>
          </h2>
        </Rev>

        <div role="progressbar" aria-valuenow={Math.round(pct)}
             aria-valuemin={0} aria-valuemax={100}
             aria-label={`Tiến trình: câu ${q+1} trên ${QUIZ.length}`}
             style={{ height:1, background:"var(--color-line)",
                      marginBottom:"2rem", position:"relative" }}>
          <div className="progress-fill" style={{
            position:"absolute", top:0, left:0, height:1,
            background:"var(--color-accent)",
            width:`${pct}%`,
            transition:"width 0.5s var(--ease-out)",
          }} />
        </div>

        {done ? (
          <Rev>
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <Label>(Kết quả)</Label>
              <div style={{
                fontFamily:"var(--font-display)",
                fontSize:"clamp(4rem,10vw,8rem)",
                fontWeight:"var(--weight-display)",
                lineHeight:0.88, letterSpacing:"var(--tracking-display)",
                marginBottom:"1rem",
              }}>
                {score}
                <span style={{ fontSize:"40%",
                               color:"var(--color-text-muted)" }}>
                  /{QUIZ.length}
                </span>
              </div>
              <p style={{
                fontFamily:"var(--font-ui)",
                color:"var(--color-text-muted)",
                fontSize:"var(--type-body)",
                marginBottom:"2rem",
              }}>
                {score === QUIZ.length
                  ? "Xuất sắc — nắm vững toàn bộ nhận thức luận Mác-Lênin về mối quan hệ nhận thức ↔ thực tiễn."
                  : score >= 10
                  ? "Rất tốt — chỉ thiếu vài chi tiết. Sẵn sàng cho phản biện."
                  : score >= 7
                  ? "Khá — nắm được các luận điểm chính. Ôn lại 2-3 phần chưa chắc, đặc biệt phần Thuật ngữ."
                  : score >= 4
                  ? "Trung bình — quay lại phần Lý thuyết và Thuật ngữ để củng cố nền tảng."
                  : "Cần ôn lại nghiêm túc — đọc kỹ giáo trình từ phần Lý thuyết trước khi thuyết trình."}
              </p>
              <button onClick={restart} style={{
                fontFamily:"var(--font-ui)",
                fontSize:"var(--type-label)",
                letterSpacing:"var(--tracking-label)",
                textTransform:"uppercase",
                background:"none",
                border:"1px solid var(--color-line-strong)",
                color:"var(--color-text)",
                padding:"var(--pill-padding)",
                cursor:"pointer",
              }}>Làm lại ↻</button>
            </div>
          </Rev>
        ) : (
          <div key={q} className="quiz-fade">
            <div style={{
              display:"flex", justifyContent:"space-between",
              fontFamily:"var(--font-ui)",
              fontSize:"var(--type-label)",
              letterSpacing:"var(--tracking-label)",
              textTransform:"uppercase",
              color:"var(--color-text-label)",
              marginBottom:"1.5rem",
            }}>
              <span>Câu {q+1} / {QUIZ.length}</span>
              <span style={{ color:"var(--color-accent)" }}>
                {score} đúng
              </span>
            </div>

            <p style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(1.1rem,2.2vw,1.5rem)",
              fontWeight:"var(--weight-display)",
              lineHeight:"var(--leading-tight)",
              letterSpacing:"-0.01em",
              marginBottom:"1.75rem",
            }}>{cur.q}</p>

            <div>
              {cur.opts.map((opt,i) => (
                <button key={i} onClick={() => pick(i)}
                  aria-pressed={sel === i}
                  disabled={sel !== null}
                  style={{
                    padding:"0.875rem 0", width:"100%",
                    border:"none",
                    borderBottom:`1px solid ${optBorder(i)}`,
                    background:"none", color:optColor(i),
                    cursor:sel !== null ? "default" : "pointer",
                    fontFamily:"var(--font-ui)",
                    fontSize:"var(--type-body)",
                    lineHeight:"var(--leading-body)",
                    textAlign:"left",
                    display:"flex", gap:"1rem",
                    opacity: sel !== null
                      && i !== QUIZ[q].ans
                      && i !== sel ? 0.35 : 1,
                    transition:"color 200ms, border-color 200ms",
                  }}>
                  <kbd className="quiz-kbd">
                    {String.fromCharCode(65+i)}
                  </kbd>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {sel !== null && (
              <>
                <p style={{
                  fontFamily:"var(--font-ui)",
                  fontSize:"var(--type-body)",
                  color:"var(--color-text-muted)",
                  fontStyle:"italic",
                  lineHeight:"var(--leading-body)",
                  padding:"1.25rem 0",
                  borderTop:"1px solid var(--color-line)",
                  marginBottom:"1.5rem",
                }}>{cur.ex}</p>
                <div style={{ display:"flex", gap:"1rem" }}>
                  {q > 0 && (
                    <button onClick={back} style={{
                      fontFamily:"var(--font-ui)",
                      fontSize:"var(--type-label)",
                      letterSpacing:"var(--tracking-label)",
                      textTransform:"uppercase",
                      background:"none", border:"none",
                      color:"var(--color-text-label)",
                      cursor:"pointer", opacity:0.6,
                    }}>← Câu trước</button>
                  )}
                  <button onClick={next} autoFocus style={{
                    fontFamily:"var(--font-ui)",
                    fontSize:"var(--type-label)",
                    letterSpacing:"var(--tracking-label)",
                    textTransform:"uppercase",
                    background:"none",
                    border:"1px solid var(--color-line-strong)",
                    color:"var(--color-text)",
                    padding:"var(--pill-padding)",
                    cursor:"pointer",
                  }}>
                    {q+1 >= QUIZ.length
                      ? "Xem kết quả →"
                      : "Tiếp theo → (Enter)"}
                  </button>
                </div>
              </>
            )}
            <p className="quiz-hint">
              Mẹo: bấm A · B · C · D để chọn
            </p>
          </div>
        )}
      </div>
      </div>
      <SectionMargin
        num="04 / 06"
        vertical="Ôn tập tương tác"
        note="De omnibus dubitandum est. — Hoài nghi mọi điều."
        noteCite="Motto của K. Marx"
      />
    </section>
  )
}

/* ============================================================
   AI USAGE
   ============================================================ */

function AISection() {
  const rows = [
    {
      tool: "Claude",
      purpose: "Phân tích lý thuyết",
      prompt:
        "Phân tích mối quan hệ giữa nhận thức và thực tiễn theo triết học Mác-Lênin. Trình bày 3 vai trò của thực tiễn đối với nhận thức, có trích dẫn từ giáo trình LLCT chính thống.",
      edit:
        "Đối chiếu LLCT, chỉnh ngữ cảnh VN, bổ sung ví dụ sinh viên",
      link: 
        "https://claude.ai/share/a0eb4028-448a-4447-bc3f-8fe8780ed65c",
    },
    {
      tool: "Claude",
      purpose: "Tạo quiz ôn tập",
      prompt:
        "Tạo 5 câu trắc nghiệm về mối quan hệ nhận thức và thực tiễn theo Mác-Lênin. Độ khó tăng dần, mỗi câu có 1 đáp án đúng và 3 đáp án nhiễu hợp lý. Có giải thích ngắn cho đáp án đúng.",
      edit: "Kiểm tra độ chính xác, điều chỉnh đáp án, thêm giải thích",
      link: 
        "https://claude.ai/share/37628787-24d0-41c7-b76f-2fad9564af43",
    },
    {
      tool: "Gemini",
      purpose: "Số liệu thực tiễn",
      prompt:
        "Số liệu 2024-2025 về việc làm và kỹ năng sinh viên VN",
      edit: "Kiểm chứng nguồn molisa/moet/nhandan, ghi rõ trích dẫn",
      link: 
        "https://gemini.google.com/share/bfe37c3007e4",
    },
  ]

  const checks = [
    {
      n: "4.1 Minh bạch",
      score: "✓",
      body: "Liệt kê đủ công cụ, mục đích, prompt và link chat.",
    },
    {
      n: "4.2 Trách nhiệm",
      score: "✓",
      body:
        "Mọi luận điểm AI đối chiếu giáo trình LLCT và nguồn chính thống.",
    },
    {
      n: "4.3 Liêm chính",
      score: "✓",
      body:
        "Cam kết văn bản. Phân định rõ AI output và phần nhóm chỉnh sửa.",
    },
    {
      n: "4.4 Sáng tạo",
      score: "✓",
      body:
        "AI hỗ trợ quiz và website — không thay tư duy phân tích của nhóm.",
    },
  ]

  return (
    <section id="ai" className="section-border-t section-with-margin">
      <div className="section-main ai-main">
      <Rev>
        <Label>(Phụ lục · Minh bạch AI · Tiêu chí 4)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          AI Usage <Dash /> <i>có trách nhiệm</i>
        </h2>
      </Rev>

      <Rev delay={2}>
        <div style={{ overflowX: "auto" }}>
          <table className="ai-table">
            <thead>
              <tr>
                <th>Công cụ</th>
                <th>Mục đích</th>
                <th>Prompt chính</th>
                <th>Phần nhóm chỉnh</th>
                <th>Link chat</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.tool}</td>
                  <td>{r.purpose}</td>
                  <td>{r.prompt}</td>
                  <td>{r.edit}</td>
                  <td><a href={r.link} target="_blank" rel="noopener noreferrer" className="ai-link">Xem chat ↗</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Rev>

      <Rev delay={2}>
        <div className="checklist">
          {checks.map((c, i) => (
            <div className="check-item" key={i}>
              <div className="check-row">
                <span className="check-label">{c.n}</span>
                <span className="check-score">{c.score}</span>
              </div>
              <p className="check-body">{c.body}</p>
            </div>
          ))}
        </div>
      </Rev>
      </div>
      <SectionMargin
        num="06 / 06"
        vertical="Minh bạch AI · Tiêu chí 4"
        note="Công cụ giải phóng đôi tay, không giải phóng trách nhiệm."
        noteCite="Nguyên tắc liêm chính học thuật"
      />
    </section>
  )
}

/* ============================================================
   REBUTTAL (chỉ hiện khi ?prep=true)
   ============================================================ */

const REBUTTAL = [
  {
    warn: true,
    q: "Theo Mác-Lênin, 'trải nghiệm cá nhân' có đồng nhất với phạm trù 'thực tiễn' không?",
    a: "Không. Thực tiễn là hoạt động vật chất có mục đích, mang tính lịch sử-xã hội nhằm cải tạo hiện thực — khách quan, mang tính cộng đồng. Trải nghiệm cá nhân là kết quả phản ánh chủ quan, có thể đúng hoặc sai. Tuyệt đối hóa kinh nghiệm cảm tính chính là chủ nghĩa duy nghiệm mà Mác-Lênin phê phán.",
  },
  {
    q: "Câu trích dẫn của Ăngghen về 'vật tự nó của Cantơ' lấy từ tác phẩm nào?",
    a: "'Biện chứng của tự nhiên' (1873-1883) và 'Lút-vích Phơ-bách và sự cáo chung của triết học cổ điển Đức' (1886).",
  },
  {
    warn: true,
    q: "Luận điểm 'thực tiễn là tiêu chuẩn chân lý' khác chủ nghĩa thực dụng W. James thế nào?",
    a: "Thực dụng: chân lý = lợi ích chủ quan cá nhân. Mác-Lênin: thực tiễn là hoạt động vật chất khách quan, mang tính lịch sử-xã hội — đo sự phù hợp giữa tư duy và hiện thực khách quan, không phải lợi ích cá nhân.",
  },
  {
    warn: true,
    q: "Tiêu chuẩn thực tiễn vừa tuyệt đối vừa tương đối — giải thích?",
    a: "Tuyệt đối: ngoài thực tiễn không còn tiêu chuẩn nào khác. Tương đối: thực tiễn luôn vận động, mỗi giai đoạn lịch sử chỉ kiểm chứng được một phần chân lý. Tuyệt đối ngăn hoài nghi; tương đối ngăn giáo điều.",
  },
  {
    q: "Sinh viên đi thực tập marketing thuộc hình thức thực tiễn nào?",
    a: "Chủ yếu là lao động sản xuất — hình thức cơ bản nhất, quyết định. Có thể có yếu tố thực nghiệm khoa học nếu nghiên cứu thị trường. Lao động sản xuất tạo ra của cải vật chất, là cơ sở của hai hình thức còn lại.",
  },
  {
    warn: true,
    q: "Bài dùng Mác-Lênin để biện hộ 'thăng tiến cá nhân' trong môi trường tư bản — có mâu thuẫn không?",
    a: "Có giới hạn. Về nhận thức luận: tri thức có giá trị khi kiểm nghiệm qua cải tạo hiện thực — đúng bất kể chủ thể. Tinh thần Mác-xít đầy đủ: thành công bền vững phải gắn với đóng góp cho lao động xã hội và lợi ích cộng đồng — điểm bài chưa phát triển sâu, xin tiếp thu.",
  },
  {
    q: "Nhận thức có tác động trở lại thực tiễn không? Lê-nin nói gì?",
    a: "Có. Quan hệ biện chứng hai chiều: thực tiễn quyết định nhận thức, nhưng lý luận có tính độc lập tương đối và tác động định hướng thực tiễn. Lê-nin: 'Không có lý luận cách mạng thì cũng không có phong trào cách mạng.'",
  },
  {
    q: "Nhận thức diễn ra qua mấy giai đoạn?",
    a: "Ba khâu theo Lê-nin: từ trực quan sinh động → tư duy trừu tượng → trở lại thực tiễn để kiểm nghiệm. Tức: nhận thức cảm tính → nhận thức lý tính → thực tiễn.",
  },
  {
    q: "Tính cụ thể của chân lý là gì?",
    a: "Lê-nin: 'Không có chân lý trừu tượng, chân lý luôn luôn cụ thể.' Chân lý gắn với điều kiện không gian, thời gian, hoàn cảnh lịch sử cụ thể. Áp dụng máy móc cho mọi hoàn cảnh là vi phạm tính cụ thể — dẫn đến giáo điều.",
  },
  {
    q: "'Biết' và 'hiểu' có khác nhau theo Mác-Lênin không?",
    a: "'Biết' dừng ở nhận thức cảm tính, ghi nhớ hiện tượng. 'Hiểu' thuộc nhận thức lý tính — nắm bản chất, quy luật, mối liên hệ tất yếu. 'Vận dụng đúng' đòi hỏi đã 'hiểu' rồi mới quay về thực tiễn được.",
  },
]

function Rebuttal() {
  const [open, setOpen] = useState(REBUTTAL.map(() => false))

  const toggle = (i) => {
    setOpen(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  return (
    <section id="rebuttal" className="section-narrow section-border-t">
      <Rev>
        <Label>(Chuẩn bị phản biện · Nội bộ nhóm)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          10 câu hỏi <Dash /> <i>có thể bị hỏi</i>
        </h2>
      </Rev>

      <Rev delay={2}>
        <div className="note-box">
          Section này chỉ hiển thị khi URL có ?prep=true (dùng nội bộ
          nhóm, không chiếu cho lớp)
        </div>
      </Rev>

      <Rev delay={1}>
        <div>
          {REBUTTAL.map((item, i) => (
            <div
              key={i}
              className={`acc-item ${item.warn ? "acc-item-warn" : ""}`}
            >
              <button
                className="acc-head"
                onClick={() => toggle(i)}
                aria-expanded={open[i]}
                aria-controls={`acc-panel-${i}`}
              >
                <div style={{ flex: 1 }}>
                  <span className="acc-num">
                    Câu {String(i + 1).padStart(2, "0")} {item.warn ? "⚠" : ""}
                  </span>
                  <span className="acc-q">{item.q}</span>
                </div>
                <span className="acc-icon">{open[i] ? "−" : "+"}</span>
              </button>
              <div
                id={`acc-panel-${i}`}
                aria-hidden={!open[i]}
                className={`acc-body ${open[i] ? "open" : ""}`}
              >
                <div className="acc-body-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </Rev>
    </section>
  )
}

/* ============================================================
   GLOSSARY
   ============================================================ */

const GLOSSARY = [
  {
    term: "Nhận thức",
    def: "Là quá trình phản ánh hiện thực khách quan vào bộ óc người.",
    note: "Không phải phản ánh thụ động như cái gương, mà là quá trình phản ánh tích cực, chủ động, sáng tạo trên cơ sở thực tiễn mang tính lịch sử cụ thể.",
  },
  {
    term: "Thực tiễn",
    def: "Toàn bộ hoạt động vật chất - cảm tính có mục đích, mang tính lịch sử - xã hội, nhằm cải tạo tự nhiên và xã hội.",
    note: "Con người phải sử dụng lực lượng vật chất, công cụ vật chất tác động vào đối tượng. Mục đích cao nhất là phục vụ nhân loại tiến bộ.",
  },
  {
    term: "Nhận thức cảm tính",
    def: "Giai đoạn đầu — trực quan sinh động — phản ánh trực tiếp qua cảm giác, tri giác, biểu tượng.",
    note: "Gắn liền trực tiếp với thực tiễn. Đem lại hình ảnh trực tiếp về sự vật nhưng chưa phân biệt được cái riêng và cái chung, bản chất và hiện tượng, nguyên nhân và kết quả.",
  },
  {
    term: "Nhận thức lý tính",
    def: "Giai đoạn cao — tư duy trừu tượng — phản ánh gián tiếp, khái quát qua khái niệm, phán đoán, suy lý.",
    note: "Phản ánh sự vật trong tính tất yếu, chỉnh thể toàn diện, đi sâu vào bản chất. Suy lý giúp tư duy đi từ cái đã biết đến cái chưa biết. Luôn hàm chứa nguy cơ xa rời hiện thực nên phải được kiểm tra bởi thực tiễn.",
  },
  {
    term: "Chân lý",
    def: "Tri thức phù hợp với hiện thực khách quan và được thực tiễn kiểm nghiệm.",
    note: "Chân lý là tri thức, không phải bản thân hiện thực. Do nội dung phản ánh là khách quan nên chân lý bao giờ cũng có tính khách quan, không phụ thuộc vào con người hay loài người.",
  },
  {
    term: "Chân lý tuyệt đối / tương đối",
    def: "Tương đối: tri thức đúng nhưng chưa đầy đủ, mới phản ánh đúng một mặt, một bộ phận. Tuyệt đối: phản ánh đầy đủ, toàn diện hiện thực ở một giai đoạn lịch sử xác định.",
    note: "V.I. Lê-nin: tư duy con người có thể cung cấp chân lý tuyệt đối, nhưng chân lý tuyệt đối này chỉ là tổng số những chân lý tương đối.",
  },
  {
    term: "Chân lý cụ thể",
    def: "\"Không có chân lý trừu tượng, chung chung, chân lý luôn là cụ thể\" — V.I. Lê-nin.",
    note: "Chân lý gắn với điều kiện không gian, thời gian, hoàn cảnh lịch sử cụ thể. Đòi hỏi chủ thể phải có quan điểm lịch sử cụ thể, luôn sáng tạo trong hoạt động thực tiễn.",
  },
  {
    term: "Ba hình thức thực tiễn",
    def: "Hoạt động sản xuất vật chất · Hoạt động chính trị - xã hội · Thực nghiệm khoa học.",
    note: "Hoạt động sản xuất vật chất là hình thức có sớm nhất, cơ bản nhất và quan trọng nhất — đóng vai trò quyết định đối với hai hình thức còn lại.",
  },
  {
    term: "Biện chứng",
    def: "Phương pháp nhận thức đối tượng trong mối liên hệ phổ biến và trạng thái vận động, phát triển — đối lập với siêu hình.",
    note: "Chia thành biện chứng khách quan (của bản thân thế giới) và biện chứng chủ quan (phản ánh biện chứng khách quan vào tư duy con người). Phương pháp siêu hình nhận thức đối tượng ở trạng thái cô lập, tĩnh tại.",
  },
  {
    term: "Vật tự nó (Kant)",
    def: "Khái niệm của I. Kant về thực tại độc lập với nhận thức — cho rằng con người không thể có tri thức đúng đắn về thực tại nằm ngoài kinh nghiệm.",
    note: "Ph. Ăngghen phản bác: thông qua thực tiễn (\"tự chúng ta làm ra hiện tượng ấy\"), \"vật tự nó\" sẽ bị biến thành \"vật cho ta\" — khẳng định khả năng nhận thức vô tận của con người.",
  },
]

function Glossary() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => {
    setOpenIdx(prev => prev === i ? null : i)
  }

  return (
    <section id="glossary" className="section-narrow section-border-t">
      <Rev>
        <Label>(Phụ lục · Thuật ngữ triết học)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          Thuật ngữ <Dash /> <i>then chốt</i>
        </h2>
      </Rev>

      <Rev delay={2}>
        <p className="glossary-intro">
          10 khái niệm nền tảng của Triết học Mác-Lênin về nhận thức và thực tiễn.
          Click vào từng mục để xem định nghĩa và bổ sung.
        </p>
      </Rev>

      <Rev delay={1}>
        <div className="glossary-list">
          {GLOSSARY.map((g, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className={`glossary-item ${isOpen ? "open" : ""}`}>
                <button
                  className="glossary-head"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`glossary-body-${i}`}
                >
                  <span className="glossary-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="glossary-term">{g.term}</span>
                  <span className="glossary-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`glossary-body-${i}`}
                  className="glossary-body"
                  aria-hidden={!isOpen}
                >
                  <div className="glossary-body-inner">
                    <p className="glossary-def">{g.def}</p>
                    <p className="glossary-note">
                      <span className="glossary-note-label">Bổ sung —</span> {g.note}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Rev>
    </section>
  )
}

/* ============================================================
   REFERENCES
   ============================================================ */

const REFERENCES = [
  {
    category: "Giáo trình chính",
    items: [
      {
        author: "Bộ Giáo dục và Đào tạo",
        title: "Giáo trình Triết học Mác-Lênin (Dành cho bậc đại học hệ không chuyên lý luận chính trị)",
        publisher: "NXB Chính trị Quốc gia Sự thật",
        year: "2021",
      },
    ],
  },
  {
    category: "Tác phẩm kinh điển",
    items: [
      {
        author: "Ph. Ăngghen",
        title: "Biện chứng của tự nhiên",
        note: "1873-1883",
      },
      {
        author: "Ph. Ăngghen",
        title: "Lút-vích Phơ-bách và sự cáo chung của triết học cổ điển Đức",
        note: "1886",
      },
      {
        author: "V.I. Lê-nin",
        title: "Bút ký triết học",
        note: "Trích dẫn về chân lý cụ thể và quan hệ biện chứng giữa lý luận và thực tiễn",
      },
    ],
  },
  {
    category: "Văn kiện chính trị",
    items: [
      {
        author: "Đảng Cộng sản Việt Nam",
        title: "Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII, Tập 1",
        year: "2021",
        url: "https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/sach-chinh-tri/van-kien-dai-hoi-dai-bieu-toan-quoc-lan-thu-xiii-tap-1-403",
      },
    ],
  },
  {
    category: "Nguồn số liệu thực tiễn",
    items: [
      {
        author: "Báo Nhân Dân",
        title: "Tạo nguồn nhân lực phục vụ chuyển đổi số",
        note: "Chuyên đề Nguồn nhân lực 2024",
        url: "https://nhandan.vn/tao-nguon-nhan-luc-phuc-vu-chuyen-doi-so-post800037.html",
      },
      {
        author: "Bộ Giáo dục và Đào tạo",
        title: "Hội nghị Giáo dục Đại học — Số liệu việc làm sinh viên tốt nghiệp",
        note: "Tháng 8-9/2024",
        url: "https://moet.gov.vn/giaoducquocdan/giao-duc-dai-hoc/Pages/Default.aspx?ItemID=9705",
      },
    ],
  },
]

function References() {
  return (
    <section id="references" className="section-narrow section-border-t">
      <Rev>
        <Label>(Phụ lục · Tài liệu tham khảo)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          Tài liệu <Dash /> <i>tham khảo</i>
        </h2>
      </Rev>

      <div className="references-list">
        {REFERENCES.map((cat, i) => (
          <Rev delay={i + 1} key={cat.category}>
            <div className="references-group">
              <h3 className="references-category">{cat.category}</h3>
              <ol className="references-items">
                {cat.items.map((item, j) => (
                  <li key={j} className="references-item">
                    <span className="references-author">{item.author}.</span>
                    {' '}
                    <i className="references-title">{item.title}</i>
                    {item.publisher && <span>. {item.publisher}</span>}
                    {item.year && <span>, {item.year}</span>}
                    {item.note && <span className="references-note"> · {item.note}</span>}
                    {item.url && (
                      <>
                        {' '}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="references-link"
                        >
                          [Xem nguồn ↗]
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Rev>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="footer">
      <Label>(Cam kết liêm chính học thuật)</Label>
      <p className="footer-body">
        Nhóm cam kết AI chỉ đóng vai trò hỗ trợ. Toàn bộ luận điểm học
        thuật đã được kiểm chứng bằng Giáo trình Triết học Mác-Lênin
        (NXB Chính trị Quốc gia) và nguồn chính thống. Nhóm chịu trách
        nhiệm hoàn toàn về nội dung cuối cùng.
      </p>
      <div className="footer-cr">
        MLN111 · 2026 · Nhận thức &amp; Thực tiễn
      </div>
    </footer>
  )
}

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const showPrep = new URLSearchParams(
    window.location.search
  ).get("prep") === "true"

  return (
    <>
      <Loader />
      <div id="app-root">
        <Nav showPrep={showPrep} />
        <Hero />
        <CQSection />
        <TheorySection />
        <StatsSection />
        <TriptychDivider />
        <CompareSection />
        <Quiz />
        {showPrep && <Rebuttal />}
        <Glossary />
        <AISection />
        <References />
        <Footer />
      </div>
    </>
  )
}
