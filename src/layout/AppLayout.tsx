import { Link, NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/queue', label: 'Fraud Queue' },
  { to: '/app/cases/FC-1001', label: 'Case Details' },
  { to: '/app/reports', label: 'Reports' },
];

export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/app/dashboard">
          <span className="brand-mark">FM</span>
          <span className="brand-copy">
            <strong>Fraud Management</strong>
            <span>Investigation command center</span>
          </span>
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <div className="content-frame">
          <div className="topbar">
            <div className="topbar-controls">
              <Link className="btn" to="/login">Log Out</Link>
              <button className="user-icon" type="button" aria-label="Fraud Agent User profile">
                <span className="user-chip-avatar">FA</span>
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
