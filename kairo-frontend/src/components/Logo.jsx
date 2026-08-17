import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="logo" style={light ? { color: '#fff' } : undefined}>
      <span className="logo-mark" aria-hidden />
      <span className="logo-text">
        <b>Kai</b>ro
      </span>
    </Link>
  )
}
