import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../lib/api.js'
import Logo from '../components/Logo.jsx'

const errStyle = {
  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)',
  color: '#b91c1c', borderRadius: 10, padding: '10px 12px', fontSize: 13.5, margin: '4px 0 14px',
}
const okStyle = {
  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)',
  color: '#047857', borderRadius: 10, padding: '8px 12px', fontSize: 13, margin: '4px 0 14px',
}
const lblRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const otpInput = { letterSpacing: 8, fontSize: 20, textAlign: 'center' }

export default function Auth() {
  const nav = useNavigate()
  const { signup, login, patchProfile } = useApp()
  const [step, setStep] = useState('choose') // choose | resume | details | otp | login | forgot
  const [method, setMethod] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [drag, setDrag] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', headline: '', location: '', password: '', confirm: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [showLoginPw, setShowLoginPw] = useState(false)
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [parsedSkills, setParsedSkills] = useState([])
  const fileRef = useRef(null)

  // dual OTP state (email real + phone simulated)
  const [emailCode, setEmailCode] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [otpPhase, setOtpPhase] = useState('enter') // enter | verified
  const [resent, setResent] = useState(false)

  // forgot-password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const parsedLines = ['Contact details', 'Work experience · 3 roles', 'Skills · 12 detected', 'Education']

  const runParse = async (file) => {
    setFileName(file?.name || 'resume.pdf')
    setParsing(true); setParsed(false); setError('')
    try {
      const data = await api.parseResume(file)
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        headline: data.headline || prev.headline,
        location: data.location || prev.location,
      }))
      setParsedSkills(Array.isArray(data.skills) ? data.skills : [])
      setParsing(false); setParsed(true)
    } catch (err) {
      setParsedSkills([])
      setParsing(false); setParsed(true)
      setError((err.message || 'Could not read that file.') + ' Please review and fill in the details below.')
    }
  }
  const onFile = (e) => { const file = e.target.files?.[0]; if (file) runParse(file) }
  const onDrop = (e) => { e.preventDefault(); setDrag(false); const file = e.dataTransfer.files?.[0]; if (file) runParse(file) }

  const emailOk = /\S+@\S+\.\S+/.test(form.email.trim())
  const phoneOk = form.phone.replace(/\D/g, '').length >= 7
  const pwMismatch = form.confirm.length > 0 && form.password !== form.confirm
  const canGetOtp = form.name.trim() && emailOk && phoneOk && form.password.length >= 6 && form.password === form.confirm

  const buildSignupPayload = () => ({
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password,
    name: form.name.trim(),
    source: method,
    headline: form.headline || undefined,
    ...(form.location ? { preferredLocations: [form.location] } : {}),
    ...(method === 'resume' && parsedSkills.length ? { skills: parsedSkills } : {}),
  })

  const go = (next, m) => { setError(''); if (m) setMethod(m); setStep(next) }

  // Step 1: validate + send the email OTP (phone OTP is simulated while SMS is unavailable)
  const getOtp = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!emailOk) return setError('Please enter a valid email.')
    if (!phoneOk) return setError('Please enter a valid phone number.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('The two passwords don’t match.')
    setBusy(true); setError('')
    try {
      await api.requestOtp(form.email.trim())
      setEmailCode(''); setPhoneCode(''); setResent(false); setOtpPhase('enter'); setStep('otp')
    } catch (err) {
      setError(err.message || 'Could not send the code. Please try again.')
    } finally { setBusy(false) }
  }

  // Verify both: email checked for real, phone accepts any code (preview)
  const verifyBoth = async () => {
    if (busy) return
    if (!emailCode.trim() || !phoneCode.trim()) return setError('Please enter both codes.')
    setBusy(true); setError('')
    try {
      await api.verifyOtp(form.email.trim(), emailCode.trim())
      // phone verification is in preview — any code is accepted
      setOtpPhase('verified')
    } catch {
      setError('Uh-oh, verification failed. Check the codes and try again.')
    } finally { setBusy(false) }
  }

  // Resend both — reissues the email code (old one becomes invalid) and re-"sends" the phone code
  const resendBoth = async () => {
    if (busy) return
    setBusy(true); setError('')
    try {
      await api.requestOtp(form.email.trim())
      setEmailCode(''); setPhoneCode(''); setResent(true)
    } catch (err) {
      setError(err.message || 'Could not resend the codes.')
    } finally { setBusy(false) }
  }

  const editDetails = () => {
    setError(''); setResent(false); setEmailCode(''); setPhoneCode(''); setOtpPhase('enter')
    setStep(method === 'resume' ? 'resume' : 'details')
  }

  const finishSignup = async () => {
    if (busy) return
    setBusy(true); setError('')
    try {
      await signup(buildSignupPayload())
      patchProfile({
        location: form.location,
        source: method,
        resumeName: method === 'resume' ? fileName : '',
        ...(method === 'resume' && parsedSkills.length ? { skills: parsedSkills } : {}),
      })
      nav('/screening')
    } catch (err) {
      setError(err.message || 'Could not create your account.')
    } finally { setBusy(false) }
  }

  const doLogin = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!loginForm.email.trim() || !loginForm.password) return setError('Enter your email and password.')
    setBusy(true); setError('')
    try {
      const { hasScreening } = await login(loginForm.email.trim(), loginForm.password)
      nav(hasScreening ? '/dashboard' : '/screening')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally { setBusy(false) }
  }

  const sendForgot = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!/\S+@\S+\.\S+/.test(forgotEmail.trim())) return setError('Enter a valid email.')
    setBusy(true); setError('')
    try {
      await api.forgotPassword(forgotEmail.trim())
      setForgotSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally { setBusy(false) }
  }

  const stepIndex = step === 'choose' ? 0 : (step === 'resume' && !parsed) ? 1 : 2
  const showStepper = ['resume', 'details', 'otp'].includes(step)

  const PasswordPair = () => (
    <>
      <div className="row2">
        <div className="field">
          <label style={lblRow}><span>Create a password</span><button type="button" className="linklike" onClick={() => setShowPw((v) => !v)}>{showPw ? 'Hide' : 'View'}</button></label>
          <input className="input" type={showPw ? 'text' : 'password'} placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input className={`input ${pwMismatch ? 'input-err' : ''}`} type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          {pwMismatch && <div style={{ color: '#dc2626', fontSize: 12.5, marginTop: 6, fontWeight: 500 }}>Passwords don’t match</div>}
        </div>
      </div>
    </>
  )

  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo light />
        <div>
          <h2>Your AI career agent is one conversation away.</h2>
          <p>Upload a resume or start from scratch. Either way, Kai takes it from here — matching, prepping and introducing you until you land the role.</p>
        </div>
        <div className="auth-quote">
          <div style={{ color: '#fcd34d', letterSpacing: 2, marginBottom: 8 }}>★★★★★</div>
          <p style={{ fontSize: 15, color: '#fff' }}>“Felt like the most attentive, productive conversation I’ve ever had with a recruiter. Found my dream role through Kai.”</p>
          <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>— Catherine W., hired in 2 weeks</div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-box">
          {showStepper && (
            <div className="stepper">
              <div className={`s ${stepIndex >= 0 ? 'done' : ''}`}><i /></div>
              <div className={`s ${stepIndex >= 1 ? 'done' : ''}`}><i /></div>
              <div className={`s ${stepIndex >= 2 ? 'done' : ''}`}><i /></div>
            </div>
          )}

          {step === 'choose' && (
            <>
              <h1>Let’s build your profile</h1>
              <p className="lead">Two ways in. Pick whatever’s faster for you.</p>
              <div className="choice">
                <button className="choice-card" onClick={() => go('resume', 'resume')}>
                  <span className="ic">⤒</span>
                  <span><span className="tt">Upload my resume</span><span className="ds">Kai reads it and pre-fills everything. ~10 seconds.</span></span>
                  <span className="arw">→</span>
                </button>
                <button className="choice-card" onClick={() => go('details', 'manual')}>
                  <span className="ic">✎</span>
                  <span><span className="tt">Fill it in manually</span><span className="ds">No resume handy? Answer a few quick fields instead.</span></span>
                  <span className="arw">→</span>
                </button>
              </div>
              <div className="divider">already with Kai?</div>
              <button className="btn btn-ghost btn-block" onClick={() => go('login')}>Log in</button>
            </>
          )}

          {step === 'login' && (
            <>
              <button className="back-link" onClick={() => go('choose')}>← Back</button>
              <h1>Welcome back</h1>
              <p className="lead">Log in to pick up where you left off with Kai.</p>
              {error && <div style={errStyle}>{error}</div>}
              <form onSubmit={doLogin}>
                <div className="field"><label>Email</label><input className="input" type="email" placeholder="you@email.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></div>
                <div className="field">
                  <label style={lblRow}><span>Password</span><button type="button" className="linklike" onClick={() => setShowLoginPw((v) => !v)}>{showLoginPw ? 'Hide' : 'View'}</button></label>
                  <input className="input" type={showLoginPw ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                </div>
                <div style={{ textAlign: 'right', marginBottom: 12 }}>
                  <button type="button" className="linklike" onClick={() => { setForgotEmail(loginForm.email); setForgotSent(false); go('forgot') }}>Forgot password?</button>
                </div>
                <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Signing in…' : 'Log in →'}</button>
              </form>
              <div className="divider">new here?</div>
              <button className="btn btn-ghost btn-block" onClick={() => go('choose')}>Create an account</button>
            </>
          )}

          {step === 'forgot' && (
            <>
              <button className="back-link" onClick={() => go('login')}>← Back to login</button>
              {!forgotSent ? (
                <>
                  <h1>Reset your password</h1>
                  <p className="lead">Enter your email and we’ll send you a link to set a new password.</p>
                  {error && <div style={errStyle}>{error}</div>}
                  <form onSubmit={sendForgot}>
                    <div className="field"><label>Email</label><input className="input" type="email" placeholder="you@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} /></div>
                    <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Sending…' : 'Send reset link →'}</button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 46, marginBottom: 10 }}>📬</div>
                  <h1>Check your inbox</h1>
                  <p className="lead">If <b>{forgotEmail}</b> is registered, a reset link is on its way. It expires in 30 minutes.</p>
                  <button className="btn btn-ghost btn-block btn-lg" style={{ marginTop: 16 }} onClick={() => go('login')}>Back to login</button>
                </div>
              )}
            </>
          )}

          {step === 'resume' && (
            <>
              <button className="back-link" onClick={() => { go('choose'); setParsed(false); setParsing(false) }}>← Back</button>
              <h1>Upload your resume</h1>
              <p className="lead">PDF, DOCX or TXT. Kai extracts the details so you don’t have to type them.</p>

              {!parsed ? (
                <div className={`dropzone ${drag ? 'drag' : ''}`} onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={onFile} />
                  {!parsing ? (
                    <>
                      <div className="big">⤒</div>
                      <div style={{ fontWeight: 600 }}>Drop your resume here, or click to browse</div>
                      <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>We never share it without your say-so.</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, marginBottom: 12 }}>Kai is reading {fileName}…</div>
                      <div className="parse">
                        {parsedLines.map((l, i) => (<div className="parse-line" key={l} style={{ animationDelay: `${i * 0.45}s` }}><span className="tick">✓</span> {l}</div>))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="dropzone" style={{ borderStyle: 'solid', borderColor: 'var(--mint)', background: 'rgba(16,185,129,0.06)', cursor: 'default' }}>
                  <div className="big">✓</div>
                  <div style={{ fontWeight: 600 }}>Got it — {fileName} parsed</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>Review the details below and set a password.</div>
                </div>
              )}

              {parsed && (
                <form onSubmit={getOtp} style={{ marginTop: 22 }}>
                  {error && <div style={errStyle}>{error}</div>}
                  <div className="row2">
                    <div className="field"><label>Full name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="field"><label>Headline</label><input className="input" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
                  </div>
                  <div className="field"><label>Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="field"><label>Phone number</label><input className="input" type="tel" placeholder="e.g. +91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="field"><label>Location</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  {PasswordPair()}
                  <button className="btn btn-primary btn-block btn-lg" disabled={!canGetOtp || busy}>{busy ? 'Sending code…' : 'Get OTP →'}</button>
                </form>
              )}
            </>
          )}

          {step === 'details' && (
            <>
              <button className="back-link" onClick={() => go('choose')}>← Back</button>
              <h1>Create your account</h1>
              <p className="lead">Just the basics — Kai fills in the rest during your chat.</p>
              <form onSubmit={getOtp}>
                {error && <div style={errStyle}>{error}</div>}
                <div className="field"><label>Full name</label><input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="field"><label>Email</label><input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="field"><label>Phone number</label><input className="input" type="tel" placeholder="e.g. +91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="field"><label>Current title (optional)</label><input className="input" placeholder="e.g. Product Designer" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
                {PasswordPair()}
                <button className="btn btn-primary btn-block btn-lg" disabled={!canGetOtp || busy}>{busy ? 'Sending code…' : 'Get OTP →'}</button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              {otpPhase === 'enter' && (
                <>
                  <button className="back-link" onClick={editDetails}>← Edit email or phone</button>
                  <h1>Verify your account</h1>
                  <p className="lead">Enter the codes we sent to confirm it’s you.</p>
                  {error && <div style={errStyle}>{error}</div>}
                  {resent && <div style={okStyle}>✓ New codes sent — only the latest codes are valid.</div>}
                  <div className="field">
                    <label>Please enter the OTP sent to your email <b>{form.email}</b></label>
                    <input className="input" inputMode="numeric" maxLength={6} placeholder="______" style={otpInput}
                      value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div className="field">
                    <label>Please enter the OTP sent to your phone <b>{form.phone}</b></label>
                    <input className="input" inputMode="numeric" maxLength={6} placeholder="______" style={otpInput}
                      value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))} />
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Phone verification is in preview — enter any code to continue.</div>
                  </div>
                  <button className="btn btn-primary btn-block btn-lg" disabled={busy || !emailCode || !phoneCode} onClick={verifyBoth}>{busy ? 'Checking…' : 'Verify'}</button>
                  <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} disabled={busy} onClick={resendBoth}>Resend OTP</button>
                  <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 14 }}>Email code expires in 10 minutes. Check your spam folder if it hasn’t arrived.</p>
                </>
              )}

              {otpPhase === 'verified' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
                  <h1>Verified</h1>
                  <p className="lead">Both codes checked out, {form.name.split(' ')[0] || 'there'}. Create your account and meet Kai.</p>
                  {error && <div style={errStyle}>{error}</div>}
                  <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 12 }} disabled={busy} onClick={finishSignup}>{busy ? 'Creating your account…' : 'Submit & meet Kai →'}</button>
                </div>
              )}
            </>
          )}

          {['choose', 'resume', 'details'].includes(step) && (
            <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--muted)', marginTop: 18 }}>
              By continuing you agree to Kairo’s Terms & Privacy. You control what’s shared.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
