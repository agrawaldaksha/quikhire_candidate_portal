import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'
import { nextStep, ack, benchmark } from '../screening/engine.js'

const TOTAL = 10

export default function Screening() {
  const nav = useNavigate()
  const { profile, completeScreening } = useApp()
  const [msgs, setMsgs] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(null)
  const [typing, setTyping] = useState(false)
  const [multiSel, setMultiSel] = useState([])
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('chat') // chat | building
  const [buildMsg, setBuildMsg] = useState('')
  const scrollRef = useRef(null)
  const started = useRef(false)
  const qaRef = useRef([]) // running transcript for the "email summary"

  const push = (m) => setMsgs((prev) => [...prev, m])

  // Kick off the conversation once.
  useEffect(() => {
    if (started.current) return
    started.current = true
    setTyping(true)
    // NB: intentionally no clearTimeout cleanup — under React StrictMode the
    // mount effect is invoked twice; clearing here would cancel the only
    // kickoff and leave the chat stuck on the typing indicator.
    setTimeout(() => {
      const q = nextStep({}, profile.name)
      setTyping(false)
      push({ who: 'ai', text: q.text })
      setCurrentQ(q)
      if (q.key === 'skills' && profile.skills?.length) {
        setMultiSel(profile.skills.filter((s) => q.options.includes(s)))
      }
    }, 900)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll to newest.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, typing, currentQ])

  const finish = (finalAnswers) => {
    setPhase('building')
    const merged = {
      ...profile,
      role: finalAnswers.role,
      focus: finalAnswers.focus,
      experience: finalAnswers.experience,
      seniority: finalAnswers.seniority,
      workMode: finalAnswers.workMode,
      salaryTarget: finalAnswers.salaryTarget,
      priorities: finalAnswers.priorities || [],
      skills: finalAnswers.skills || profile.skills || [],
      availability: finalAnswers.availability,
    }
    // Persist profile + transcript and send the summary email (runs during the animation).
    const saving = completeScreening(merged, qaRef.current)
    const seq = [
      'Analysing everything you told me…',
      'Scanning 12M+ live roles for genuine fits…',
      'Saving your profile & summary…',
      'Building your personal dashboard…',
    ]
    let i = 0
    setBuildMsg(seq[0])
    const iv = setInterval(() => {
      i += 1
      if (i < seq.length) setBuildMsg(seq[i])
    }, 900)
    const minWait = new Promise((r) => setTimeout(r, 3600))
    Promise.allSettled([saving, minWait]).then(() => {
      clearInterval(iv)
      nav('/dashboard')
    })
  }

  const answer = (value) => {
    if (!currentQ) return
    const display = Array.isArray(value) ? value.join(', ') : value
    push({ who: 'me', text: display })
    qaRef.current.push({ q: currentQ.text, a: display })

    const newAnswers = { ...answers, [currentQ.key]: value }
    setAnswers(newAnswers)
    setCurrentQ(null)
    setMultiSel([])
    setText('')
    setTyping(true)

    // Kai acknowledges, then asks the next (computed) question.
    const ackText = ack(currentQ.key, value, newAnswers)
    setTimeout(() => {
      push({ who: 'ai', text: ackText })
      setTimeout(() => {
        const q = nextStep(newAnswers, profile.name)
        setTyping(false)
        if (!q) {
          finish(newAnswers)
          return
        }
        if (q.insight) push({ who: 'ai', insight: q.insight })
        push({ who: 'ai', text: q.text })
        setCurrentQ(q)
        if (q.key === 'skills' && profile.skills?.length) {
          setMultiSel(profile.skills.filter((s) => q.options.includes(s)))
        }
      }, 750)
    }, 650)
  }

  const answered = Object.keys(answers).length
  const pct = phase === 'building' ? 100 : Math.min(Math.round((answered / TOTAL) * 100), 96)

  return (
    <div className="screen">
      <div className="screen-top">
        <div className="container screen-top-inner">
          <Logo />
          <div className="screen-progress"><i style={{ width: `${pct}%` }} /></div>
          <span className="pill-line pill">Step {Math.min(answered + 1, TOTAL)} of {TOTAL}</span>
        </div>
      </div>

      <div className="screen-scroll" ref={scrollRef}>
        <div className="chat-wrap">
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
            Kai will ask a few adaptive questions — every answer shapes the next. Takes about 3 minutes.
          </div>
          {msgs.map((m, i) =>
            m.insight ? (
              <InsightCard key={i} insight={m.insight} />
            ) : (
              <div className={`msg ${m.who}`} key={i}>
                {m.who === 'ai' && <div className="avatar sm">K</div>}
                <div className="b">{m.text}</div>
              </div>
            ),
          )}
          {typing && (
            <div className="msg ai">
              <div className="avatar sm">K</div>
              <div className="b typing" style={{ padding: '14px 16px' }}><span /><span /><span /></div>
            </div>
          )}
        </div>
      </div>

      {/* Composer adapts to the current question type */}
      {currentQ && !typing && (
        <div className="composer">
          <div className="composer-inner">
            {currentQ.type === 'chips' && (
              <div className="replies">
                {currentQ.options.map((o) => (
                  <button className="reply-chip" key={o} onClick={() => answer(o)}>{o}</button>
                ))}
              </div>
            )}

            {currentQ.type === 'multi' && (
              <>
                <div className="multi-note">Select all that apply, then continue.</div>
                <div className="replies">
                  {currentQ.options.map((o) => {
                    const on = multiSel.includes(o)
                    return (
                      <button
                        key={o}
                        className={`reply-chip ${on ? 'on' : ''}`}
                        onClick={() => setMultiSel((s) => (on ? s.filter((x) => x !== o) : [...s, o]))}
                      >
                        {on ? '✓ ' : ''}{o}
                      </button>
                    )
                  })}
                </div>
                <div className="composer-bar">
                  <button className="btn btn-primary" style={{ marginLeft: 'auto' }} disabled={!multiSel.length} onClick={() => answer(multiSel)}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {currentQ.type === 'text' && (
              <>
                {currentQ.hint && <div className="multi-note">{currentQ.hint}</div>}
                <div className="composer-bar">
                  <textarea
                    rows={1}
                    placeholder={currentQ.placeholder || 'Type your answer…'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (text.trim()) answer(text.trim())
                      }
                    }}
                  />
                  <button className="send-btn" disabled={!text.trim()} onClick={() => text.trim() && answer(text.trim())}>↑</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {phase === 'building' && (
        <div className="building">
          <div>
            <div className="spin" />
            <h2>Kai is building your dashboard</h2>
            <p>{buildMsg}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function InsightCard({ insight }) {
  if (insight.kind === 'salary') {
    const { p50, target, p90 } = insight
    // position target on the P50→P90 track
    const span = Math.max(p90 - p50, 1)
    const left = Math.min(Math.max(((target - p50) / span) * 100, 4), 96)
    return (
      <div className="insight">
        <div className="h">◆ Salary benchmark · built for you</div>
        <div className="c">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
            <span>P50 · ${p50}k</span><span>P90 · ${p90}k</span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: 'var(--line-2)', position: 'relative' }}>
            <div style={{ position: 'absolute', height: '100%', width: '66%', borderRadius: 999, background: 'var(--grad)' }} />
            <div style={{ position: 'absolute', left: `${left}%`, top: -5, width: 3, height: 20, background: 'var(--ink)', borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 14 }}>
            Aim for <b className="grad-text">${target}k</b> total comp — top third of the market for your level.
            <span style={{ color: 'var(--muted)' }}> (USD · comparable remote roles)</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}
