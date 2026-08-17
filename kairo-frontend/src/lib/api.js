// Thin fetch wrapper around the Kairo candidate backend.
// Backend wraps every response as { success, message, data }.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:9091'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error(`Can't reach the Kairo server at ${BASE}. Is the backend running on port 9091?`)
  }
  let payload = null
  try { payload = await res.json() } catch { /* empty body */ }
  if (!res.ok || (payload && payload.success === false)) {
    throw new Error((payload && payload.message) || `Request failed (${res.status})`)
  }
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload
}

// multipart upload (no JSON Content-Type — the browser sets the boundary)
async function upload(path, file) {
  const fd = new FormData()
  fd.append('file', file)
  let res
  try {
    res = await fetch(`${BASE}${path}`, { method: 'POST', body: fd })
  } catch {
    throw new Error(`Can't reach the Kairo server at ${BASE}. Is the backend running on port 9091?`)
  }
  let payload = null
  try { payload = await res.json() } catch { /* empty */ }
  if (!res.ok || (payload && payload.success === false)) {
    throw new Error((payload && payload.message) || `Request failed (${res.status})`)
  }
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload
}

export const api = {
  parseResume: (file) => upload('/api/candidate/auth/parse-resume', file),
  requestOtp: (email) => request('/api/candidate/auth/otp/request', { method: 'POST', body: { email } }),
  verifyOtp: (email, code) => request('/api/candidate/auth/otp/verify', { method: 'POST', body: { email, code } }),
  signup: (payload) => request('/api/candidate/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/api/candidate/auth/login', { method: 'POST', body: payload }),
  forgotPassword: (email) => request('/api/candidate/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) => request('/api/candidate/auth/reset-password', { method: 'POST', body: { token, password } }),
  getProfile: (token) => request('/api/candidate/me/profile', { token }),
  updateProfile: (token, dto) => request('/api/candidate/me/profile', { method: 'PUT', body: dto, token }),
  getMemories: (token) => request('/api/candidate/me/memories', { token }),
  saveMemory: (token, preferenceKey, preferenceValue) =>
    request('/api/candidate/me/memories', { method: 'PUT', body: { preferenceKey, preferenceValue }, token }),
  completeScreening: (token, payload) =>
    request('/api/candidate/me/screening/complete', { method: 'POST', body: payload, token }),
}

export default api
