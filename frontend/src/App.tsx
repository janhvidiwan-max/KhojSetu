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

import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/public-report" element={<PublicReportPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute><MissingPersonsPage /></ProtectedRoute>} />
          <Route path="/cases/new" element={<ProtectedRoute><RegisterMissingPersonPage /></ProtectedRoute>} />
          <Route path="/cases/:id" element={<ProtectedRoute><CaseDetailsPage /></ProtectedRoute>} />
          <Route path="/cases/:id/edit" element={<ProtectedRoute><EditCasePage /></ProtectedRoute>} />

          <Route path="/video-analysis" element={<ProtectedRoute><VideoAnalysisPage /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><PotentialMatchesPage /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><InvestigationTimelinePage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapViewPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
