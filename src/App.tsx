import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import LauncherPage from './pages/LauncherPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import FraudQueuePage from './pages/cases/FraudQueuePage';
import CaseDetailsPage from './pages/cases/CaseDetailsPage';
import ReportsPage from './pages/reports/ReportsPage';
import ReportDetailsPage from './pages/reports/ReportDetailsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LauncherPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="queue" element={<FraudQueuePage />} />
        <Route path="cases/:caseId" element={<CaseDetailsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/:reportName" element={<ReportDetailsPage />} />
      </Route>
    </Routes>
  );
}
