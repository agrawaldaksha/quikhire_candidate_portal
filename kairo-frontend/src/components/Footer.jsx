import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="note">
              Kairo is your AI career agent. Meet Kai — get matched, get warm intros, and get coached
              until you land the role. Companion to QuikHire, the hiring platform for recruiters.
            </p>
          </div>
          <div>
            <h5>Product</h5>
            <a href="#features">Job match</a>
            <a href="#features">Warm intros</a>
            <a href="#features">Mock interviews</a>
            <a href="#features">Salary benchmark</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Press</a>
          </div>
          <div>
            <h5>For recruiters</h5>
            <a href="#recruiters">QuikHire</a>
            <a href="#">Post a role</a>
            <a href="#">Talent network</a>
            <a href="#">Contact sales</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Kairo. A new home for candidates.</span>
          <span>Privacy · Terms · You control your data</span>
        </div>
      </div>
    </footer>
  )
}
