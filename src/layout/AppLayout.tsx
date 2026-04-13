import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'en' | 'ar';

const copy: Record<
  AppLanguage,
  {
    brandTitle: string;
    brandSubtitle: string;
    dashboard: string;
    queue: string;
    reports: string;
    logout: string;
    languageButton: string;
    userAria: string;
  }
> = {
  en: {
    brandTitle: 'Fraud Management',
    brandSubtitle: 'Investigation command center',
    dashboard: 'Dashboard',
    queue: 'Fraud Queue',
    reports: 'Reports',
    logout: 'Log Out',
    languageButton: 'العربية',
    userAria: 'Fraud Agent User profile',
  },
  ar: {
    brandTitle: 'إدارة الاحتيال',
    brandSubtitle: 'مركز قيادة التحقيق',
    dashboard: 'لوحة التحكم',
    queue: 'قائمة بلاغات الاحتيال',
    reports: 'التقارير',
    logout: 'تسجيل الخروج',
    languageButton: 'English',
    userAria: 'ملف مستخدم فريق الاحتيال',
  },
};

export default function AppLayout() {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('app-language');
    return saved === 'ar' ? 'ar' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useMemo(() => copy[language], [language]);

  const links = useMemo(
    () => [
      { to: '/app/dashboard', label: t.dashboard },
      { to: '/app/queue', label: t.queue },
      { to: '/app/reports', label: t.reports },
    ],
    [t]
  );

  return (
    <div className={`app-shell ${language === 'ar' ? 'rtl' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="sidebar">
        <Link className="brand" to="/app/dashboard">
          <span className="brand-mark">FM</span>
          <span className="brand-copy">
            <strong>{t.brandTitle}</strong>
            <span>{t.brandSubtitle}</span>
          </span>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-frame">
          <div className="topbar">
            <div className="topbar-controls">
              <button
                className="btn"
                type="button"
                onClick={() => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'))}
              >
                {t.languageButton}
              </button>

              <Link className="btn" to="/login">
                {t.logout}
              </Link>

              <button className="user-icon" type="button" aria-label={t.userAria}>
                <span className="user-chip-avatar">FA</span>
              </button>
            </div>
          </div>

          <Outlet context={{ language }} />
        </div>
      </main>
    </div>
  );
}
