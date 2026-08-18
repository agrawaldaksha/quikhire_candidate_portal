import { createContext, useContext, useState, useCallback } from 'react'
import api from '../lib/api.js'

const AppContext = createContext(null)
const TOKEN_KEY = 'kairo_token'
const DONE_KEY = 'kairo_screening_done'

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)

const emptyProfile = {
  candidateId: '', name: '', email: '', headline: '', location: '',
  workMode: '', role: '', focus: '', experience: '', seniority: '',
  skills: [], salaryTarget: null, priorities: [], availability: '',
  openTo: '', resumeName: '', source: '', skillRatings: {},
}

function fromDto(dto = {}) {
  return {
    candidateId: dto.candidateId || '',
    name: dto.name || '',
    email: dto.email || '',
    headline: dto.headline || '',
    location: Array.isArray(dto.preferredLocations) ? dto.preferredLocations[0] || '' : '',
    role: Array.isArray(dto.preferredRoles) ? dto.preferredRoles[0] || '' : '',
    workMode: dto.workMode || '',
    seniority: dto.seniority || '',
    skills: Array.isArray(dto.skills) ? dto.skills : [],
    skillRatings: parseRatings(dto.skillRatings),
    priorities: Array.isArray(dto.priorities) ? dto.priorities : [],
    salaryTarget: dto.salaryTarget ?? null,
    availability: dto.availability || '',
    experience: dto.yearsOfExperience != null ? String(dto.yearsOfExperience) : '',
    source: dto.source || '',
  }
}

// "$160k" -> 160 ; "not sure" -> null
function compToInt(v) {
  if (v == null) return null
  const m = String(v).replace(/,/g, '').match(/\d+/)
  return m ? parseInt(m[0], 10) : null
}

// skill ratings travel over the wire as a text[] of "Skill::n" entries
function parseRatings(arr) {
  const out = {}
  if (Array.isArray(arr)) arr.forEach((e) => {
    const i = String(e).lastIndexOf('::')
    if (i > 0) { const n = parseInt(e.slice(i + 2), 10); if (n >= 1 && n <= 5) out[e.slice(0, i)] = n }
  })
  return out
}
function serializeRatings(obj) {
  if (!obj || typeof obj !== 'object') return null
  const arr = Object.entries(obj).filter(([, n]) => n >= 1 && n <= 5).map(([k, n]) => `${k}::${n}`)
  return arr.length ? arr : null
}

function buildSummary(fp) {
  const bits = []
  if (fp.seniority) bits.push(fp.seniority)
  if (fp.focus || fp.role) bits.push(fp.focus || fp.role)
  if (fp.experience) bits.push(fp.experience)
  if (fp.workMode) bits.push(fp.workMode)
  if (fp.salaryTarget) bits.push(`targeting ${fp.salaryTarget}`)
  const who = bits.length ? bits.join(' · ') : 'your profile'
  const prio = Array.isArray(fp.priorities) && fp.priorities.length ? ` You told Kai that ${fp.priorities.join(', ').toLowerCase()} matter most.` : ''
  return `Kai captured ${who}.${prio}`
}

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(TOKEN_KEY))
  const [screeningDone, setScreeningDoneState] = useState(() => localStorage.getItem(DONE_KEY) === '1')
  const [screeningEmailed, setScreeningEmailed] = useState(false)
  const [transcript, setTranscript] = useState([])

  const setScreeningDone = useCallback((v) => {
    setScreeningDoneState(v)
    if (v) localStorage.setItem(DONE_KEY, '1')
    else localStorage.removeItem(DONE_KEY)
  }, [])

  const patchProfile = useCallback((patch) => {
    setProfile((p) => ({ ...p, ...patch }))
  }, [])

  const applyAuth = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setAuthed(true)
    setProfile((p) => ({ ...p, candidateId: data.candidateId, email: data.email, name: data.name || p.name }))
    return data
  }, [])

  const signup = useCallback(async (payload) => {
    const data = await api.signup(payload)
    return applyAuth(data)
  }, [applyAuth])

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password })
    applyAuth(data)
    let hasScreening = false
    try {
      const dto = await api.getProfile(data.token)
      if (dto) setProfile((p) => ({ ...p, ...fromDto(dto) }))
    } catch { /* ignore */ }
    try {
      const mems = await api.getMemories(data.token)
      const snap = Array.isArray(mems) ? mems.find((m) => m.preferenceKey === 'profile_snapshot') : null
      const summ = Array.isArray(mems) ? mems.find((m) => m.preferenceKey === 'screening_summary') : null
      if (snap && snap.preferenceValue) {
        const parsed = JSON.parse(snap.preferenceValue)
        setProfile((p) => {
          const merged = { ...p }
          Object.keys(parsed).forEach((k) => {
            const cur = merged[k]
            const empty = cur === '' || cur == null || (Array.isArray(cur) && cur.length === 0)
            if (empty) merged[k] = parsed[k]
          })
          return merged
        })
      }
      hasScreening = !!(snap || summ)
    } catch { /* ignore */ }
    if (hasScreening) setScreeningDone(true)
    return { data, hasScreening }
  }, [applyAuth, setScreeningDone])

  const resetAll = useCallback(() => {
    setProfile(emptyProfile)
    setAuthed(false)
    setScreeningDone(false)
    setScreeningEmailed(false)
    setTranscript([])
  }, [setScreeningDone])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    resetAll()
  }, [resetAll])

  // Save whatever's currently in `profile` (optionally merged with patch) to the backend.
  const saveProfile = useCallback(async (patch = {}) => {
    if (!token) return null
    const p = { ...profile, ...patch }
    const dto = {
      name: p.name || null,
      email: p.email || null,
      headline: p.headline || null,
      seniority: p.seniority || null,
      workMode: p.workMode || null,
      salaryTarget: compToInt(p.salaryTarget),
      availability: p.availability || null,
      source: p.source || null,
      preferredLocations: p.location ? [p.location] : null,
      preferredRoles: p.role ? [p.role] : null,
      skills: Array.isArray(p.skills) && p.skills.length ? p.skills : null,
      skillRatings: serializeRatings(p.skillRatings),
      priorities: Array.isArray(p.priorities) && p.priorities.length ? p.priorities : null,
      yearsOfExperience: p.experience && !isNaN(parseFloat(p.experience)) ? parseFloat(p.experience) : null,
    }
    const saved = await api.updateProfile(token, dto)
    if (saved) setProfile((cur) => ({ ...cur, ...fromDto(saved) }))
    return saved
  }, [token, profile])

  const saveMemory = useCallback(async (key, value) => {
    if (!token) return null
    return api.saveMemory(token, key, String(value))
  }, [token])

  // Finalise screening: persist profile + transcript + summary, send the email.
  // fp = the merged front-end profile; transcript = [{q,a}].
  const completeScreening = useCallback(async (fp, convo) => {
    setProfile((prev) => ({ ...prev, ...fp }))
    setTranscript(convo || [])
    setScreeningDone(true)
    if (!token) return { emailed: false }

    const dto = {
      name: fp.name || null,
      email: fp.email || null,
      headline: fp.headline || null,
      seniority: fp.seniority || null,
      workMode: fp.workMode || null,
      salaryTarget: compToInt(fp.salaryTarget),
      availability: fp.availability || null,
      source: fp.source || null,
      preferredLocations: fp.location ? [fp.location] : null,
      preferredRoles: fp.role ? [fp.role] : null,
      skills: Array.isArray(fp.skills) && fp.skills.length ? fp.skills : null,
      priorities: Array.isArray(fp.priorities) && fp.priorities.length ? fp.priorities : null,
    }

    let res = { emailed: false }
    try {
      res = (await api.completeScreening(token, { profile: dto, transcript: convo || [], summary: buildSummary(fp) })) || { emailed: false }
    } catch { /* screening still counts as done locally */ }
    // full snapshot so a refresh/login restores role/focus/experience faithfully
    try { await api.saveMemory(token, 'profile_snapshot', JSON.stringify(fp)) } catch { /* ignore */ }
    setScreeningEmailed(!!res.emailed)
    return res
  }, [token, setScreeningDone])

  // Pull canonical profile (and snapshot) from the backend — used on dashboard mount.
  const hydrateFromServer = useCallback(async () => {
    if (!token) return
    try {
      const dto = await api.getProfile(token)
      if (dto) setProfile((p) => ({ ...p, ...fromDto(dto) }))
    } catch { /* ignore */ }
    try {
      const mems = await api.getMemories(token)
      const snap = Array.isArray(mems) ? mems.find((m) => m.preferenceKey === 'profile_snapshot') : null
      if (snap && snap.preferenceValue) {
        const parsed = JSON.parse(snap.preferenceValue)
        // fill only the fields the live profile is missing (keeps canonical backend values)
        setProfile((p) => {
          const merged = { ...p }
          Object.keys(parsed).forEach((k) => {
            const cur = merged[k]
            const empty = cur === '' || cur == null || (Array.isArray(cur) && cur.length === 0)
            if (empty) merged[k] = parsed[k]
          })
          return merged
        })
        setScreeningDone(true)
      }
    } catch { /* ignore */ }
  }, [token, setScreeningDone])

  const value = {
    profile, setProfile, patchProfile,
    token, authed, setAuthed,
    screeningDone, setScreeningDone, screeningEmailed,
    transcript, setTranscript,
    signup, login, logout,
    saveProfile, saveMemory, completeScreening, hydrateFromServer,
    resetAll,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
