import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

export default function VoiceComingSoon() {
  const nav = useNavigate()
  const [notified, setNotified] = useState(false)

  return (
    <div className="coming">
      <div className="coming-bg" />
      <div className="coming-inner">
        <div style={{ marginBottom: 30 }}><Logo light /></div>

        <div className="coming-orb">
          <span className="coming-mic">🎙️</span>
          <span className="wave w1" /><span className="wave w2" /><span className="wave w3" />
        </div>

        <span className="pill" style={{ background: 'rgba(255,255,255,0.1)', color: '#cfe0ff' }}>Coming soon</span>
        <h1 className="display coming-h">Voice calls with Kai are almost here.</h1>
        <p className="coming-sub">
          We’re teaching Kai to listen and speak in real time, so you can have a natural, hands-free
          conversation about your career. It’s not quite ready — but the chat is, and it’s every bit
          as smart and adaptive.
        </p>

        <div className="coming-cta">
          <button className="btn btn-primary btn-lg" onClick={() => nav('/screening')}>Chat with Kai instead →</button>
          <button className="btn btn-ghost btn-lg" onClick={() => nav('/connect')}>← Back</button>
        </div>

        {!notified ? (
          <form
            className="notify"
            onSubmit={(e) => { e.preventDefault(); setNotified(true) }}
          >
            <input className="input" type="email" placeholder="Email me when voice is live" required />
            <button className="btn btn-dark" type="submit">Notify me</button>
          </form>
        ) : (
          <p className="notify-done">✓ Thanks — we’ll let you know the moment voice goes live.</p>
        )}
      </div>
    </div>
  )
}
