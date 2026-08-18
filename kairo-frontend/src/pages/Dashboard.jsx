import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'
import KaiDock from '../components/KaiDock.jsx'
import { benchmark } from '../screening/engine.js'
import { DASH_INTROS, NEW_JOBS, COACHING } from '../data/mock.js'

const ROLE_WORD = {
  Engineering: 'Engineer', Product: 'Product Manager', Design: 'Designer',
  'Data / ML': 'Data Scientist', 'Sales / GTM': 'Account Executive',
  Marketing: 'Marketer', Operations: 'Operations Lead', Other: 'Specialist',
}
const COMPANIES = [
  { co: 'Loop', color: '#2f6df6' }, { co: 'Fyxer', color: '#0ea5e9' },
  { co: 'Marloo', color: '#14b8a6' }, { co: 'Vanta', color: '#f59e0b' },
]
const WORK_MODES = ['Remote', 'Hybrid', 'On-site', 'Flexible / open']
const AVAILABILITY = ['Immediately', 'Within a month', '2–3 months', 'Just exploring']

function titleFor(profile) {
  const roleWord = ROLE_WORD[profile.role] || 'Specialist'
  let prefix = ''
  if (profile.seniority === 'Leadership') prefix = 'Lead '
  else if (profile.experience === '10+ years') prefix = 'Principal '
  else if (profile.experience === '6–9 years') prefix = 'Senior '
  const focus = profile.focus && !['Either — show me both'].includes(profile.focus) ? profile.focus + ' ' : ''
  return `${prefix}${focus}${roleWord}`.replace(/\s+/g, ' ').trim()
}
function makeMatches(profile) {
  const base = titleFor(profile)
  const mode = profile.workMode && profile.workMode !== 'Flexible / open' ? profile.workMode : 'Remote'
  const scores = [96, 93, 90, 88]
  const locs = [`${mode} (EU)`, `${mode} / Hybrid`, mode, `${mode} (US)`]
  return COMPANIES.map((c, i) => ({ ...c, title: base, sub: `${c.co} · ${locs[i]}`, score: scores[i] }))
}
function completeness(profile) {
  const fields = ['name', 'email', 'role', 'focus', 'experience', 'workMode', 'salaryTarget', 'availability']
  const filled = fields.filter((f) => profile[f]).length
  const skillPts = Math.min((profile.skills?.length || 0), 4)
  return Math.min(Math.round(((filled + skillPts) / (fields.length + 4)) * 100), 100)
}
const splitList = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)

// self-rated proficiency lives in profile.skillRatings: { [skill]: 1..5 }
const WEAK_MAX = 2 // skills the user rates 1–2 get practice assignments

function useOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

export default function Dashboard() {
  const { profile, screeningEmailed, hydrateFromServer, saveProfile, saveMemory, resetAll } = useApp()
  const nav = useNavigate()
  const [toast, setToast] = useState(true)
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('Dashboard')
  const noteTimer = useRef()

  // tracked jobs (shared between New jobs + Tracked jobs)
  const [tracked, setTracked] = useState({ saved: [], applied: [], inProcess: [] })
  // completed skill assignments (persisted locally so strength gains survive a refresh)
  const doneKey = `kairo_assign_${profile.candidateId || 'me'}`
  const [assignDone, setAssignDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(doneKey) || '[]') } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem(doneKey, JSON.stringify(assignDone)) } catch { /* ignore */ } }, [assignDone, doneKey])

  useEffect(() => { hydrateFromServer() }, [hydrateFromServer])
  useEffect(() => {
    const t = setTimeout(() => setToast(false), 6000)
    return () => clearTimeout(t)
  }, [])

  const notice = (m) => {
    setNote(m)
    clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setNote(''), 2600)
  }

  const matches = makeMatches(profile)
  const bench = benchmark(profile)
  const baseStrength = completeness(profile)
  const strength = Math.min(baseStrength + assignDone.length * 3, 100)
  const first = (profile.name || 'there').split(' ')[0]
  const span = Math.max(bench.p90 - bench.p50, 1)
  const targetLeft = Math.min(Math.max(((bench.target - bench.p50) / span) * 100, 4), 96)

  // job tracking helpers
  const inAny = (id) => ['saved', 'applied', 'inProcess'].some((k) => tracked[k].some((j) => j.id === id))
  const track = (col, job) => setTracked((t) => {
    const cleaned = { saved: t.saved.filter((j) => j.id !== job.id), applied: t.applied.filter((j) => j.id !== job.id), inProcess: t.inProcess.filter((j) => j.id !== job.id) }
    return { ...cleaned, [col]: [...cleaned[col], job] }
  })
  const untrack = (id) => setTracked((t) => ({ saved: t.saved.filter((j) => j.id !== id), applied: t.applied.filter((j) => j.id !== id), inProcess: t.inProcess.filter((j) => j.id !== id) }))

  const goProfile = () => setTab('Profile')

  const NAV = [
    ['Dashboard', '▦'], ['New jobs', '◎'], ['Tracked jobs', '≣'], ['Coaching', '◈'],
    ['Assignments', '✎'], ['Profile', '☺'], ['Settings', '⚙'],
  ]

  return (
    <div className="dash">
      {toast && (
        <div className="toast">
          <span className="ic">✉</span>
          {screeningEmailed
            ? <>Chat summary emailed to {profile.email || 'your inbox'}</>
            : <>Chat summary saved to your profile</>}
        </div>
      )}
      {note && <div className="toast" style={{ top: toast ? 70 : 20 }}><span className="ic">✓</span>{note}</div>}

      {/* Sidebar */}
      <aside className="side">
        <div className="brand"><Logo /></div>
        <nav>
          {NAV.map(([label, ic]) => (
            <button key={label} className={`side-link ${tab === label ? 'active' : ''}`} onClick={() => setTab(label)}>
              <span className="ic">{ic}</span> {label}
            </button>
          ))}
        </nav>
        <button className="btn btn-primary btn-block" style={{ margin: '12px 14px 0', width: 'calc(100% - 28px)' }} onClick={() => nav('/resume-builder')}>📄 Resume Builder</button>
      </aside>

      {/* Main */}
      <main className="main">
        {/* #9 user chip moved to top-right */}
        <div className="dash-topbar">
          <UserChip profile={profile} first={first} titleFor={titleFor} goProfile={goProfile} onLogout={() => { resetAll(); nav('/') }} />
        </div>

        {tab === 'Dashboard' && (
          <Overview {...{ profile, first, matches, bench, strength, targetLeft, notice, goProfile }} />
        )}
        {tab === 'New jobs' && (
          <NewJobs notice={notice} tracked={tracked} inAny={inAny} track={track} />
        )}
        {tab === 'Tracked jobs' && (
          <TrackedJobs tracked={tracked} track={track} untrack={untrack} goFind={() => setTab('New jobs')} notice={notice} />
        )}
        {tab === 'Coaching' && (
          <Coaching notice={notice} />
        )}
        {tab === 'Assignments' && (
          <Assignments profile={profile} done={assignDone} setDone={setAssignDone} notice={notice} goProfile={goProfile} saveProfile={saveProfile} />
        )}
        {tab === 'Profile' && (
          <ProfileEditor key={profile.candidateId || 'me'} profile={profile} saveProfile={saveProfile} saveMemory={saveMemory} notice={notice} titleFor={titleFor} />
        )}
        {tab === 'Settings' && <ComingSoon label={tab} />}
      </main>

      <KaiDock profile={profile} />
    </div>
  )
}

// ---------- top-right user chip (#8 name → profile, #9 position) ----------
function UserChip({ profile, first, titleFor, goProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  return (
    <div className="user-chip" ref={ref}>
      <button className="user-chip-main" onClick={goProfile} title="Open your profile">
        <div className="avatar sm" style={{ background: 'var(--grad)' }}>{(first[0] || 'Y').toUpperCase()}</div>
        <div className="user-chip-txt">
          <div className="user-chip-name">{profile.name || 'You'}</div>
          <div className="user-chip-sub">{profile.headline || titleFor(profile)}</div>
        </div>
      </button>
      <button className="user-chip-caret" onClick={() => setOpen((o) => !o)} aria-label="Account menu">▾</button>
      {open && (
        <div className="user-menu">
          <button onClick={() => { setOpen(false); goProfile() }}>✎ Edit profile</button>
          <button onClick={() => { setOpen(false); onLogout() }}>⎋ Log out</button>
        </div>
      )}
    </div>
  )
}

function Overview({ profile, first, matches, bench, strength, targetLeft, notice, goProfile }) {
  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Welcome back, {first} 👋</h1>
          <p>Kai has been working overnight. Here’s where your search stands.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="pill-mint pill">● Kai is active</span>
          <button className="btn btn-dark" onClick={() => notice('Mock interviews are coming soon ✨')}>Run a mock interview</button>
        </div>
      </div>

      <div className="cards">
        {[
          { ic: '◎', l: 'New matches', v: matches.length, d: 'Sample matches', cls: 'up' },
          { ic: '✦', l: 'Warm intros', v: DASH_INTROS.length, d: 'Sample intros', cls: 'up' },
          { ic: '◈', l: 'Interviews', v: 0, d: 'None scheduled', cls: 'flat' },
          { ic: '☺', l: 'Profile strength', v: `${strength}%`, d: strength >= 85 ? 'Strong' : 'Add more in Profile', cls: strength >= 85 ? 'up' : 'flat' },
        ].map((k) => (
          <div className="kpi" key={k.l}>
            <div className="top"><span>{k.l}</span><span className="ic">{k.ic}</span></div>
            <div className="v">{k.v}</div>
            <div className={`d ${k.cls}`}>{k.d}</div>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-h"><h3>Top matches for you</h3><button className="linklike" onClick={() => notice('Full match list is coming soon')}>View all →</button></div>
          <div className="card-b">
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
              Sample of how Kai will rank fits for a <b style={{ color: 'var(--ink)' }}>{titleForSafe(profile)}</b> — weighted around your skills and priorities.
            </p>
            {matches.map((m) => (
              <div className="match" key={m.co}>
                <div className="co" style={{ background: m.color }}>{m.co[0]}</div>
                <div className="meta"><div className="t">{m.title}</div><div className="s">{m.sub}</div></div>
                <div className="pct"><div className="n grad-text">{m.score}%</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>fit</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Warm introductions</h3></div>
          <div className="card-b">
            {DASH_INTROS.map((it) => (
              <div className="intro" key={it.who}>
                <div className="avatar" style={{ background: it.color }}>{it.who[0]}</div>
                <div className="b">
                  <div className="t">{it.who}</div>
                  <div className="s">{it.note}</div>
                  <div className="acts">
                    <button className="mini pri" onClick={() => notice(`We’ll let ${it.who.split(',')[0]} know you’re interested`)}>Accept intro</button>
                    <button className="mini sec" onClick={() => notice('Saved for later')}>Later</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-h"><h3>Your search pipeline</h3><button className="linklike" onClick={() => notice('Timeline view is coming soon')}>Timeline →</button></div>
        <div className="card-b">
          <div className="pipeline">
            {[
              { st: 'Matched', n: matches.length, c: '#2f6df6' }, { st: 'Intros', n: DASH_INTROS.length, c: '#0ea5e9' },
              { st: 'Interviewing', n: 0, c: '#1d4ed8' }, { st: 'Offer', n: 0, c: '#f59e0b' }, { st: 'Accepted', n: 0, c: '#14b8a6' },
            ].map((p) => (
              <div className="pipe" key={p.st}>
                <div className="st">{p.st}</div>
                <div className="n" style={{ color: p.c }}>{p.n}</div>
                <div className="bar" style={{ background: p.c, opacity: p.n ? 1 : 0.2 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-h"><h3>Salary benchmark</h3><button className="linklike" onClick={() => notice('Negotiation plans are coming soon')}>Negotiation plan →</button></div>
          <div className="card-b">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
              <span>P50 · ${bench.p50}k</span><span>P90 · ${bench.p90}k</span>
            </div>
            <div className="bench-row">
              <div className="bench-track">
                <div className="bench-fill" style={{ width: '66%' }} />
                <div className="bench-mark" style={{ left: `${targetLeft}%` }} />
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 14.5 }}>
              Kai recommends targeting <b className="grad-text">${bench.target}k</b> total comp.
              <span style={{ color: 'var(--muted)' }}> Based on your role and experience.</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Your profile</h3><button className="linklike" onClick={goProfile}>Edit →</button></div>
          <div className="card-b">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <div className="ring" style={{ '--v': strength, '--sz': '64px' }}><b style={{ fontSize: 15 }}>{strength}%</b></div>
              <div>
                <div style={{ fontWeight: 600 }}>{profile.headline || titleForSafe(profile)}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {profile.experience || '—'} · {profile.workMode || '—'} · {profile.availability || 'exploring'}
                </div>
              </div>
            </div>
            <div>
              {(profile.skills?.length ? profile.skills : ['Add your skills in Profile']).map((s) => (
                <span className="skill-tag" key={s}>{s}</span>
              ))}
            </div>
            {profile.priorities?.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>Prioritising: {profile.priorities.join(' · ')}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ---------- #12 New jobs ----------
function NewJobs({ notice, tracked, inAny, track }) {
  const savedIds = new Set(tracked.saved.map((j) => j.id))
  const appliedIds = new Set([...tracked.applied, ...tracked.inProcess].map((j) => j.id))
  return (
    <>
      <div className="dash-head">
        <div><h1>New jobs</h1><p>Fresh roles Kai surfaced for you — save the ones you like or apply straight away.</p></div>
        <span className="pill-mint pill">● {NEW_JOBS.length} new today</span>
      </div>
      <div className="job-grid">
        {NEW_JOBS.map((j) => {
          const isSaved = savedIds.has(j.id)
          const isApplied = appliedIds.has(j.id)
          return (
            <div className="job-card" key={j.id}>
              <div className="job-top">
                <div className="co" style={{ background: j.color }}>{j.co[0]}</div>
                <div className="job-fit"><span className="grad-text">{j.score}%</span><small>fit</small></div>
              </div>
              <div className="job-title">{j.title}</div>
              <div className="job-sub">{j.co} · {j.loc} · {j.comp}</div>
              <div className="job-tags">{j.tags.map((t) => <span className="job-tag" key={t}>{t}</span>)}</div>
              <div className="job-why"><span className="k">Kai:</span> {j.why}</div>
              <div className="job-foot">
                <span className="job-posted">{j.posted}</span>
                <div className="job-acts">
                  <button className={`mini sec ${isSaved ? 'is-on' : ''}`} disabled={isSaved} onClick={() => { track('saved', j); notice(`Saved ${j.title}`) }}>{isSaved ? '✓ Saved' : 'Save'}</button>
                  <button className={`mini pri ${isApplied ? 'is-on' : ''}`} disabled={isApplied} onClick={() => { track('applied', j); notice(`Applied to ${j.title} — tracking it for you`) }}>{isApplied ? '✓ Applied' : 'Apply'}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ---------- #12 Tracked jobs (Saved / Applied / In-process) ----------
function TrackedJobs({ tracked, track, untrack, goFind, notice }) {
  const COLS = [
    { key: 'saved', label: 'Saved', c: '#2f6df6', next: { col: 'applied', label: 'Apply →' } },
    { key: 'applied', label: 'Applied', c: '#0ea5e9', next: { col: 'inProcess', label: 'Move to in-process →' } },
    { key: 'inProcess', label: 'In-process', c: '#14b8a6', next: null },
  ]
  const total = tracked.saved.length + tracked.applied.length + tracked.inProcess.length
  return (
    <>
      <div className="dash-head">
        <div><h1>Tracked jobs</h1><p>Everything you’re watching, in one board. Move a role along as your search progresses.</p></div>
        <button className="btn btn-dark" onClick={goFind}>+ Find new jobs</button>
      </div>
      {total === 0 ? (
        <div className="card"><div className="card-b empty-b">
          <div style={{ fontSize: 34, marginBottom: 10 }}>≣</div>
          <h3 style={{ marginBottom: 8 }}>Nothing tracked yet</h3>
          <p style={{ color: 'var(--muted)', maxWidth: 380, margin: '0 auto 16px' }}>Save or apply to roles from <b>New jobs</b> and they’ll show up here across Saved, Applied and In-process.</p>
          <button className="btn btn-primary" onClick={goFind}>Browse new jobs →</button>
        </div></div>
      ) : (
        <div className="track-board">
          {COLS.map((col) => (
            <div className="track-col" key={col.key}>
              <div className="track-col-h" style={{ '--c': col.c }}>
                <span>{col.label}</span><span className="track-count">{tracked[col.key].length}</span>
              </div>
              <div className="track-col-b">
                {tracked[col.key].length === 0 && <div className="track-empty">Empty</div>}
                {tracked[col.key].map((j) => (
                  <div className="track-card" key={j.id}>
                    <div className="track-card-top">
                      <div className="co sm" style={{ background: j.color }}>{j.co[0]}</div>
                      <button className="track-x" onClick={() => { untrack(j.id); notice('Removed from tracking') }} aria-label="Remove">×</button>
                    </div>
                    <div className="track-title">{j.title}</div>
                    <div className="track-sub">{j.co} · {j.loc}</div>
                    {col.next && <button className="mini pri track-move" onClick={() => { track(col.next.col, j); notice(`Moved to ${col.next.col === 'applied' ? 'Applied' : 'In-process'}`) }}>{col.next.label}</button>}
                    {!col.next && <span className="track-done">● In process</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ---------- #12 Coaching (tabbed) ----------
function Coaching({ notice }) {
  const tabs = Object.keys(COACHING)
  const [active, setActive] = useState(tabs[0])
  const cards = COACHING[active] || []
  return (
    <>
      <div className="dash-head">
        <div><h1>Coaching</h1><p>Sharpen your search with Kai — pick a track and start a focused session.</p></div>
      </div>
      <div className="coach-tabs">
        {tabs.map((t) => (
          <button key={t} className={`coach-tab ${active === t ? 'on' : ''}`} onClick={() => setActive(t)}>{t}</button>
        ))}
      </div>
      <div className="coach-grid">
        {cards.map((c) => (
          <div className="coach-card" key={c.t}>
            <div className="coach-ic">{c.ic}</div>
            <div className="coach-t">{c.t}</div>
            <div className="coach-d">{c.d}</div>
            <div className="coach-foot">
              <span className="coach-mins">⏱ {c.mins} min</span>
              <button className="mini pri" onClick={() => notice(`Starting “${c.t}” — this coaching session is coming soon ✨`)}>Start →</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ---------- #10 Assignments (weak-skill interactive practice) ----------
const assignQuestions = (skill) => [
  { p: `In your own words, what is ${skill} and where does it fit in a real project?`, ph: 'A few sentences in your own words…' },
  { p: `Describe a concrete problem you solved (or would solve) using ${skill}. What was the outcome?`, ph: 'Situation → what you did → result…' },
  { p: `Name two core concepts in ${skill} and explain how they relate to each other.`, ph: 'Concept 1, concept 2, and the link between them…' },
  { p: `What is a common mistake people make with ${skill}, and how do you avoid it?`, ph: 'The pitfall and your prevention habit…' },
  { p: `Walk through, step by step, how you would approach a fresh task in ${skill}.`, ph: '1) … 2) … 3) …' },
  { p: `How do you test, validate, or measure the quality of your ${skill} work?`, ph: 'How you know it’s actually good…' },
  { p: `Explain a ${skill} concept to a complete beginner in 2–3 sentences.`, ph: 'Keep it simple and jargon-free…' },
  { p: `Give a practical example where ${skill} would be the wrong choice — what would you use instead?`, ph: 'When not to use it, and the better fit…' },
  { p: `What is one advanced ${skill} technique you want to master, and why?`, ph: 'The technique and what it would unlock…' },
  { p: `How will you keep improving at ${skill} over the next three months?`, ph: 'A concrete, realistic plan…' },
]

function StarRater({ value, onRate }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0
  return (
    <div className="star-rater" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={`star ${n <= shown ? 'on' : ''}`}
          onMouseEnter={() => setHover(n)} onClick={() => onRate(n)} aria-label={`Rate ${n} of 5`}>★</button>
      ))}
    </div>
  )
}

function Assignments({ profile, done, setDone, notice, goProfile, saveProfile }) {
  const skills = Array.isArray(profile.skills) ? profile.skills : []
  const ratings = profile.skillRatings || {}
  const rated = skills.filter((s) => ratings[s] >= 1)
  const weak = skills.filter((s) => ratings[s] >= 1 && ratings[s] <= WEAK_MAX)
  const [active, setActive] = useState(null)
  const [busy, setBusy] = useState('')

  const rate = async (skill, n) => {
    const next = { ...ratings, [skill]: n }
    setBusy(skill)
    try { await saveProfile({ skillRatings: next }) } catch { /* ignore */ }
    setBusy('')
  }

  if (active) {
    return <AssignmentRunner skill={active} onExit={() => setActive(null)}
      onComplete={async () => {
        const boosted = Math.min(5, Math.max((ratings[active] || WEAK_MAX) + 2, WEAK_MAX + 1))
        if (!done.includes(active)) setDone((d) => [...d, active])
        try { await saveProfile({ skillRatings: { ...ratings, [active]: boosted } }) } catch { /* ignore */ }
        notice(`✓ ${active} complete — proficiency raised to ${boosted}/5`)
        setActive(null)
      }} />
  }

  return (
    <>
      <div className="dash-head">
        <div><h1>Assignments</h1><p>Rate your skills, then practice the ones you score lowest. Finishing one raises that skill.</p></div>
        <span className="pill-mint pill">● {done.length} done</span>
      </div>

      {skills.length === 0 ? (
        <div className="card"><div className="card-b empty-b">
          <div style={{ fontSize: 34, marginBottom: 10 }}>✎</div>
          <h3 style={{ marginBottom: 8 }}>Add your skills first</h3>
          <p style={{ color: 'var(--muted)', maxWidth: 380, margin: '0 auto 16px' }}>Once you list your skills in your profile, you can rate each one and Kai will build practice for the ones worth strengthening.</p>
          <button className="btn btn-primary" onClick={goProfile}>Go to profile →</button>
        </div></div>
      ) : (
        <>
          {/* self-rating panel — the real source of "weak" skills */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="card-h"><h3>Your skill levels</h3><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{rated.length}/{skills.length} rated</span></div>
            <div className="card-b">
              <div className="rate-list">
                {skills.map((s) => (
                  <div className="rate-row" key={s}>
                    <span className="rate-skill">{s}{busy === s && <span className="rate-saving"> · saving…</span>}</span>
                    <StarRater value={ratings[s] || 0} onRate={(n) => rate(s, n)} />
                  </div>
                ))}
              </div>
              {rated.length < skills.length && <p className="rate-hint">Tip: rate every skill 1–5. Anything you score {WEAK_MAX} or below unlocks a targeted practice assignment below.</p>}
            </div>
          </div>

          {weak.length === 0 ? (
            <div className="card"><div className="card-b empty-b">
              <div style={{ fontSize: 34, marginBottom: 10 }}>{rated.length ? '🎉' : '⭐'}</div>
              <h3 style={{ marginBottom: 8 }}>{rated.length ? 'No weak spots right now' : 'Rate your skills to begin'}</h3>
              <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto' }}>{rated.length
                ? `You rated all your skills above ${WEAK_MAX}/5. Lower a rating (or add more skills) and any that need work will appear here.`
                : `Give each skill a 1–5 rating above. The ones you score ${WEAK_MAX} or below get an optional 10-question practice assignment.`}</p>
            </div></div>
          ) : (
            <>
              <p className="assign-note">Practice ready for {weak.length} of your {skills.length} skills — the ones you rated {WEAK_MAX}/5 or lower. Each is 10 short, open-ended questions (no multiple choice) and is completely optional.</p>
              <div className="assign-grid">
                {weak.map((s) => {
                  const r = ratings[s]
                  const isDone = done.includes(s)
                  return (
                    <div className={`assign-card ${isDone ? 'done' : ''}`} key={s}>
                      <div className="assign-top">
                        <div className="assign-skill">{s}</div>
                        <div className="assign-stars" title={`${r}/5`}>{'★★★★★'.slice(0, r)}<span className="dim">{'★★★★★'.slice(r)}</span></div>
                      </div>
                      <div className="assign-meta">{isDone ? 'Strengthened ✓' : '10 questions · theory + practical'}</div>
                      <button className={`btn ${isDone ? 'btn-ghost' : 'btn-primary'} btn-block`} onClick={() => setActive(s)}>
                        {isDone ? 'Revisit' : 'Start assignment →'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

function AssignmentRunner({ skill, onExit, onComplete }) {
  const qs = assignQuestions(skill)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState(() => qs.map(() => ''))
  const cur = answers[i].trim()
  const setAns = (v) => setAnswers((a) => { const n = a.slice(); n[i] = v; return n })
  const last = i === qs.length - 1
  const answeredCount = answers.filter((a) => a.trim()).length
  const pct = Math.round((answeredCount / qs.length) * 100)

  return (
    <>
      <div className="dash-head">
        <div><h1>{skill} · practice</h1><p>Answer in your own words. Your responses stay on your device — this is for your own reps.</p></div>
        <button className="btn btn-ghost" onClick={onExit}>← Back to assignments</button>
      </div>
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="assign-run-h">
          <span>Question {i + 1} of {qs.length}</span>
          <span>{answeredCount}/{qs.length} answered</span>
        </div>
        <div className="assign-bar"><div className="assign-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="card-b">
          <div className="assign-q">{qs[i].p}</div>
          <textarea className="input" rows={6} placeholder={qs[i].ph} value={answers[i]} onChange={(e) => setAns(e.target.value)} />
          <div className="assign-run-foot">
            <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI((x) => x - 1)}>← Previous</button>
            {!last && <button className="btn btn-primary" disabled={!cur} onClick={() => setI((x) => x + 1)}>Next →</button>}
            {last && <button className="btn btn-primary" disabled={answeredCount < qs.length} onClick={onComplete} title={answeredCount < qs.length ? 'Answer every question to finish' : 'Finish'}>Finish & strengthen ✓</button>}
          </div>
          {last && answeredCount < qs.length && <div className="assign-hint">Answer all {qs.length} questions to complete this assignment ({qs.length - answeredCount} left).</div>}
        </div>
      </div>
    </>
  )
}

function titleForSafe(profile) {
  const roleWord = ROLE_WORD[profile.role] || 'Specialist'
  let prefix = ''
  if (profile.seniority === 'Leadership') prefix = 'Lead '
  else if (profile.experience === '10+ years') prefix = 'Principal '
  else if (profile.experience === '6–9 years') prefix = 'Senior '
  const focus = profile.focus && profile.focus !== 'Either — show me both' ? profile.focus + ' ' : ''
  return `${prefix}${focus}${roleWord}`.replace(/\s+/g, ' ').trim()
}

function ProfileEditor({ profile, saveProfile, saveMemory, notice }) {
  const [form, setForm] = useState({
    name: profile.name || '',
    headline: profile.headline || '',
    location: profile.location || '',
    role: profile.role || '',
    workMode: profile.workMode || '',
    salaryTarget: profile.salaryTarget != null ? String(profile.salaryTarget) : '',
    availability: profile.availability || '',
    skills: (profile.skills || []).join(', '),
    priorities: (profile.priorities || []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    const patch = {
      name: form.name, headline: form.headline, location: form.location, role: form.role,
      workMode: form.workMode, salaryTarget: form.salaryTarget, availability: form.availability,
      skills: splitList(form.skills), priorities: splitList(form.priorities),
    }
    setSaving(true)
    try {
      await saveProfile(patch)
      try { await saveMemory('profile_snapshot', JSON.stringify({ ...profile, ...patch })) } catch { /* ignore */ }
      notice('✓ Profile saved')
    } catch (e) {
      notice(e.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="dash-head">
        <div><h1>Your profile</h1><p>Edit what Kai knows about you. Changes save to your account.</p></div>
      </div>
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="card-b">
          <div className="row2">
            <div className="field"><label>Full name</label><input className="input" value={form.name} onChange={set('name')} /></div>
            <div className="field"><label>Headline</label><input className="input" placeholder="e.g. Senior Product Designer" value={form.headline} onChange={set('headline')} /></div>
          </div>
          <div className="row2">
            <div className="field"><label>Primary role</label><input className="input" placeholder="e.g. Design" value={form.role} onChange={set('role')} /></div>
            <div className="field"><label>Location</label><input className="input" placeholder="City, Country" value={form.location} onChange={set('location')} /></div>
          </div>
          <div className="row2">
            <div className="field">
              <label>Work mode</label>
              <select className="input" value={form.workMode} onChange={set('workMode')}>
                <option value="">Select…</option>
                {WORK_MODES.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Availability</label>
              <select className="input" value={form.availability} onChange={set('availability')}>
                <option value="">Select…</option>
                {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Target total comp (in $k)</label><input className="input" placeholder="e.g. 160" value={form.salaryTarget} onChange={set('salaryTarget')} /></div>
          <div className="field"><label>Skills (comma separated)</label><input className="input" placeholder="React, TypeScript, Figma" value={form.skills} onChange={set('skills')} /></div>
          <div className="field"><label>Priorities (comma separated)</label><input className="input" placeholder="Growth, Compensation, Team & culture" value={form.priorities} onChange={set('priorities')} /></div>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 6 }} disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </div>
    </>
  )
}

function ComingSoon({ label }) {
  const COPY = {
    Settings: 'Account, notification and privacy controls — you decide exactly what’s shared.',
  }
  return (
    <>
      <div className="dash-head"><div><h1>{label}</h1><p>This section is on the way.</p></div></div>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-b" style={{ textAlign: 'center', padding: '40px 28px' }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>✨</div>
          <h3 style={{ marginBottom: 8 }}>{label} — coming soon</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>{COPY[label] || 'This part of Kairo is being built.'}</p>
        </div>
      </div>
    </>
  )
}
