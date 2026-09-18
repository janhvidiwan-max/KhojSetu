import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MissingPersonsPage from './pages/MissingPersonsPage';
import RegisterMissingPersonPage from './pages/RegisterMissingPersonPage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import EditCasePage from './pages/EditCasePage';
import VideoAnalysisPage from './pages/VideoAnalysisPage';
import PotentialMatchesPage from './pages/PotentialMatchesPage';
import InvestigationTimelinePage from './pages/InvestigationTimelinePage';
import MapViewPage from './pages/MapViewPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';
import PublicReportPage from './pages/PublicReportPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cases" element={<MissingPersonsPage />} />
          <Route path="/cases/new" element={<RegisterMissingPersonPage />} />
          <Route path="/cases/:id" element={<CaseDetailsPage />} />
          <Route path="/cases/:id/edit" element={<EditCasePage />} />
          
          <Route path="/video-analysis" element={<VideoAnalysisPage />} />
          <Route path="/matches" element={<PotentialMatchesPage />} />
          <Route path="/timeline" element={<InvestigationTimelinePage />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/public-report" element={<PublicReportPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
