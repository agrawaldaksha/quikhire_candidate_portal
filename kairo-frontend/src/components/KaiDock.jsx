import { useState, useRef, useEffect } from 'react'

// A small always-available Kai chat on the dashboard.
// Canned but context-aware replies keyed off what the candidate types.
function replyFor(text, profile) {
  const t = text.toLowerCase()
  if (t.includes('salary') || t.includes('comp') || t.includes('pay') || t.includes('negoti'))
    return `Based on your target and ${profile.experience || 'your'} experience, aim for the top third of the range. Want me to draft negotiation language for a specific offer?`
  if (t.includes('interview') || t.includes('prep') || t.includes('mock'))
    return 'I can run a mock interview tailored to any role in your matches — want to start one for the Loop role?'
  if (t.includes('match') || t.includes('job') || t.includes('role'))
    return `I’ve got 4 fresh matches ranked by fit. The Loop ${profile.focus || 'role'} is your strongest at 96%. Should I request the intro?`
  if (t.includes('intro'))
    return 'Two hiring managers already want to chat. Accept an intro and I’ll set up the call — usually within 2 days.'
  if (t.includes('hi') || t.includes('hey') || t.includes('hello'))
    return `Hey${profile.name ? ' ' + profile.name.split(' ')[0] : ''}! I’m watching the market for you around the clock. What can I help with?`
  return 'On it. I’ll keep scanning and only surface roles worth your time — ask me about matches, intros, interview prep or salary anytime.'
}

export default function KaiDock({ profile }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { who: 'ai', text: `Hey${profile.name ? ' ' + profile.name.split(' ')[0] : ''} — your dashboard’s live. I found 4 matches and 2 hiring managers want to talk. Ask me anything.` },
  ])
  const [text, setText] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, open])

  const send = () => {
    const v = text.trim()
    if (!v) return
    setMsgs((m) => [...m, { who: 'me', text: v }])
    setText('')
    setTimeout(() => setMsgs((m) => [...m, { who: 'ai', text: replyFor(v, profile) }]), 550)
  }

  return (
    <div className="kai-dock">
      {open && (
        <div className="kai-pop">
          <div className="h">
            <div className="avatar sm">K</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Kai</div>
              <div style={{ fontSize: 12, color: '#9dc0ff' }}>your agent · always on</div>
            </div>
            <button style={{ marginLeft: 'auto', color: '#fff', fontSize: 18 }} onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="body" ref={bodyRef}>
            {msgs.map((m, i) => <div key={i} className={`b ${m.who}`}>{m.text}</div>)}
          </div>
          <div className="foot">
            <input
              placeholder="Ask Kai…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="send-btn" style={{ width: 40, height: 40 }} onClick={send}>↑</button>
          </div>
        </div>
      )}
      <button className="kai-fab" onClick={() => setOpen((o) => !o)}>
        K{!open && <span className="badge">2</span>}
      </button>
    </div>
  )
}
