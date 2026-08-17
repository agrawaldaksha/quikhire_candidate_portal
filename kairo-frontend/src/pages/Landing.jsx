import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import HeroChat from '../components/HeroChat.jsx'
import Counter from '../components/Counter.jsx'
import useReveal from '../components/useReveal.js'
import { TESTIMONIALS, STEPS } from '../data/mock.js'

export default function Landing() {
  useReveal([])

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="container hero-grid">
          <div>
            <span className="announce">
              <span className="tag">New</span> Kairo raises $18m to put a career agent in everyone’s pocket →
            </span>
            <h1 className="display">
              Meet <span className="grad-text">Kai</span> — the AI agent that finds your next job and helps you land it.
            </h1>
            <p className="sub">
              Kai gets to know you in one conversation, scans millions of roles daily, and
              introduces you straight to hiring managers. No applications. No black hole.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn btn-primary btn-lg">Start with Kai — it’s free</Link>
              <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
              <Link to="/resume-builder" className="btn btn-ghost btn-lg">Resume Builder</Link>
            </div>
            <div className="hero-trust">
              <span className="t"><span className="dot" /> First matches in 10 minutes</span>
              <span className="t"><span className="dot" /> Free for candidates, forever</span>
              <span className="t"><span className="dot" /> You control what’s shared</span>
            </div>
          </div>
          <HeroChat />
        </div>
      </section>

      {/* LOGO STRIP */}
      <div className="strip">
        <div className="container strip-inner">
          <span className="lbl">Roles from teams hiring through the QuikHire network</span>
          <div className="strip-logos">
            <span>Loop</span><span>Fyxer</span><span>Marloo</span><span>Vanta</span><span>Granola</span><span>Sierra</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Everything you need to land your next job</span>
            <h2 className="display">One agent. Your whole job search, handled.</h2>
            <p>Kai does the work traditional recruiters can’t — patiently, around the clock, and always on your side.</p>
          </div>

          {/* Feature 1 — job match on autopilot */}
          <div className="feature-row reveal">
            <div className="feature-copy">
              <div className="feature-ico">◎</div>
              <h3>Job search on autopilot</h3>
              <p>Kai learns what “great” looks like for you, then scans millions of roles daily — surfacing genuine step-ups, not keyword spam. You say yes or no; it gets smarter every time.</p>
              <ul className="feature-list">
                <li><span className="tick">✓</span> Ranked by real fit, not volume</li>
                <li><span className="tick">✓</span> Learns from every yes and no</li>
                <li><span className="tick">✓</span> Only surfaces roles worth your time</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <b>New matches</b><span className="pill-line pill">today · 5:40pm</span>
                </div>
                {[
                  { c: '#2f6df6', t: 'Senior Product Designer', s: 'Loop · Remote · €85–105k', n: 96 },
                  { c: '#0ea5e9', t: 'Founding Design Engineer', s: 'Fyxer · Hybrid · £90–120k', n: 93 },
                  { c: '#14b8a6', t: 'Lead UX Designer', s: 'Marloo · Remote · $110–140k', n: 90 },
                ].map((m) => (
                  <div className="match" key={m.t}>
                    <div className="co" style={{ background: m.c }}>{m.t[0]}</div>
                    <div className="meta"><div className="t">{m.t}</div><div className="s">{m.s}</div></div>
                    <div className="pct"><div className="n grad-text">{m.n}%</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>fit</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 — warm intros */}
          <div className="feature-row rev reveal">
            <div className="feature-copy">
              <div className="feature-ico">✦</div>
              <h3>Warm intros to hiring managers</h3>
              <p>When Kai finds a match in QuikHire’s network, it introduces you directly to the person doing the hiring. No applications, no waiting — a warm intro to someone who already wants to meet you.</p>
              <ul className="feature-list">
                <li><span className="tick">✓</span> Skip the application black hole</li>
                <li><span className="tick">✓</span> Direct to the decision-maker</li>
                <li><span className="tick">✓</span> Typical process: 2 days, not 2 months</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="panel panel-dark">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div className="avatar">K</div>
                  <div><b>Kai made an introduction</b><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>today · 5:41pm</div></div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, marginBottom: 16 }}>
                  “Marcus, Head of Design at Loop, wants to chat about the Senior Product Designer role. He loved your design-systems work.”
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <span className="pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>€85–105k</span>
                  <span className="pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>Remote</span>
                  <span className="pill-mint pill">2-day process</span>
                </div>
                <button className="btn btn-primary btn-block">Accept the intro →</button>
              </div>
            </div>
          </div>

          {/* Feature 3 — mock interviews & coaching */}
          <div className="feature-row reveal">
            <div className="feature-copy">
              <div className="feature-ico">◈</div>
              <h3>Mock interviews & real coaching</h3>
              <p>Run a mock interview with Kai and get specific feedback on your stories, clarity and the hard questions. Career coaching worth $300/hour — free — so you walk in with a tighter narrative and fewer surprises.</p>
              <ul className="feature-list">
                <li><span className="tick">✓</span> Confidence scoring on every answer</li>
                <li><span className="tick">✓</span> Feedback tailored to the exact role</li>
                <li><span className="tick">✓</span> Career-clarity coaching when you’re unsure</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="panel">
                <div className="bubble ai" style={{ maxWidth: '100%' }}>Tell me about a migration you led under time pressure.</div>
                <div className="bubble me" style={{ maxWidth: '100%', margin: '10px 0' }}>
                  I led a six-week migration of 40 services in three phases. We aligned stakeholders early and shipped two days ahead with zero downtime.
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0 4px' }}>
                  <div className="ring" style={{ '--v': 82 }}><b>82%</b></div>
                  <div style={{ fontSize: 13.5 }}>
                    <div style={{ color: 'var(--mint)', fontWeight: 600 }}>Strong · clear structure, specific metrics</div>
                    <div style={{ color: 'var(--amber)', fontWeight: 600 }}>Improve · add the stakeholder-conflict detail</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 — salary benchmark & negotiation */}
          <div className="feature-row rev reveal">
            <div className="feature-copy">
              <div className="feature-ico">◆</div>
              <h3>Salary benchmark & negotiation</h3>
              <p>Kai shows you what “good” looks like for your role, level and location — from thousands of real offers — then builds a negotiation plan with the exact language to use. Know when to push and how.</p>
              <ul className="feature-list">
                <li><span className="tick">✓</span> Live market data, not guesswork</li>
                <li><span className="tick">✓</span> A plan with words you can actually say</li>
                <li><span className="tick">✓</span> Candidates average +$18k with Kai</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
                  <span>Market P50 · $155k</span><span>P90 · $220k</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: 'var(--line-2)', position: 'relative', marginBottom: 8 }}>
                  <div style={{ position: 'absolute', height: '100%', width: '62%', borderRadius: 999, background: 'var(--grad)' }} />
                  <div style={{ position: 'absolute', left: '62%', top: -5, width: 3, height: 22, background: 'var(--ink)', borderRadius: 2 }} />
                </div>
                <div style={{ textAlign: 'center', margin: '14px 0' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 40 }}>$181k</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>your recommended target</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="pill">Base $155k</span><span className="pill">Equity $40k</span><span className="pill">Bonus $15k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="panel reveal" style={{ padding: 10 }}>
            <div className="stats">
              <div className="stat"><div className="n grad-text"><Counter end={284531} /></div><div className="l">Candidates working with Kai</div></div>
              <div className="stat"><div className="n grad-text"><Counter end={12} suffix="M" /></div><div className="l">Roles scanned every day</div></div>
              <div className="stat"><div className="n grad-text"><Counter end={30} suffix=" hrs" /></div><div className="l">Saved vs a traditional search</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Why Kai exists</span>
            <h2 className="display">From conversation to offer, in five steps.</h2>
            <p>Kai’s mission is unimaginably good career support for everyone — not just those who’ve already made it.</p>
          </div>
          <div className="steps reveal">
            {STEPS.map((s) => (
              <div className="step" key={s.no}>
                <div className="no">{s.no}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Loved by candidates</span>
            <h2 className="display">A talent partner, not a job board.</h2>
          </div>
          <div className="tgrid reveal">
            {TESTIMONIALS.map((t) => (
              <div className="quote" key={t.name}>
                <div className="stars">★★★★★</div>
                <p>“{t.text}”</p>
                <div className="who">
                  <div className="av" style={{ background: t.color }}>{t.initials}</div>
                  <div><div className="nm">{t.name}</div><div className="rl">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="cta-band reveal">
            <span className="eyebrow" style={{ color: '#bcd3ff' }}>Pricing</span>
            <h2>Kai is completely free for candidates.</h2>
            <p>Companies pay only when they hire through the QuikHire network. No catch, no hidden fees.</p>
            <div className="price-card panel" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <b style={{ fontSize: 18 }}>Your plan · everything included</b>
                <div className="amt grad-text" style={{ background: 'linear-gradient(135deg,#bcd3ff,#9dc0ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>$0</div>
              </div>
              <ul className="price-list">
                <li><span className="tick">✓</span> Job search on autopilot</li>
                <li><span className="tick">✓</span> Warm intros to hiring managers</li>
                <li><span className="tick">✓</span> Mock interviews & career coaching</li>
                <li><span className="tick">✓</span> Salary benchmark & negotiation plan</li>
              </ul>
              <Link to="/login" className="btn btn-primary btn-block btn-lg">Start with Kai →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOR RECRUITERS */}
      <section className="section" id="recruiters" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="panel reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', padding: 30 }}>
            <div>
              <span className="eyebrow">Hiring, not job-hunting?</span>
              <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 26, margin: '8px 0 6px' }}>Meet QuikHire — the recruiter side.</h3>
              <p style={{ color: 'var(--muted)', maxWidth: '52ch' }}>Kairo brings you the candidate. QuikHire is where recruiters source, screen and hire them. Same network, two sides of the table.</p>
            </div>
            <a href="#" className="btn btn-dark btn-lg">Go to QuikHire →</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
