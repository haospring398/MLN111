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
    let raf = 0
    let latest = window.scrollY
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Only run while near viewport
      if (rect.bottom < -200 || rect.top > vh + 200) {
        raf = 0
        return
      }
      const offset = (latest - el.dataset.baseY) * speed
      el.style.transform = `translateY(${offset}px)`
      raf = 0
    }
    el.dataset.baseY = window.scrollY
    const onScroll = () => {
      latest = window.scrollY
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])
  return ref
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

/* ============================================================
   NAV
   ============================================================ */

function Nav({ showPrep }) {
  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  return (
    <nav className="nav">
      <div className="nav-left">
        <a onClick={() => go("theory")} href="#theory">Lý thuyết</a>
        <a onClick={() => go("stats")} href="#stats">Thực tiễn</a>
        <a onClick={() => go("compare")} href="#compare">So sánh</a>
        <a onClick={() => go("quiz")} href="#quiz">Ôn tập</a>
        <a onClick={() => go("ai")} href="#ai">Phụ lục AI</a>
        {showPrep && (
          <a onClick={() => go("rebuttal")} href="#rebuttal">Phản biện</a>
        )}
      </div>
      <div className="nav-center">
        <span>20</span>
        <span className="nav-pill">MLN</span>
        <span>26</span>
      </div>
      <div className="nav-right">
        <span className="pill-btn">MLN111</span>
        <span className="arrow-btn" aria-hidden="true">↘</span>
      </div>
    </nav>
  )
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const floatRef = useParallax(0.06)
  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  return (
    <header className="hero">
      <span className="hero-watermark" aria-hidden="true">NHẬN THỨC</span>

      <div className="hero-float" ref={floatRef}>
        <img src="/img/socrates.jpg" alt="" />
      </div>

      <div className="hero-content">
        <Rev>
          <Label style={{ color: "var(--color-accent)", opacity: 0.8 }}>
            (MLN111 · Chủ nghĩa Duy vật Biện chứng · 2026)
          </Label>
        </Rev>
        <Rev delay={1}>
          <h1 className="hero-h1">
            Nhận thức
            <br />
            <em>và Thực tiễn</em>
          </h1>
        </Rev>
        <Rev delay={2}>
          <button className="hero-scroll" onClick={() => go("theory")}>
            <span className="arrow-btn">↓</span>
            <Label>Cuộn để khám phá</Label>
          </button>
        </Rev>
      </div>
    </header>
  )
}

/* ============================================================
   CQ SECTION
   ============================================================ */

function CQ() {
  return (
    <section className="section-border-b">
      <Rev>
        <Label>(Câu hỏi chủ đề)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          Cứ học giỏi<br />
          thì sẽ thành công<br />
          <em>trong sự nghiệp?</em>
        </h2>
      </Rev>
      <Rev delay={2}>
        <p className="cq-body">
          Nhận thức này đúng chưa đủ ở chỗ nào? Thực tiễn kiểm nghiệm điều
          gì mà học đường không thể dạy? Mối quan hệ biện chứng được Triết
          học Mác–Lênin lý giải ra sao?
        </p>
      </Rev>
    </section>
  )
}

/* ============================================================
   THEORY SECTION
   ============================================================ */

function Theory() {
  const floatRef = useParallax(0.05)
  return (
    <section id="theory" className="section-narrow">
      <Rev>
        <Label>(Phần 01 · Lý thuyết)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)", marginBottom: "var(--space-stack-lg)" }}>
          Thực tiễn <Dash /> <em>ba vai trò cốt lõi</em>
        </h2>
      </Rev>

      <div className="theory-float" ref={floatRef}>
        <img src="/img/bookshelf.jpg" alt="" />
      </div>

      <Rev delay={2}>
        <div className="point">
          <span className="point-num">01 ──────</span>
          <h3 className="point-h">
            Cơ sở <em>hình thành</em>
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
            Tiêu chuẩn <em>của chân lý</em>
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
            Mục đích <em>cuối cùng</em>
          </h3>
          <p className="point-body">
            Con người nhận thức không chỉ để "biết" mà để cải tạo hiện
            thực. Tri thức chỉ có ý nghĩa khi được vận dụng vào đời sống
            thực tế.
          </p>
        </div>
      </Rev>

      <div className="clear" />

      <Rev delay={1}>
        <Pull
          text='"Tri thức là cơ sở trực tiếp hình thành thế giới quan, nhưng tri thức chỉ gia nhập thế giới quan khi đã được kiểm nghiệm ít nhiều trong thực tiễn và trở thành niềm tin."'
          cite="Giáo trình Triết học Mác-Lênin · NXB Chính trị Quốc gia"
        />
      </Rev>
    </section>
  )
}

/* ============================================================
   STATS SECTION
   ============================================================ */

function Stats() {
  const bgRef = useParallax(0.04)
  return (
    <section
      id="stats"
      className="section-border-t section-border-b"
      style={{ overflow: "hidden" }}
    >
      <div className="stats-bg" ref={bgRef}>
        <img src="/img/gears.jpg" alt="" />
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
              <span className="stat-source">
                Báo Nhân Dân · Chuyên đề Nguồn nhân lực 2024 · nhandan.vn
              </span>
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
              <span className="stat-source">
                Bộ Giáo dục và Đào tạo · Hội nghị GD Đại học tháng
                8-9/2024 · moet.gov.vn
              </span>
            </div>
          </div>
        </Rev>

        <hr className="hr-line" />

        <Rev delay={1}>
          <div className="stat-row">
            <span className="stat-num-quote">
              "Học đi đôi với hành,<br />
              lý luận gắn liền với thực tiễn."
            </span>
            <div className="stat-meta">
              <span className="stat-source">
                Văn kiện Đại hội XIII · Đảng Cộng sản Việt Nam · 2021 ·
                tulieuvankien.dangcongsan.vn
              </span>
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

function Triptych() {
  return (
    <section className="triptych">
      <img src="/img/triptych.jpg" alt="" />
      <div className="triptych-overlay" />
    </section>
  )
}

/* ============================================================
   COMPARE
   ============================================================ */

function Compare() {
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
          Nhận thức <Dash /> <em>Đúng · Đủ · Hiệu quả</em>
        </h2>
      </Rev>

      <Rev delay={2}>
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
    options: [
      "Thực tiễn chỉ là kết quả của nhận thức",
      "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của chân lý",
      "Nhận thức quyết định và chi phối thực tiễn hoàn toàn",
      "Thực tiễn và nhận thức hoàn toàn độc lập nhau",
    ],
    correct: 1,
    explain:
      "Triết học Mác-Lênin: thực tiễn vừa là cơ sở hình thành nhận thức, vừa là động lực thúc đẩy, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
  {
    q: "Điều gì chủ yếu khiến người 'học xuất sắc' vẫn gặp khó khăn trong doanh nghiệp?",
    options: [
      "Thiếu bằng cấp phù hợp",
      "Thiếu kỹ năng thực hành, kỹ năng mềm và khả năng ứng biến",
      "Kiến thức chuyên môn chưa đủ sâu",
      "Chưa có đủ kinh nghiệm quản lý",
    ],
    correct: 1,
    explain:
      "Doanh nghiệp đòi hỏi không chỉ lý thuyết mà còn khả năng hành động, giao tiếp, hợp tác — không đo được bằng điểm số.",
  },
  {
    q: "Ph. Ăngghen khẳng định chân lý được xác định bằng cách nào?",
    options: [
      "Bằng suy luận logic thuần túy",
      "Bằng đồng thuận của đa số nhà khoa học",
      "Bằng kết quả hoạt động thực tiễn — tự làm ra hiện tượng đó",
      "Bằng quyền uy của các triết gia kinh điển",
    ],
    correct: 2,
    explain:
      "Ăngghen: nếu tự làm ra hiện tượng thì không còn 'vật tự nó không thể nắm được' của Cantơ nữa.",
  },
  {
    q: "Trong môi trường nghề nghiệp, 'nhận thức đủ' bao gồm gì?",
    options: [
      "Chỉ cần kiến thức chuyên ngành sâu",
      "Chỉ cần GPA cao và bằng cấp trường top",
      "Chuyên ngành + kỹ năng mềm + kinh nghiệm + thích nghi",
      "Chỉ cần kỹ năng giao tiếp và networking",
    ],
    correct: 2,
    explain:
      "Nhận thức đủ trong nghề nghiệp còn gồm kỹ năng mềm, kinh nghiệm, hợp tác và quản lý cảm xúc.",
  },
  {
    q: "Mối quan hệ giữa kiến thức học thuật và khả năng hành động là gì?",
    options: [
      "Kiến thức học thuật là yếu tố quyết định",
      "Khả năng hành động quan trọng hơn, kiến thức không cần",
      "Hai yếu tố bổ sung — kiến thức nền tảng, hành động tạo giá trị",
      "Hai yếu tố hoàn toàn độc lập",
    ],
    correct: 2,
    explain:
      "Kiến thức cung cấp nền tảng tư duy. Hành động biến tri thức thành giá trị thực tiễn. Tách rời cả hai đều thất bại.",
  },
]

function Quiz() {
  const [q, setQ] = useState(0)
  const [sel, setSel] = useState(null)
  const [ans, setAns] = useState([])
  const [done, setDone] = useState(false)

  const cur = QUIZ[q]
  const progress = done ? 100 : (q / QUIZ.length) * 100

  const pick = (i) => {
    if (sel !== null) return
    setSel(i)
  }

  const next = () => {
    const newAns = [...ans, sel === cur.correct]
    setAns(newAns)
    setSel(null)
    if (q + 1 >= QUIZ.length) {
      setDone(true)
    } else {
      setQ(q + 1)
    }
  }

  const restart = () => {
    setQ(0)
    setSel(null)
    setAns([])
    setDone(false)
  }

  const score = ans.filter(Boolean).length

  return (
    <section id="quiz" className="section-border-t">
      <div className="quiz-wrap">
        <Rev>
          <Label>(Phần 04 · Ôn tập tương tác · Tiêu chí 3)</Label>
        </Rev>
        <Rev delay={1}>
          <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
            Kiểm tra <Dash /> <em>hiểu bài</em>
          </h2>
        </Rev>

        <div className="progress">
          <span className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {!done ? (
          <Rev key={q}>
            <p className="quiz-q">
              <span className="label" style={{ display: "block", marginBottom: "0.75rem", color: "var(--color-text-label)" }}>
                Câu {q + 1} / {QUIZ.length}
              </span>
              {cur.q}
            </p>

            {cur.options.map((opt, i) => {
              let cls = "quiz-opt"
              if (sel !== null) {
                if (i === cur.correct) cls += " quiz-opt-correct"
                else if (i === sel) cls += " quiz-opt-wrong"
                else cls += " quiz-opt-dim"
              }
              return (
                <button
                  key={i}
                  className={cls}
                  disabled={sel !== null}
                  onClick={() => pick(i)}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              )
            })}

            {sel !== null && (
              <>
                <p className="quiz-explain">{cur.explain}</p>
                <button className="quiz-next" onClick={next}>
                  {q + 1 >= QUIZ.length ? "Xem kết quả →" : "Câu tiếp →"}
                </button>
              </>
            )}
          </Rev>
        ) : (
          <Rev>
            <div className="quiz-result">
              <Label>(Kết quả)</Label>
              <div className="quiz-score" style={{ marginTop: "1rem" }}>
                {score}/{QUIZ.length}
              </div>
              <p className="quiz-score-meta">
                {score === QUIZ.length
                  ? "Hoàn hảo — bạn đã nắm vững mối quan hệ biện chứng."
                  : score >= 3
                  ? "Khá tốt — ôn lại các phần chưa chắc để chuẩn bị phản biện."
                  : "Cần ôn lại — quay về phần Lý thuyết trước khi thi."}
              </p>
              <button className="quiz-next" onClick={restart} style={{ marginTop: "2rem" }}>
                Làm lại ↻
              </button>
            </div>
          </Rev>
        )}
      </div>
    </section>
  )
}

/* ============================================================
   AI USAGE
   ============================================================ */

function AIUsage() {
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
      score: "0.5đ ✓",
      body: "Liệt kê đủ công cụ, mục đích, prompt và link chat.",
    },
    {
      n: "4.2 Trách nhiệm",
      score: "0.5đ ✓",
      body:
        "Mọi luận điểm AI đối chiếu giáo trình LLCT và nguồn chính thống.",
    },
    {
      n: "4.3 Liêm chính",
      score: "0.5đ ✓",
      body:
        "Cam kết văn bản. Phân định rõ AI output và phần nhóm chỉnh sửa.",
    },
    {
      n: "4.4 Sáng tạo",
      score: "0.5đ ✓",
      body:
        "AI hỗ trợ quiz và website — không thay tư duy phân tích của nhóm.",
    },
  ]

  return (
    <section id="ai" className="section-narrow section-border-t">
      <Rev>
        <Label>(Phụ lục · Minh bạch AI · Tiêu chí 4)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          AI Usage <Dash /> <em>có trách nhiệm</em>
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
    setOpen(open.map((v, idx) => (idx === i ? !v : v)))
  }

  return (
    <section id="rebuttal" className="section-narrow section-border-t">
      <Rev>
        <Label>(Chuẩn bị phản biện · Nội bộ nhóm)</Label>
      </Rev>
      <Rev delay={1}>
        <h2 className="h2" style={{ marginTop: "var(--space-stack-md)" }}>
          10 câu hỏi <Dash /> <em>có thể bị hỏi</em>
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
              <button className="acc-head" onClick={() => toggle(i)}>
                <div style={{ flex: 1 }}>
                  <span className="acc-num">
                    Câu {String(i + 1).padStart(2, "0")} {item.warn ? "⚠" : ""}
                  </span>
                  <span className="acc-q">{item.q}</span>
                </div>
                <span className="acc-icon">{open[i] ? "−" : "+"}</span>
              </button>
              <div className={`acc-body ${open[i] ? "open" : ""}`}>
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
  const showPrep =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("prep") === "true"

  return (
    <div id="app-root">
      <Nav showPrep={showPrep} />
      <Hero />
      <CQ />
      <Theory />
      <Stats />
      <Triptych />
      <Compare />
      <Quiz />
      {showPrep && <Rebuttal />}
      <AIUsage />
      <Footer />
    </div>
  )
}
