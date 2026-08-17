import { useEffect, useRef, useState } from 'react'

// A looping, self-typing demo of a Kai conversation for the hero.
const SCRIPT = [
  { who: 'ai', text: 'Hey — I’m Kai 👋 What kind of role are you hunting for?' },
  { who: 'me', text: 'Senior product design, ideally remote.' },
  { who: 'ai', text: 'Nice. What matters more right now — scope, comp, or team?' },
  { who: 'me', text: 'Scope. I want to own a product area.' },
  { who: 'ai', text: 'Got it. I found 3 roles where you’d own a full surface. Want the intros?' },
]

export default function HeroChat() {
  const [count, setCount] = useState(0)
  const [typing, setTyping] = useState(true)
  const boxRef = useRef(null)

  useEffect(() => {
    let alive = true
    const run = async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms))
      while (alive) {
        for (let i = 0; i < SCRIPT.length; i++) {
          if (!alive) return
          setTyping(true)
          await wait(SCRIPT[i].who === 'ai' ? 1100 : 650)
          if (!alive) return
          setTyping(false)
          setCount(i + 1)
          await wait(1200)
        }
        await wait(1800)
        if (!alive) return
        setCount(0)
      }
    }
    run()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [count, typing])

  return (
    <div className="hero-visual">
      <div className="float-card fc1">
        <div style={{ fontWeight: 600 }}>New match</div>
        <div style={{ color: 'var(--muted)' }}>Lead Designer · Remote</div>
        <div className="score">96% fit</div>
      </div>
      <div className="float-card fc2">
        <div style={{ fontWeight: 600 }}>Warm intro sent</div>
        <div style={{ color: 'var(--muted)' }}>Straight to the hiring manager</div>
      </div>

      <div className="chat-card">
        <div className="chat-head">
          <div className="avatar online" style={{ position: 'relative' }}>K</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Kai</div>
            <div style={{ fontSize: 12.5, color: 'var(--mint)' }}>online · your AI career agent</div>
          </div>
        </div>
        <div className="chat-body" ref={boxRef} style={{ maxHeight: 340, overflow: 'hidden' }}>
          {SCRIPT.slice(0, count).map((m, i) => (
            <div key={i} className={`bubble ${m.who}`}>{m.text}</div>
          ))}
          {typing && (
            <div className="bubble ai typing" style={{ alignSelf: 'flex-start' }}>
              <span /><span /><span />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
