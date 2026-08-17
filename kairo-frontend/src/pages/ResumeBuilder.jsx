import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'

const ACCENTS = ['#2f6df6', '#14b8a6', '#7c3aed', '#0f172a', '#e11d48', '#ea580c']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MIDX = MONTHS.reduce((o, m, i) => ((o[m] = i), o), {})

const ISD = [
  ['🇮🇳', '+91', 'India'], ['🇺🇸', '+1', 'United States'], ['🇨🇦', '+1 ', 'Canada'], ['🇬🇧', '+44', 'United Kingdom'],
  ['🇦🇺', '+61', 'Australia'], ['🇦🇪', '+971', 'United Arab Emirates'], ['🇸🇬', '+65', 'Singapore'],
  ['🇩🇪', '+49', 'Germany'], ['🇫🇷', '+33', 'France'], ['🇯🇵', '+81', 'Japan'], ['🇨🇳', '+86', 'China'],
  ['🇳🇱', '+31', 'Netherlands'], ['🇮🇪', '+353', 'Ireland'], ['🇪🇸', '+34', 'Spain'], ['🇮🇹', '+39', 'Italy'],
  ['🇸🇪', '+46', 'Sweden'], ['🇨🇭', '+41', 'Switzerland'], ['🇳🇿', '+64', 'New Zealand'], ['🇵🇰', '+92', 'Pakistan'],
  ['🇧🇩', '+880', 'Bangladesh'], ['🇱🇰', '+94', 'Sri Lanka'], ['🇰🇷', '+82', 'South Korea'], ['🇲🇾', '+60', 'Malaysia'],
  ['🇮🇩', '+62', 'Indonesia'], ['🇵🇭', '+63', 'Philippines'], ['🇹🇭', '+66', 'Thailand'], ['🇸🇦', '+966', 'Saudi Arabia'],
  ['🇿🇦', '+27', 'South Africa'], ['🇧🇷', '+55', 'Brazil'],
]
const ISD_COUNTRY = ISD.reduce((o, [, code, country]) => ((o[code] = country), o), {})
const ISD_OPTS = ISD.map(([flag, code, country]) => ({ value: code, label: `${flag}  ${code.trim()}  ${country}` }))
const COUNTRIES = [...new Set(ISD.map((x) => x[2])), 'Other']
const COUNTRY_OPTS = COUNTRIES.map((c) => ({ value: c, label: c }))

const CITIES = {
  India: ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Noida', 'Jaipur'],
  'United States': ['New York', 'San Francisco', 'Los Angeles', 'Seattle', 'Austin', 'Boston', 'Chicago', 'Denver', 'Atlanta', 'Dallas'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Waterloo', 'Edmonton'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds', 'Glasgow', 'Cambridge'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
  France: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  Ireland: ['Dublin', 'Cork', 'Galway', 'Limerick'],
  Singapore: ['Singapore'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
}
const TITLES = ['Software Engineer', 'Senior Software Engineer', 'Frontend Engineer', 'Backend Engineer',
  'Full-Stack Engineer', 'Product Manager', 'Product Designer', 'UX Designer', 'UI Designer',
  'Data Scientist', 'Data Analyst', 'ML Engineer', 'DevOps Engineer', 'QA Engineer', 'Marketing Manager',
  'Business Analyst', 'Project Manager', 'Account Executive', 'Operations Manager', 'HR Manager']
const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'B.A.', 'B.Com', 'BBA', 'BCA', 'M.Tech', 'M.E.', 'M.Sc',
  'M.A.', 'M.Com', 'MBA', 'MCA', 'Ph.D', 'Diploma', 'High School', 'Associate Degree']

const SKILL_CATS = [
  { label: 'Technical', items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'HTML', 'CSS', 'Tailwind', 'GraphQL', 'REST APIs', 'Git', 'CI/CD', 'Machine Learning', 'Data Analysis', 'Excel', 'Tableau'] },
  { label: 'Soft skills', items: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking', 'Collaboration', 'Presentation', 'Negotiation', 'Mentoring'] },
  { label: 'Creative', items: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'UI Design', 'Wireframing', 'Illustration', 'Branding', 'Motion Design', 'Copywriting', 'Photography'] },
  { label: 'Product & Business', items: ['Product Management', 'Agile', 'Scrum', 'Roadmapping', 'Stakeholder Management', 'Analytics', 'A/B Testing', 'Go-to-Market', 'Market Research'] },
]

const toNum = (s) => {
  if (!s) return null
  if (s === 'Present') return Infinity
  const [m, y] = s.split(' ')
  if (MIDX[m] === undefined || !y) return null
  return parseInt(y, 10) * 12 + MIDX[m]
}
const badRange = (x) => { const a = toNum(x.start), b = toNum(x.end); return a != null && b != null && b !== Infinity && a > b }
const useOutside = (ref, cb) => {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

// ---------- themed strict dropdown ----------
function Select({ value, onChange, options, placeholder, style }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const cur = options.find((o) => o.value === value)
  return (
    <div className="rb-dd" ref={ref} style={style}>
      <button type="button" className="input rb-dd-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="rb-dd-val">{cur ? cur.label : (placeholder || 'Select…')}</span><span className="rb-dd-caret">▾</span>
      </button>
      {open && (
        <div className="rb-dd-pop">
          {options.map((o) => (
            <button type="button" key={o.value} className={`rb-dd-opt ${o.value === value ? 'on' : ''}`} onClick={() => { onChange(o.value); setOpen(false) }}>
              {o.label}{o.value === value && <span className="rb-dd-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- themed editable combobox (free text + suggestions) ----------
function Combo({ value, onChange, options, placeholder, invalid }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const filtered = options.filter((o) => o.toLowerCase().includes((value || '').toLowerCase())).slice(0, 40)
  return (
    <div className="rb-dd" ref={ref}>
      <input className={`input ${invalid ? 'input-err' : ''}`} placeholder={placeholder} value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} />
      {open && filtered.length > 0 && (
        <div className="rb-dd-pop">
          {filtered.map((o) => (
            <button type="button" key={o} className="rb-dd-opt" onMouseDown={(e) => { e.preventDefault(); onChange(o); setOpen(false) }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- categorized skill picker (click = add) ----------
function SkillPicker({ selected, onAdd }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const ql = q.trim().toLowerCase()
  const known = SKILL_CATS.some((c) => c.items.some((s) => s.toLowerCase() === ql))
  return (
    <div className="rb-dd" ref={ref}>
      <button type="button" className="input rb-dd-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="rb-dd-val" style={{ color: 'var(--indigo,#2f6df6)', fontWeight: 600 }}>+ Add a skill</span><span className="rb-dd-caret">▾</span>
      </button>
      {open && (
        <div className="rb-dd-pop rb-skill-pop">
          <input className="input rb-skill-search" placeholder="Search skills…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className="rb-skill-scroll">
            {SKILL_CATS.map((cat) => {
              const items = cat.items.filter((s) => s.toLowerCase().includes(ql))
              if (!items.length) return null
              return (
                <div className="rb-skill-cat" key={cat.label}>
                  <div className="rb-skill-cat-h">{cat.label}</div>
                  <div className="rb-skill-cat-items">
                    {items.map((s) => {
                      const on = selected.includes(s)
                      return <button type="button" key={s} className={`rb-skill-opt ${on ? 'on' : ''}`} disabled={on} onClick={() => onAdd(s)}>{on ? '✓ ' : ''}{s}</button>
                    })}
                  </div>
                </div>
              )
            })}
            {ql && !known && <button type="button" className="rb-skill-opt rb-skill-custom" onClick={() => { onAdd(q.trim()); setQ('') }}>+ Add “{q.trim()}”</button>}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- inline-editable preview node ----------
function Editable({ value, onCommit, tag = 'span', className, style, placeholder }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current && ref.current.textContent !== (value || '')) ref.current.textContent = value || '' }, [value])
  const Tag = tag
  return <Tag ref={ref} className={`rb-edit ${className || ''}`} style={style} contentEditable suppressContentEditableWarning
    data-ph={placeholder || ''} onBlur={(e) => onCommit(e.currentTarget.textContent)} spellCheck={false} />
}

// ---------- month/year picker ----------
function MonthYearPicker({ value, onChange, allowPresent, invalid }) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(() => { const m = /\d{4}/.exec(value || ''); return m ? parseInt(m[0], 10) : new Date().getFullYear() })
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  const pick = (m) => { onChange(`${m} ${year}`); setOpen(false) }
  return (
    <div className="my-wrap" ref={ref}>
      <button type="button" className={`input my-trigger ${value ? '' : 'ph'} ${invalid ? 'input-err' : ''}`} onClick={() => setOpen((o) => !o)}>
        {value || 'Select…'}<span className="my-caret">▾</span>
      </button>
      {open && (
        <div className="my-pop">
          <div className="my-yr">
            <button type="button" onClick={() => setYear((y) => y - 1)}>‹</button><span>{year}</span><button type="button" onClick={() => setYear((y) => y + 1)}>›</button>
          </div>
          <div className="my-grid">{MONTHS.map((m) => <button type="button" key={m} className={value === `${m} ${year}` ? 'on' : ''} onClick={() => pick(m)}>{m}</button>)}</div>
          <div className="my-foot">
            {allowPresent && <button type="button" className="my-present" onClick={() => { onChange('Present'); setOpen(false) }}>Present</button>}
            <button type="button" className="my-clear" onClick={() => { onChange(''); setOpen(false) }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- accordion section ----------
function Section({ id, title, open, onToggle, children }) {
  const isOpen = open === id
  return (
    <div className={`rb-acc ${isOpen ? 'open' : ''}`}>
      <button type="button" className="rb-acc-head" onClick={() => onToggle(id)}>
        <span>{title}</span><span className="rb-acc-caret">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && <div className="rb-acc-body">{children}</div>}
    </div>
  )
}

export default function ResumeBuilder() {
  const nav = useNavigate()
  const { profile, authed } = useApp()
  const secure = !authed // landing-page visitor (not logged in)
  const [accent, setAccent] = useState('#2f6df6')
  const [openSection, setOpenSection] = useState('personal')
  const [dismissed, setDismissed] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [gate, setGate] = useState(false)
  const [blackout, setBlackout] = useState(false)
  const lastTip = useRef('')
  const [data, setData] = useState({
    fullName: profile.name || '', title: profile.headline || '', email: profile.email || '',
    isd: '+91', phone: (profile.phone || '').replace(/^\+?\d{1,3}\s*/, ''),
    city: profile.location ? profile.location.split(',')[0].trim() : '', country: 'India', website: '',
    summary: '', experience: [{ role: '', company: '', start: '', end: '', bullets: '' }],
    education: [{ degree: '', school: '', start: '', end: '', gpa: '' }],
    skills: Array.isArray(profile.skills) ? profile.skills.slice(0, 8) : [],
  })

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }))
  const setField = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const updItem = (key, i, field, val) => setData((d) => { const a = d[key].slice(); a[i] = { ...a[i], [field]: val }; return { ...d, [key]: a } })
  const addItem = (key, blank) => () => setData((d) => ({ ...d, [key]: [...d[key], blank] }))
  const delItem = (key, i) => () => setData((d) => ({ ...d, [key]: d[key].filter((_, x) => x !== i) }))
  const updBullet = (i, j, text) => setData((d) => { const a = d.experience.slice(); const L = a[i].bullets.split('\n'); L[j] = text; a[i] = { ...a[i], bullets: L.join('\n') }; return { ...d, experience: a } })
  const addSkill = (s) => { const v = (s || '').trim(); if (v && !data.skills.includes(v)) setData((d) => ({ ...d, skills: [...d.skills, v] })) }
  const removeSkill = (s) => setData((d) => ({ ...d, skills: d.skills.filter((x) => x !== s) }))

  const period = (a, b) => [a, b].filter(Boolean).join(' – ')
  const cityOptions = CITIES[data.country] || []
  const contactBits = [data.email, (data.phone ? `${data.isd.trim()} ${data.phone}` : ''), [data.city, data.country].filter(Boolean).join(', '), data.website].filter(Boolean)

  const hasExp = data.experience.some((x) => x.role.trim() && x.company.trim())
  const hasEdu = data.education.some((x) => x.degree.trim() && x.school.trim() && x.gpa.trim())
  const anyBadDate = data.experience.some(badRange) || data.education.some(badRange)
  const missing = []
  if (!data.fullName.trim()) missing.push('Full name')
  if (!data.email.trim()) missing.push('Email')
  if (!data.phone.trim()) missing.push('Phone number')
  if (!hasExp) missing.push('1 work experience (role + company)')
  if (!hasEdu) missing.push('1 education entry (degree + school + GPA)')
  const canDownload = missing.length === 0 && !anyBadDate

  const ordered = []
  data.experience.forEach((x) => { if (badRange(x)) ordered.push({ level: 'warn', text: `Fix the dates in “${x.role || 'a role'}” — the end date is before the start date.` }) })
  data.education.forEach((x) => { if (badRange(x)) ordered.push({ level: 'warn', text: `Fix the dates in “${x.degree || 'an entry'}” — the end date is before the start date.` }) })
  if (!hasExp) ordered.push({ level: 'warn', text: 'Add at least one work experience — it’s the first thing recruiters read.' })
  if (!hasEdu) ordered.push({ level: 'warn', text: 'Add at least one education entry (with GPA) — to tell recruiters something about your background.' })
  data.experience.forEach((x) => {
    const n = x.bullets.split('\n').map((s) => s.trim()).filter(Boolean).length
    const label = x.role || x.company || 'a role'
    if (x.role && n === 0) ordered.push({ level: 'info', text: `Add 2–4 impact bullets to “${label}”.` })
    if (n > 8) ordered.push({ level: 'warn', text: `“${label}” has ${n} bullets — trim to 3–6 punchy, impact-focused lines.` })
  })
  if (!data.summary.trim()) ordered.push({ level: 'info', text: 'Add a 2–3 line professional summary up top — it frames everything below.' })
  if (data.skills.length > 0 && data.skills.length < 3) ordered.push({ level: 'info', text: 'List at least 3–5 key skills so Kai can match you well.' })
  const actionable = ordered.length
  const topTip = ordered[0] || { level: 'good', text: 'Looking sharp! Your resume covers all the essentials. 🎉' }
  useEffect(() => { if (topTip.text !== lastTip.current) { lastTip.current = topTip.text; setDismissed(false) } }, [topTip.text])

  // anti-screenshot blackout for not-logged-in visitors (best-effort)
  useEffect(() => {
    if (!secure) return
    const black = () => setBlackout(true)
    const clear = () => setTimeout(() => setBlackout(false), 250)
    const onVis = () => (document.hidden ? black() : clear())
    const onKey = (e) => { if (e.key === 'PrintScreen') { black(); try { navigator.clipboard.writeText('') } catch { /* ignore */ } setTimeout(() => setBlackout(false), 1500) } }
    window.addEventListener('blur', black); window.addEventListener('focus', clear)
    document.addEventListener('visibilitychange', onVis); document.addEventListener('keyup', onKey)
    return () => { window.removeEventListener('blur', black); window.removeEventListener('focus', clear); document.removeEventListener('visibilitychange', onVis); document.removeEventListener('keyup', onKey) }
  }, [secure])

  const ensureLib = () => new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve(window.html2pdf)
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js'
    s.onload = () => resolve(window.html2pdf); s.onerror = reject
    document.body.appendChild(s)
  })

  const download = async () => {
    if (secure) { setGate(true); return }        // #7: must sign up / log in
    if (!canDownload) { setDismissed(false); return }
    const el = document.querySelector('.rb-paper')
    setDownloading(true)
    try {
      const html2pdf = await ensureLib()
      await html2pdf().set({
        margin: [8, 8, 8, 8], filename: `${(data.fullName || 'resume').trim().replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save()
    } catch { window.print() } finally { setDownloading(false) }
  }

  const toggle = (id) => setOpenSection((cur) => (cur === id ? '' : id))

  return (
    <div className="rb-shell">
      <div className="rb-top">
        <div className="rb-top-l">
          <button className="btn btn-ghost" onClick={() => nav(-1)}>← Back</button>
          <div className="rb-brand"><Logo /></div>
          <span className="rb-title">Resume Builder</span>
        </div>
        <div className="rb-top-r">
          <div className="rb-accents">
            <span className="rb-accents-lbl">Accent</span>
            {ACCENTS.map((c) => <button key={c} className={`rb-swatch ${accent === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setAccent(c)} aria-label={`accent ${c}`} />)}
          </div>
          <button className={`btn btn-primary ${!secure && !canDownload ? 'rb-dl-locked' : ''}`} onClick={download} disabled={downloading}
            title={secure ? 'Sign up to download' : (canDownload ? 'Download as PDF' : 'Complete the required fields first')}>
            {downloading ? 'Generating…' : (secure ? '⤓ Download PDF' : (canDownload ? '⤓ Download PDF' : '🔒 Download PDF'))}
          </button>
        </div>
      </div>

      <div className="rb-body">
        {/* ---------- FORM (accordion) ---------- */}
        <div className="rb-form">
          <Section id="personal" title="Personal details" open={openSection} onToggle={toggle}>
            <div className="row2">
              <div className="field"><label>Full name *</label><input className="input" value={data.fullName} onChange={set('fullName')} /></div>
              <div className="field"><label>Professional title</label><Combo value={data.title} onChange={(v) => setField('title', v)} options={TITLES} placeholder="Pick or type…" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Email *</label><input className="input" type="email" value={data.email} onChange={set('email')} /></div>
              <div className="field">
                <label>Phone *</label>
                <div className="rb-phone">
                  <Select value={data.isd} onChange={(code) => setData((d) => ({ ...d, isd: code, country: ISD_COUNTRY[code] || d.country }))} options={ISD_OPTS} style={{ width: 132, flex: '0 0 auto' }} />
                  <input className="input" type="tel" placeholder="98765 43210" value={data.phone} onChange={set('phone')} />
                </div>
              </div>
            </div>
            <div className="row2">
              <div className="field"><label>Country</label><Select value={data.country} onChange={(v) => setField('country', v)} options={COUNTRY_OPTS} /></div>
              <div className="field"><label>City</label><Combo value={data.city} onChange={(v) => setField('city', v)} options={cityOptions} placeholder={cityOptions.length ? `e.g. ${cityOptions[0]}` : 'City'} /></div>
            </div>
            <div className="field"><label>Website / LinkedIn</label><input className="input" placeholder="linkedin.com/in/…" value={data.website} onChange={set('website')} /></div>
          </Section>

          <Section id="summary" title="Professional summary" open={openSection} onToggle={toggle}>
            <div className="field"><textarea className="input" rows={4} placeholder="2–3 lines about who you are and what you do best." value={data.summary} onChange={set('summary')} /></div>
          </Section>

          <Section id="experience" title="Work experience *" open={openSection} onToggle={toggle}>
            {data.experience.map((x, i) => {
              const bad = badRange(x)
              return (
                <div className="rb-card" key={i}>
                  <div className="row2">
                    <div className="field"><label>Role</label><input className="input" value={x.role} onChange={(e) => updItem('experience', i, 'role', e.target.value)} /></div>
                    <div className="field"><label>Company</label><input className="input" value={x.company} onChange={(e) => updItem('experience', i, 'company', e.target.value)} /></div>
                  </div>
                  <div className="row2">
                    <div className="field"><label>Start</label><MonthYearPicker value={x.start} onChange={(v) => updItem('experience', i, 'start', v)} invalid={bad} /></div>
                    <div className="field"><label>End</label><MonthYearPicker value={x.end} onChange={(v) => updItem('experience', i, 'end', v)} allowPresent invalid={bad} /></div>
                  </div>
                  {bad && <div className="rb-date-err">⚠ End date can’t be before the start date.</div>}
                  <div className="field"><label>Highlights (one per line)</label><textarea className="input" rows={3} placeholder="Led…&#10;Shipped…&#10;Improved…" value={x.bullets} onChange={(e) => updItem('experience', i, 'bullets', e.target.value)} /></div>
                  {data.experience.length > 1 && <button className="linklike rb-del" onClick={delItem('experience', i)}>Remove</button>}
                </div>
              )
            })}
            <button className="linklike" onClick={addItem('experience', { role: '', company: '', start: '', end: '', bullets: '' })}>+ Add experience</button>
          </Section>

          <Section id="education" title="Education *" open={openSection} onToggle={toggle}>
            {data.education.map((x, i) => {
              const bad = badRange(x)
              return (
                <div className="rb-card" key={i}>
                  <div className="row2">
                    <div className="field"><label>Degree</label><Combo value={x.degree} onChange={(v) => updItem('education', i, 'degree', v)} options={DEGREES} placeholder="Pick or type…" /></div>
                    <div className="field"><label>School / University</label><input className="input" value={x.school} onChange={(e) => updItem('education', i, 'school', e.target.value)} /></div>
                  </div>
                  <div className="row2">
                    <div className="field"><label>Start</label><MonthYearPicker value={x.start} onChange={(v) => updItem('education', i, 'start', v)} invalid={bad} /></div>
                    <div className="field"><label>End</label><MonthYearPicker value={x.end} onChange={(v) => updItem('education', i, 'end', v)} allowPresent invalid={bad} /></div>
                  </div>
                  {bad && <div className="rb-date-err">⚠ End date can’t be before the start date.</div>}
                  <div className="field" style={{ maxWidth: 220 }}><label>GPA *</label><input className="input" placeholder="e.g. 8.6 / 10 or 3.8 / 4" value={x.gpa} onChange={(e) => updItem('education', i, 'gpa', e.target.value)} /></div>
                  {data.education.length > 1 && <button className="linklike rb-del" onClick={delItem('education', i)}>Remove</button>}
                </div>
              )
            })}
            <button className="linklike" onClick={addItem('education', { degree: '', school: '', start: '', end: '', gpa: '' })}>+ Add education</button>
          </Section>

          <Section id="skills" title="Skills" open={openSection} onToggle={toggle}>
            <SkillPicker selected={data.skills} onAdd={addSkill} />
            <div className="rb-chips">{data.skills.map((s) => <span className="rb-chip-edit" key={s}>{s}<button onClick={() => removeSkill(s)} aria-label="remove">×</button></span>)}</div>
          </Section>

          <p className="rb-hint">Fields marked * are required to download. Tip: you can also edit text directly in the preview →</p>
        </div>

        {/* ---------- EDITABLE PREVIEW ---------- */}
        <div className="rb-preview-wrap">
          <div className="rb-paper" style={{ '--rb-accent': accent }}>
            <div className="rb-p-head">
              <Editable tag="div" className="rb-p-name" value={data.fullName} onCommit={(v) => setField('fullName', v)} placeholder="Your Name" />
              <Editable tag="div" className="rb-p-title" value={data.title} onCommit={(v) => setField('title', v)} placeholder="Professional title" />
              {contactBits.length > 0 && <div className="rb-p-contact">{contactBits.join('  ·  ')}</div>}
            </div>

            {data.summary && (
              <section className="rb-p-sec"><div className="rb-p-sec-h">Summary</div>
                <Editable tag="p" className="rb-p-text" value={data.summary} onCommit={(v) => setField('summary', v)} placeholder="Summary…" />
              </section>
            )}

            {data.experience.some((x) => x.role || x.company || x.bullets) && (
              <section className="rb-p-sec">
                <div className="rb-p-sec-h">Experience</div>
                {data.experience.map((x, i) => (
                  (x.role || x.company || x.bullets) ? (
                    <div className="rb-p-item" key={i}>
                      <div className="rb-p-item-top"><span className="rb-p-role">{x.role}{x.company ? `, ${x.company}` : ''}</span>{period(x.start, x.end) && <span className="rb-p-period">{period(x.start, x.end)}</span>}</div>
                      {x.bullets && (
                        <ul className="rb-p-bullets">
                          {x.bullets.split('\n').map((b, j) => ({ b, j })).filter((o) => o.b.trim()).map(({ b, j }) => (
                            <li key={j}><Editable tag="span" value={b} onCommit={(v) => updBullet(i, j, v)} placeholder="Highlight…" /></li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null
                ))}
              </section>
            )}

            {data.education.some((x) => x.degree || x.school) && (
              <section className="rb-p-sec">
                <div className="rb-p-sec-h">Education</div>
                {data.education.filter((x) => x.degree || x.school).map((x, i) => (
                  <div className="rb-p-item" key={i}>
                    <div className="rb-p-item-top"><span className="rb-p-role">{x.degree}{x.school ? `, ${x.school}` : ''}</span>{period(x.start, x.end) && <span className="rb-p-period">{period(x.start, x.end)}</span>}</div>
                    {x.gpa && <div className="rb-p-text" style={{ fontSize: 12.5 }}>GPA: {x.gpa}</div>}
                  </div>
                ))}
              </section>
            )}

            {data.skills.length > 0 && <section className="rb-p-sec"><div className="rb-p-sec-h">Skills</div><div className="rb-p-skills">{data.skills.map((s) => <span className="rb-p-chip" key={s}>{s}</span>)}</div></section>}
          </div>
        </div>
      </div>

      {/* ---------- Kai suggestions ---------- */}
      <div className="rb-kai">
        {!dismissed && (
          <div className="rb-kai-bubble" key={topTip.text}>
            <div className="avatar sm">K</div>
            <div className="rb-bubble-body">
              <div className="rb-bubble-txt">{topTip.text}</div>
              {actionable > 0 && <div className="rb-bubble-meta">{actionable} suggestion{actionable > 1 ? 's' : ''} left</div>}
            </div>
            <button className="rb-kai-x" onClick={() => setDismissed(true)}>×</button>
          </div>
        )}
        <button className={`rb-kai-fab ${topTip.level === 'warn' ? 'pulse' : ''}`} onClick={() => setDismissed((d) => !d)}>K{actionable > 0 && <span className="rb-kai-badge">{actionable}</span>}</button>
      </div>

      {/* ---------- #7 sign-up gate ---------- */}
      {gate && (
        <div className="rb-gate" onClick={() => setGate(false)}>
          <div className="rb-gate-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 42 }}>🔒</div>
            <h2 style={{ margin: '8px 0' }}>Sign up to download</h2>
            <p className="lead" style={{ marginBottom: 18 }}>Create a free Kairo account (or log in) to download your resume as a PDF.</p>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => nav('/login')}>Log in / Sign up →</button>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => setGate(false)}>Keep editing</button>
          </div>
        </div>
      )}

      {/* ---------- #7 anti-screenshot blackout ---------- */}
      {secure && blackout && (
        <div className="rb-blackout"><div>🔒<div style={{ marginTop: 8 }}>Preview hidden — sign up to unlock your resume.</div></div></div>
      )}
    </div>
  )
}
