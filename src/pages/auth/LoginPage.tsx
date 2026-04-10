import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="auth-grid">
          <div className="auth-panel">
            <span className="eyebrow">Secure Access</span>
            <h1>Fraud operations, redesigned for clarity.</h1>
            <p>
              Enter the command center for queue triage, case investigations, fraud indicators,
              and reporting without the visual clutter of the previous version.
            </p>
            <div className="auth-points">
              <div className="auth-point">
                <strong>Fast triage</strong>
                <span>Open high-risk cases and see assignment gaps immediately.</span>
              </div>
              <div className="auth-point">
                <strong>Consistent workflow</strong>
                <span>Track review status, notes, signals, and exports in one place.</span>
              </div>
              <div className="auth-point">
                <strong>Team visibility</strong>
                <span>Shared operational view for analysts and administrators.</span>
              </div>
            </div>
          </div>
          <div className="auth-form">
            <div className="auth-form-header">
              <h2>Sign in</h2>
              <p className="muted">Access the fraud management portal.</p>
            </div>
            <div className="form-grid single">
              <label>
                <span>Username / Email Address</span>
                <input placeholder="admin@fraud.sa" />
              </label>
              <label>
                <span>Password</span>
                <input type="password" placeholder="********" />
              </label>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember Me</span>
              </label>
              <div className="auth-actions">
                <Link className="btn primary" to="/app/dashboard">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
