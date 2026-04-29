import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import AgentLayout from './layouts/AgentLayout';
import SgsLayout from './layouts/SgsLayout';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterAgent from './pages/RegisterAgent';
import JoinPage from './pages/public/JoinPage';
import SettingsPage from './pages/SettingsPage';
import DashboardHome from './pages/admin/DashboardHome';
import CRMPage from './pages/admin/CRMPage';
import KanalPage from './pages/admin/KanalPage';
import AgenPage from './pages/admin/AgenPage';
import EmailPage from './pages/admin/EmailPage';
import ReferensiPage from './pages/admin/ReferensiPage';
import SgsPage from './pages/admin/SgsPage';
import EgsPage from './pages/admin/EgsPage';
import SgsDashboard from './pages/sgs/SgsDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentFinance from './pages/agent/AgentFinance';
import AgentHelp from './pages/agent/AgentHelp';
import MarketingKit from './pages/agent/MarketingKit';
import StudentDashboard from './pages/student/StudentDashboard';
import PaymentPage from './pages/public/PaymentPage';
import LandingPageAgent from './pages/landing/LandingPageAgent';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
      <Routes>
        {/* 1. JALUR MARKETING (Prioritas Tinggi) */}
        <Route path="/p/:agentCode" element={<LandingPageAgent />} />
        <Route path="/pembayaran-pendaftaran/:regCode" element={<PaymentPage />} />

        {/* 2. JALUR PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-agent" element={<RegisterAgent />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/daftar" element={<JoinPage />} />

        {/* 3. JALUR PORTAL (Berdasarkan Role) */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="kanal" element={<KanalPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="agen" element={<AgenPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="referensi" element={<ReferensiPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="sgs" element={<SgsPage />} />
          <Route path="egs" element={<EgsPage />} />
        </Route>

        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="finance" element={<AgentFinance />} />
          <Route path="help" element={<AgentHelp />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="tools" element={<MarketingKit />} />
        </Route>

        <Route path="/sgs" element={<SgsLayout />}>
          <Route index element={<Navigate to="/sgs/dashboard" replace />} />
          <Route path="dashboard" element={<SgsDashboard />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="tools" element={<MarketingKit />} />
        </Route>

        <Route path="/egs" element={<AgentLayout />}>
          <Route index element={<Navigate to="/egs/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="finance" element={<AgentFinance />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 4. CATCH-ALL (Harus Paling Bawah) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}