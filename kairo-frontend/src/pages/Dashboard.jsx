import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'
import KaiDock from '../components/KaiDock.jsx'
import { benchmark } from '../screening/engine.js'
import { DASH_INTROS } from '../data/mock.js'

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

export default function Dashboard() {
  const { profile, screeningEmailed, hydrateFromServer, saveProfile, saveMemory, resetAll } = useApp()
  const nav = useNavigate()
  const [toast, setToast] = useState(true)
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('Dashboard')
  const noteTimer = useRef()

  // Pull the latest profile from the backend on mount (so a refresh shows real data).
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
  const strength = completeness(profile)
  const first = (profile.name || 'there').split(' ')[0]
  const span = Math.max(bench.p90 - bench.p50, 1)
  const targetLeft = Math.min(Math.max(((bench.target - bench.p50) / span) * 100, 4), 96)

  const NAV = [
    ['Dashboard', '▦'], ['Matches', '◎'], ['Introductions', '✦'], ['Applications', '≣'],
    ['Mock interviews', '◈'], ['Salary', '◆'], ['Profile', '☺'], ['Settings', '⚙'],
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
        <div className="side-foot">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar sm" style={{ background: 'var(--grad)' }}>{first[0]?.toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name || 'You'}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{profile.headline || titleFor(profile)}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 12, padding: '9px' }} onClick={() => { resetAll(); nav('/') }}>Log out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {tab === 'Dashboard' && (
          <Overview {...{ profile, first, matches, bench, strength, targetLeft, notice, goProfile: () => setTab('Profile') }} />
        )}
        {tab === 'Profile' && (
          <ProfileEditor key={profile.candidateId || 'me'} profile={profile} saveProfile={saveProfile} saveMemory={saveMemory} notice={notice} titleFor={titleFor} />
        )}
        {!['Dashboard', 'Profile'].includes(tab) && <ComingSoon label={tab} />}
      </main>

      <KaiDock profile={profile} />
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
    Matches: 'The full, filterable match list — every role Kai surfaces, with fit scores and one-tap apply.',
    Introductions: 'Warm introductions to hiring managers in QuikHire’s network, tracked end to end.',
    Applications: 'Every role you’re in process for, with stage, next steps and Kai’s prep notes.',
    'Mock interviews': 'Practice interviews with Kai and instant, tailored feedback for the exact role.',
    Salary: 'Live salary benchmarks and a step-by-step negotiation plan built around your target.',
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
