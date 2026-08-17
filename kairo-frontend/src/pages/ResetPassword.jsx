import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import Logo from '../components/Logo.jsx'

const errStyle = {
  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)',
  color: '#b91c1c', borderRadius: 10, padding: '10px 12px', fontSize: 13.5, margin: '4px 0 14px',
}
const lblRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

export default function ResetPassword() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('The two passwords don’t match.')
    setBusy(true); setError('')
    try {
      await api.resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.')
    } finally { setBusy(false) }
  }

  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo light />
        <div>
          <h2>Set a new password.</h2>
          <p>Choose something strong and memorable — then Kai will be waiting right where you left off.</p>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-box">
          {!token ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 46, marginBottom: 10 }}>🔗</div>
              <h1>Invalid reset link</h1>
              <p className="lead">This link is missing its token. Please request a new reset link from the login page.</p>
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={() => nav('/login')}>Go to login</button>
            </div>
          ) : done ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <h1>Password updated</h1>
              <p className="lead">Your password has been changed. You can now log in with your new password.</p>
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={() => nav('/login')}>Log in →</button>
            </div>
          ) : (
            <>
              <h1>Choose a new password</h1>
              <p className="lead">Enter and confirm your new password below.</p>
              {error && <div style={errStyle}>{error}</div>}
              <form onSubmit={submit}>
                <div className="field">
                  <label style={lblRow}><span>New password</span><button type="button" className="linklike" onClick={() => setShowPw((v) => !v)}>{showPw ? 'Hide' : 'View'}</button></label>
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="field"><label>Confirm new password</label><input className="input" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
                <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
