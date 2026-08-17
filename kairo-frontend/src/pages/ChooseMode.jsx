import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'

// Shown right after signup/login, before the Kai conversation begins.
// Candidate chooses how they want to be screened: Chat (live) or Voice (coming soon).
export default function ChooseMode() {
  const nav = useNavigate()
  const { profile } = useApp()
  const first = (profile.name || '').split(' ')[0]

  return (
    <div className="connect">
      <div className="connect-inner">
        <div style={{ marginBottom: 28 }}><Logo /></div>

        <span className="eyebrow">One quick step before your dashboard</span>
        <h1 className="display connect-h">
          How would you like to talk to <span className="grad-text">Kai</span>{first ? `, ${first}` : ''}?
        </h1>
        <p className="connect-sub">
          Kai will ask a few adaptive questions to understand what you want next, then build your
          dashboard around it. Pick whatever feels natural.
        </p>

        <div className="mode-grid">
          {/* Chat — available */}
          <button className="mode-card" onClick={() => nav('/screening')}>
            <div className="mode-top">
              <span className="mode-ic">💬</span>
              <span className="pill-mint pill">Available now</span>
            </div>
            <h3>Chat with Kai</h3>
            <p>Type at your own pace. Great if you like to think before you answer. Takes about 3 minutes.</p>
            <span className="mode-cta">Start chatting →</span>
          </button>

          {/* Voice — coming soon */}
          <button className="mode-card voice" onClick={() => nav('/voice')}>
            <div className="mode-top">
              <span className="mode-ic">🎙️</span>
              <span className="pill pill-line" style={{ color: 'var(--indigo)', borderColor: 'var(--line-2)' }}>Coming soon</span>
            </div>
            <h3>Voice call with Kai</h3>
            <p>Talk it through, hands-free — like a real phone screen with a recruiter who never rushes you.</p>
            <span className="mode-cta">Try voice →</span>
          </button>
        </div>

        <p className="connect-foot">You can switch anytime · your answers stay private until you choose to share</p>
      </div>
    </div>
  )
}
