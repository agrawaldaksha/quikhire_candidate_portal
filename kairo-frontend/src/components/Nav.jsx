import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#recruiters">For recruiters</a>
        </nav>
        <div className="nav-right">
          <Link to="/resume-builder" state={{ guest: true }} className="nav-links" style={{ fontWeight: 500 }}>
            Resume Builder
          </Link>
          <Link to="/login" className="nav-links" style={{ fontWeight: 500 }}>
            Log in
          </Link>
          <Link to="/login" className="btn btn-dark">
            Meet Kai →
          </Link>
        </div>
      </div>
    </header>
  )
}
