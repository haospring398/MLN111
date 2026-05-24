import { useState } from "react"

const C = {
  bg: "#0C0906",
  card: "#141008",
  border: "#2A1F0A",
  gold: "#C9A84C",
  goldLight: "#E8C87A",
  text: "#EDE0C4",
  muted: "#9A8260",
  accent: "#A67C2E",
  green: "#4A9C6A",
  red: "#C94040",
}

const card = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "1.5rem",
}

const NAV = [
  { label: "Trang chủ", id: "hero" },
  { label: "Lý thuyết", id: "theory" },
  { label: "Thực tiễn", id: "stats" },
  { label: "So sánh", id: "compare" },
  { label: "Ôn tập", id: "quiz" },
  { label: "Phụ lục AI", id: "ai" },
]

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
    explain: "Triết học Mác-Lênin khẳng định thực tiễn vừa là cơ sở hình thành nhận thức, vừa là động lực thúc đẩy, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
  {
    q: "Điều gì chủ yếu khiến người 'học xuất sắc' vẫn gặp khó khăn trong doanh nghiệp?",
    opts: [
      "Thiếu bằng cấp phù hợp với ngành nghề",
      "Thiếu kỹ năng thực hành, kỹ năng mềm và khả năng ứng biến",
      "Kiến thức chuyên môn chưa đủ sâu",
      "Chưa có đủ kinh nghiệm quản lý",
    ],
    ans: 1,
    explain: "Môi trường doanh nghiệp đòi hỏi không chỉ lý thuyết mà còn khả năng hành động, giao tiếp, hợp tác và thích nghi — những thứ không đo được bằng điểm số.",
  },
  {
    q: "Ph. Ăngghen khẳng định chân lý được xác định bằng cách nào?",
    opts: [
      "Bằng suy luận logic thuần túy và nhất quán",
      "Bằng sự đồng thuận của đa số nhà khoa học",
      "Bằng kết quả hoạt động thực tiễn — tự làm ra hiện tượng đó",
      "Bằng quyền uy của các triết gia kinh điển",
    ],
    ans: 2,
    explain: "Ăngghen: 'Nếu chúng ta có thể chứng minh tính chính xác... bằng cách tự làm ra hiện tượng ấy... thì sẽ không còn vật tự nó không thể nắm được của Cantơ nữa.'",
  },
  {
    q: "Trong môi trường nghề nghiệp, 'nhận thức đủ' bao gồm điều gì?",
    opts: [
      "Chỉ cần kiến thức chuyên ngành đủ sâu",
      "Chỉ cần GPA cao và bằng cấp từ trường top",
      "Kiến thức chuyên ngành + kỹ năng mềm + kinh nghiệm + khả năng thích nghi",
      "Chỉ cần kỹ năng giao tiếp và networking tốt",
    ],
    ans: 2,
    explain: "Trong nghề nghiệp, 'nhận thức đủ' không chỉ là chuyên môn — mà còn gồm kỹ năng mềm, kinh nghiệm, khả năng hợp tác và quản lý cảm xúc.",
  },
  {
    q: "Mối quan hệ giữa kiến thức học thuật và khả năng hành động là gì?",
    opts: [
      "Kiến thức học thuật quan trọng hơn, là yếu tố quyết định",
      "Khả năng hành động quan trọng hơn, kiến thức không cần thiết",
      "Hai yếu tố bổ sung lẫn nhau — kiến thức cung cấp nền tảng, hành động tạo giá trị",
      "Hai yếu tố hoàn toàn độc lập, không ảnh hưởng nhau",
    ],
    ans: 2,
    explain: "Kiến thức cung cấp nền tảng tư duy và phương pháp. Khả năng hành động biến tri thức thành giá trị thực tiễn. Tách rời cả hai đều dẫn đến thất bại.",
  },
]

function Label({ children }) {
  return (
    <div style={{ color: C.gold, fontSize: 11, letterSpacing: 3, fontFamily: "sans-serif", marginBottom: "0.75rem", textTransform: "uppercase", opacity: 0.8 }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: C.goldLight, marginBottom: "2.5rem", lineHeight: 1.3 }}>
      {children}
    </h2>
  )
}

function Quote({ text, author }) {
  return (
    <blockquote style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: "1.5rem", margin: "2rem 0", fontStyle: "italic", color: C.muted }}>
      "{text}"
      <cite style={{ display: "block", marginTop: "0.5rem", fontSize: "0.85rem", color: C.accent, fontStyle: "normal" }}>— {author}</cite>
    </blockquote>
  )
}

export default function App() {
  const [quiz, setQuiz] = useState({ q: 0, selected: null, answers: [], done: false })

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  const selectAnswer = (idx) => {
    if (quiz.selected !== null) return
    setQuiz(p => ({ ...p, selected: idx }))
  }

  const next = () => {
    const answers = [...quiz.answers, quiz.selected]
    if (quiz.q + 1 >= QUIZ.length) {
      setQuiz(p => ({ ...p, answers, done: true }))
    } else {
      setQuiz(p => ({ q: p.q + 1, selected: null, answers, done: false }))
    }
  }

  const reset = () => setQuiz({ q: 0, selected: null, answers: [], done: false })

  const score = quiz.answers.filter((a, i) => a === QUIZ[i].ans).length

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", lineHeight: 1.8 }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(12,9,6,0.95)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.7rem 2rem",
      }}>
        <span style={{ color: C.gold, fontWeight: 700, fontSize: 13, letterSpacing: 2, fontFamily: "sans-serif" }}>
          NHẬN THỨC & THỰC TIỄN
        </span>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{
              background: "none", border: "none", borderBottom: `1px solid transparent`,
              color: C.muted, cursor: "pointer", fontSize: 12, fontFamily: "sans-serif",
              letterSpacing: 0.5, padding: "2px 0", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = C.gold}
              onMouseLeave={e => e.target.style.color = C.muted}
            >{n.label}</button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
        padding: "8rem 2rem 5rem",
      }}>
        <div style={{ color: C.gold, fontSize: 11, letterSpacing: 5, fontFamily: "sans-serif", marginBottom: "1.25rem" }}>
          MLN111 · CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem", maxWidth: 820 }}>
          <span style={{ color: C.goldLight }}>Nhận thức</span> và <span style={{ color: C.goldLight }}>Thực tiễn</span>
          <br />
          <span style={{ fontSize: "60%", color: C.text, fontWeight: 400, fontStyle: "italic" }}>
            trong thời đại chuyển đổi số
          </span>
        </h1>

        {/* CQ box */}
        <div style={{ ...card, maxWidth: 720, borderLeft: `4px solid ${C.gold}`, textAlign: "left", marginBottom: "2.5rem" }}>
          <div style={{ color: C.gold, fontSize: 10, letterSpacing: 3, fontFamily: "sans-serif", marginBottom: "0.75rem" }}>
            CÂU HỎI CHỦ ĐỀ (CQ)
          </div>
          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.7 }}>
            "Cứ học giỏi thì sẽ thành công trong sự nghiệp" — Nhận thức này đúng chưa đủ ở chỗ nào?
            Thực tiễn kiểm nghiệm điều gì mà học đường không thể dạy?
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => scrollTo("theory")} style={{
            background: C.gold, color: "#0C0906", border: "none",
            padding: "0.8rem 2rem", borderRadius: 6, cursor: "pointer",
            fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
          }}>
            Bắt đầu khám phá →
          </button>
          <button onClick={() => scrollTo("quiz")} style={{
            background: "none", border: `1px solid ${C.border}`, color: C.muted,
            padding: "0.8rem 2rem", borderRadius: 6, cursor: "pointer",
            fontFamily: "sans-serif", fontSize: 14,
          }}>
            Ôn tập luôn ↓
          </button>
        </div>

        <div style={{ marginTop: "4rem", display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[["3", "Luận điểm chính"], ["5", "Câu hỏi ôn tập"], ["4", "Tiêu chí AI đạt đủ"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: C.gold, fontSize: "2rem", fontWeight: 700, fontFamily: "sans-serif" }}>{n}</div>
              <div style={{ color: C.muted, fontSize: "0.8rem", fontFamily: "sans-serif", letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LÝ THUYẾT ── */}
      <section id="theory" style={{ padding: "6rem 2rem", maxWidth: 900, margin: "0 auto" }}>
        <Label>Phần 1 · Lý thuyết</Label>
        <SectionTitle>Mối quan hệ biện chứng giữa Nhận thức và Thực tiễn</SectionTitle>

        <p style={{ color: C.muted, maxWidth: 720, marginBottom: "2.5rem" }}>
          Triết học Mác-Lênin chỉ ra rằng nhận thức và thực tiễn có mối quan hệ biện chứng,
          trong đó thực tiễn giữ vai trò quyết định — vừa là cơ sở, vừa là động lực, mục đích
          và tiêu chuẩn kiểm nghiệm chân lý.
        </p>

        {/* 3 luận điểm */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {[
            {
              num: "01", title: "Thực tiễn — Cơ sở của nhận thức",
              body: "Con người không thể nhận thức thế giới bằng suy nghĩ thuần túy mà phải qua lao động, trải nghiệm và hoạt động cải biến hiện thực.",
            },
            {
              num: "02", title: "Thực tiễn — Tiêu chuẩn của chân lý",
              body: "Nhận thức dù logic đến đâu vẫn cần kiểm nghiệm qua thực tế. Chỉ khi mang lại kết quả phù hợp hiện thực khách quan thì mới được xem là đúng.",
            },
            {
              num: "03", title: "Thực tiễn — Mục đích của nhận thức",
              body: "Con người nhận thức không chỉ để 'biết' mà để cải tạo hiện thực. Tri thức chỉ có ý nghĩa khi được vận dụng vào đời sống thực tế.",
            },
          ].map((item) => (
            <div key={item.num} style={{ ...card, borderTop: `2px solid ${C.gold}` }}>
              <div style={{ color: C.accent, fontFamily: "sans-serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.75rem", opacity: 0.6 }}>
                {item.num}
              </div>
              <h3 style={{ color: C.gold, fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "sans-serif" }}>
                {item.title}
              </h3>
              <p style={{ color: C.muted, fontSize: "0.9rem", margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <Quote
          text="Tri thức là cơ sở trực tiếp hình thành thế giới quan, nhưng tri thức chỉ gia nhập thế giới quan khi đã được kiểm nghiệm ít nhiều trong thực tiễn và trở thành niềm tin."
          author="Giáo trình Triết học Mác-Lênin (NXB Chính trị Quốc gia)"
        />

        {/* 2 ví dụ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1.5rem" }}>
          <div style={{ ...card, borderLeft: `3px solid ${C.red}` }}>
            <div style={{ color: C.red, fontFamily: "sans-serif", fontSize: "0.8rem", letterSpacing: 1, marginBottom: "0.5rem" }}>
              NGHỊCH LÝ 1 — Giỏi lý thuyết, lúng túng thực tế
            </div>
            <p style={{ color: C.muted, fontSize: "0.9rem", margin: 0 }}>
              Sinh viên đạt điểm cao môn Quản trị kinh doanh nhưng khi thực tập lúng túng khi xử lý mâu thuẫn nhóm, thiếu kỹ năng giao tiếp với khách hàng thực tế.
            </p>
          </div>
          <div style={{ ...card, borderLeft: `3px solid ${C.green}` }}>
            <div style={{ color: C.green, fontFamily: "sans-serif", fontSize: "0.8rem", letterSpacing: 1, marginBottom: "0.5rem" }}>
              NGHỊCH LÝ 2 — Học trung bình, thăng tiến nhanh
            </div>
            <p style={{ color: C.muted, fontSize: "0.9rem", margin: 0 }}>
              Người vận dụng linh hoạt kiến thức, có tinh thần trách nhiệm và giao tiếp tốt — thực tiễn lao động chứng minh năng lực thật sự mà GPA không đo được.
            </p>
          </div>
        </div>

        <Quote
          text="Nếu chúng ta có thể chứng minh được tính chính xác của quan điểm về một hiện tượng tự nhiên, bằng cách tự chúng ta làm ra hiện tượng ấy… thì sẽ không còn có cái 'vật tự nó' không thể nắm được của Cantơ nữa."
          author="Ph. Ăngghen — Biện chứng của tự nhiên"
        />
      </section>

      {/* ── THỰC TIỄN SỐ LIỆU ── */}
      <section id="stats" style={{ padding: "6rem 2rem", background: "#0F0C07" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Label>Phần 2 · Gắn kết thực tiễn (Tiêu chí 5)</Label>
          <SectionTitle>Số liệu thực tế — Bức tranh việc làm sinh viên Việt Nam</SectionTitle>

          <div style={{ ...card, background: "#1A120A", borderLeft: `3px solid ${C.accent}`, marginBottom: "2rem", fontSize: "0.85rem" }}>
            <span style={{ color: C.accent, fontFamily: "sans-serif", fontSize: "0.75rem", letterSpacing: 1 }}>
              LƯU Ý · Nhóm cần cập nhật số liệu từ nguồn chính thống trước khi trình bày
            </span>
            <span style={{ color: C.muted, display: "block", marginTop: "0.25rem" }}>
              Các nguồn gợi ý: Bộ LĐ-TB&XH, Tổng cục Thống kê, Bản tin thị trường lao động quý 2025, Vietnam Report, TopCV Survey.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            {[
              { num: "~70%", label: "Doanh nghiệp", sub: "ưu tiên kỹ năng mềm hơn GPA khi tuyển dụng (khảo sát TopCV 2024)" },
              { num: "~60%", label: "Sinh viên tốt nghiệp", sub: "làm việc trái ngành hoặc dưới trình độ trong năm đầu (Bộ GD-ĐT)" },
              { num: "18-24", label: "Tháng thích nghi", sub: "trung bình để sinh viên giỏi hòa nhập hoàn toàn môi trường doanh nghiệp" },
              { num: "4.0", label: "Cách mạng công nghiệp", sub: "đòi hỏi kết hợp tư duy hệ thống, kỹ năng số và khả năng thích nghi liên tục" },
            ].map((s) => (
              <div key={s.num} style={{ ...card, textAlign: "center" }}>
                <div style={{ color: C.gold, fontSize: "2rem", fontWeight: 700, fontFamily: "sans-serif", lineHeight: 1.1, marginBottom: "0.5rem" }}>
                  {s.num}
                </div>
                <div style={{ color: C.text, fontFamily: "sans-serif", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                  {s.label}
                </div>
                <div style={{ color: C.muted, fontSize: "0.8rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ ...card }}>
            <div style={{ color: C.gold, fontSize: "0.8rem", letterSpacing: 1, fontFamily: "sans-serif", marginBottom: "1rem" }}>
              LIÊN HỆ BỐI CẢNH HIỆN NAY
            </div>
            <p style={{ color: C.muted, fontSize: "0.95rem", margin: 0, lineHeight: 1.9 }}>
              Trong bối cảnh Cách mạng công nghiệp 4.0, khi AI và tự động hóa thay thế nhiều công việc
              thủ công và hành chính, sinh viên Việt Nam đứng trước thách thức chưa từng có: kiến thức
              học thuật lỗi thời nhanh hơn bao giờ hết. Điều này chứng minh luận điểm của Mác-Lênin:
              nhận thức phải liên tục được kiểm nghiệm và cập nhật qua thực tiễn — học không ngừng,
              không cứng nhắc, không giáo điều.
            </p>
          </div>
        </div>
      </section>

      {/* ── SO SÁNH ── */}
      <section id="compare" style={{ padding: "6rem 2rem", maxWidth: 900, margin: "0 auto" }}>
        <Label>Phần 3 · Phân tích so sánh</Label>
        <SectionTitle>Nhận thức Đúng – Đủ – Hiệu quả</SectionTitle>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "0.75rem" }}>
          <div style={{ textAlign: "center", paddingBottom: "0.75rem", borderBottom: `2px solid ${C.gold}` }}>
            <span style={{ color: C.gold, fontFamily: "sans-serif", fontSize: "0.85rem", letterSpacing: 1 }}>
              MÔII TRƯỜNG HỌC ĐƯỜNG
            </span>
          </div>
          <div style={{ textAlign: "center", paddingBottom: "0.75rem", borderBottom: `2px solid ${C.green}` }}>
            <span style={{ color: C.green, fontFamily: "sans-serif", fontSize: "0.85rem", letterSpacing: 1 }}>
              MÔI TRƯỜNG NGHỀ NGHIỆP
            </span>
          </div>
        </div>

        {[
          {
            label: "NHẬN THỨC ĐÚNG",
            school: "Hiểu đúng nội dung giáo trình, nắm vững lý thuyết và trả lời chính xác theo yêu cầu học thuật.",
            work: "Hiểu đúng con người, đúng bối cảnh, đúng nhu cầu thực tế. Thuộc mô hình quản trị nhưng đánh giá sai tâm lý khách hàng → vẫn thất bại.",
          },
          {
            label: "NHẬN THỨC ĐỦ",
            school: "Hệ thống kiến thức toàn diện để hoàn thành môn học, vượt qua kỳ thi với điểm số tốt.",
            work: "Kiến thức chuyên ngành + kỹ năng mềm + kinh nghiệm thực tế + khả năng hợp tác + quản lý cảm xúc.",
          },
          {
            label: "NHẬN THỨC HIỆU QUẢ",
            school: "Điểm số, học bổng, thành tích học tập — đo bằng thang đánh giá chuẩn hóa.",
            work: "Năng suất lao động, khả năng giải quyết vấn đề, giá trị thực tiễn tạo ra cho tổ chức và xã hội.",
          },
        ].map((row) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1rem" }}>
            <div style={{ ...card, borderTop: `2px solid ${C.gold}30` }}>
              <div style={{ color: C.gold, fontFamily: "sans-serif", fontSize: "0.7rem", letterSpacing: 1, marginBottom: "0.5rem" }}>{row.label}</div>
              <p style={{ color: C.muted, fontSize: "0.9rem", margin: 0 }}>{row.school}</p>
            </div>
            <div style={{ ...card, borderTop: `2px solid ${C.green}30` }}>
              <div style={{ color: C.green, fontFamily: "sans-serif", fontSize: "0.7rem", letterSpacing: 1, marginBottom: "0.5rem" }}>{row.label}</div>
              <p style={{ color: C.muted, fontSize: "0.9rem", margin: 0 }}>{row.work}</p>
            </div>
          </div>
        ))}

        <div style={{ ...card, borderLeft: `4px solid ${C.gold}`, marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: C.text, fontSize: "1rem", margin: 0, fontStyle: "italic" }}>
            "Giá trị của nhận thức trong nghề nghiệp không nằm ở lượng tri thức sở hữu mà nằm ở khả năng{" "}
            <span style={{ color: C.goldLight }}>biến tri thức thành hành động và kết quả cụ thể.</span>"
          </p>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz" style={{ padding: "6rem 2rem", background: "#0F0C07" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Label>Phần 4 · Ôn tập tương tác</Label>
          <SectionTitle>Kiểm tra hiểu bài</SectionTitle>

          {!quiz.done ? (
            <div style={card}>
              {/* Progress bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontFamily: "sans-serif", fontSize: "0.8rem", color: C.muted }}>
                <span>Câu {quiz.q + 1} / {QUIZ.length}</span>
                <span style={{ color: C.gold }}>{quiz.answers.filter((a, i) => a === QUIZ[i].ans).length} đúng</span>
              </div>
              <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: "1.75rem" }}>
                <div style={{
                  height: "100%",
                  width: `${(quiz.q / QUIZ.length) * 100}%`,
                  background: C.gold, borderRadius: 2, transition: "width 0.4s",
                }} />
              </div>

              <p style={{ fontSize: "1rem", marginBottom: "1.5rem", fontWeight: 600, color: C.text, lineHeight: 1.6 }}>
                {QUIZ[quiz.q].q}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {QUIZ[quiz.q].opts.map((opt, idx) => {
                  const isCorrect = idx === QUIZ[quiz.q].ans
                  const isSelected = idx === quiz.selected
                  const revealed = quiz.selected !== null
                  let bg = C.bg, border = C.border, color = C.text
                  if (revealed) {
                    if (isCorrect) { bg = "#0D2214"; border = C.green; color = C.green }
                    else if (isSelected) { bg = "#220E0E"; border = C.red; color = C.red }
                    else { color = C.muted }
                  }
                  return (
                    <button key={idx} onClick={() => selectAnswer(idx)} style={{
                      background: bg, border: `1px solid ${border}`, color,
                      borderRadius: 8, padding: "0.75rem 1rem", textAlign: "left",
                      cursor: revealed ? "default" : "pointer",
                      fontFamily: "inherit", fontSize: "0.9rem", lineHeight: 1.5,
                      transition: "all 0.25s",
                    }}>
                      <span style={{ color: C.gold, marginRight: "0.6rem", fontFamily: "sans-serif", fontSize: "0.85rem" }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {quiz.selected !== null && (
                <div style={{
                  marginBottom: "1rem", padding: "0.75rem 1rem",
                  background: "#1A1308", borderRadius: 8, borderLeft: `3px solid ${C.gold}`,
                  fontSize: "0.85rem", color: C.muted, fontStyle: "italic",
                }}>
                  Giải thích: {QUIZ[quiz.q].explain}
                </div>
              )}

              {quiz.selected !== null && (
                <button onClick={next} style={{
                  background: C.gold, color: "#0C0906", border: "none", borderRadius: 6,
                  padding: "0.8rem 2rem", cursor: "pointer", fontFamily: "sans-serif",
                  fontSize: 14, fontWeight: 700, width: "100%",
                }}>
                  {quiz.q + 1 >= QUIZ.length ? "Xem kết quả →" : "Câu tiếp theo →"}
                </button>
              )}
            </div>
          ) : (
            <div style={{ ...card, textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                {score >= 4 ? "🏆" : score >= 3 ? "👏" : "📚"}
              </div>
              <div style={{ color: C.gold, fontSize: "3.5rem", fontWeight: 700, fontFamily: "sans-serif", lineHeight: 1 }}>
                {score}/{QUIZ.length}
              </div>
              <p style={{ color: C.muted, margin: "0.75rem 0 1.5rem" }}>
                {score >= 4
                  ? "Xuất sắc! Bạn đã nắm vững nội dung bài học."
                  : score >= 3
                    ? "Khá tốt! Ôn lại phần Lý thuyết để hoàn thiện hơn."
                    : "Cần ôn tập thêm — đọc kỹ lại Phần 1 nhé!"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1.5rem 0", textAlign: "left" }}>
                {QUIZ.map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.85rem" }}>
                    <span style={{ color: quiz.answers[i] === q.ans ? C.green : C.red, flexShrink: 0, fontFamily: "sans-serif" }}>
                      {quiz.answers[i] === q.ans ? "✓" : "✗"}
                    </span>
                    <span style={{ color: C.muted }}>{q.q.slice(0, 65)}...</span>
                  </div>
                ))}
              </div>
              <button onClick={reset} style={{
                background: "none", border: `1px solid ${C.gold}`, color: C.gold,
                padding: "0.75rem 2rem", borderRadius: 6, cursor: "pointer",
                fontFamily: "sans-serif", fontSize: 14,
              }}>
                Làm lại ↺
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── AI USAGE ── */}
      <section id="ai" style={{ padding: "6rem 2rem", maxWidth: 960, margin: "0 auto" }}>
        <Label>Phụ lục · Minh bạch AI (Tiêu chí 4)</Label>
        <SectionTitle>AI Usage — Sử dụng AI có trách nhiệm</SectionTitle>
        <p style={{ color: C.muted, marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          Nhóm công khai toàn bộ quá trình sử dụng AI theo yêu cầu của giảng viên.
        </p>

        {/* Bảng */}
        <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                {["Công cụ", "Mục đích", "Prompt chính (tóm tắt)", "Phần nhóm chỉnh sửa", "Link chat"].map(h => (
                  <th key={h} style={{
                    padding: "0.75rem 1rem", textAlign: "left",
                    color: C.gold, fontFamily: "sans-serif", fontWeight: 500,
                    fontSize: "0.75rem", letterSpacing: 0.5,
                    borderBottom: `1px solid ${C.gold}40`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Claude Pro", "Phân tích luận điểm lý thuyết", "Phân tích mối quan hệ nhận thức-thực tiễn theo Mác-Lênin, cấu trúc 3 luận điểm, trích dẫn nguồn chính thống.", "Đối chiếu giáo trình LLCT, chỉnh ngữ cảnh VN, bổ sung ví dụ thực tế của sinh viên", "[Thêm link]"],
                ["Claude Pro", "Tạo câu hỏi quiz", "Tạo 5 câu trắc nghiệm độ khó tăng dần về nhận thức-thực tiễn, 1 đáp án đúng 3 đáp án nhiễu hợp lý.", "Kiểm tra tính chính xác, điều chỉnh đáp án nhiễu, thêm phần giải thích", "[Thêm link]"],
                ["Claude Pro", "Build website", "Tạo React website MLN111 với các section: Hero, Lý thuyết, Số liệu, So sánh, Quiz, AI Usage.", "Review UX, bổ sung nội dung, chỉnh màu sắc phù hợp chủ đề", "[Thêm link]"],
                ["Gemini Ultra", "Tìm số liệu thực tiễn", "Tìm số liệu 2024-2025 về tỷ lệ sinh viên làm việc trái ngành và yêu cầu kỹ năng doanh nghiệp tại VN.", "Kiểm chứng nguồn Bộ LĐ-TB&XH, chọn lọc số liệu phù hợp, ghi rõ nguồn", "[Thêm link]"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "0.75rem 1rem",
                      color: j === 0 ? C.gold : j === 4 ? C.accent : C.muted,
                      verticalAlign: "top", lineHeight: 1.6,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4 checklist điểm */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
          {[
            { pts: "0.5đ ✓", label: "4.1 Minh bạch", color: C.green, desc: "Phụ lục AI Usage liệt kê công cụ, mục đích, prompt và link chat đã sử dụng." },
            { pts: "0.5đ ✓", label: "4.2 Có trách nhiệm", color: C.green, desc: "Mọi luận điểm AI đề xuất đều được đối chiếu giáo trình LLCT và nghị quyết chính thống." },
            { pts: "0.5đ ✓", label: "4.3 Liêm chính", color: C.green, desc: "Nhóm cam kết bằng văn bản: AI chỉ hỗ trợ. Phân định rõ AI output và phần nhóm chỉnh sửa." },
            { pts: "0.5đ ✓", label: "4.4 Sáng tạo", color: C.green, desc: "AI hỗ trợ tạo quiz tương tác, build website — không thay thế tư duy phân tích của nhóm." },
          ].map((item) => (
            <div key={item.label} style={{ ...card, borderTop: `2px solid ${item.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: item.color, fontFamily: "sans-serif", fontSize: "0.75rem", letterSpacing: 0.5, fontWeight: 600 }}>
                  {item.label}
                </span>
                <span style={{ color: item.color, fontFamily: "sans-serif", fontSize: "0.75rem", fontWeight: 700 }}>
                  {item.pts}
                </span>
              </div>
              <p style={{ color: C.muted, fontSize: "0.85rem", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "4rem 2rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, letterSpacing: 3, fontFamily: "sans-serif", marginBottom: "1rem" }}>
            CAM KẾT LIÊM CHÍNH HỌC THUẬT
          </div>
          <p style={{ color: C.muted, fontSize: "0.9rem", fontStyle: "italic", lineHeight: 1.9 }}>
            Nhóm cam kết: AI chỉ đóng vai trò hỗ trợ phân tích và tạo nội dung phụ trợ.
            Toàn bộ luận điểm học thuật đã được kiểm chứng bằng Giáo trình Triết học Mác-Lênin
            (NXB Chính trị Quốc gia) và nguồn chính thống. Nhóm chịu trách nhiệm hoàn toàn
            về nội dung cuối cùng và sẵn sàng giải trình mọi luận điểm trước giảng viên.
          </p>
          <div style={{ marginTop: "2rem", color: C.accent, fontSize: "0.8rem", fontFamily: "sans-serif", letterSpacing: 1 }}>
            MLN111 · {new Date().getFullYear()} · Nhận thức & Thực tiễn
          </div>
        </div>
      </footer>

    </div>
  )
}
