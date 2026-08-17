import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import ChooseMode from './pages/ChooseMode.jsx'
import VoiceComingSoon from './pages/VoiceComingSoon.jsx'
import Screening from './pages/Screening.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const { authed, screeningDone } = useApp()

  // Any authed-only route falls back to /login when not signed in.
  const gated = (el) => (authed ? el : <Navigate to="/login" replace />)

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/connect" element={gated(<ChooseMode />)} />
      <Route path="/voice" element={gated(<VoiceComingSoon />)} />
      <Route path="/screening" element={gated(<Screening />)} />
      <Route
        path="/dashboard"
        element={
          authed && screeningDone ? (
            <Dashboard />
          ) : authed ? (
            <Navigate to="/connect" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
