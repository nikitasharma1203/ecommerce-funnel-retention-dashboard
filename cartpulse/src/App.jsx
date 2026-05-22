import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { DataProvider } from "./hooks/useData";
import AuthPage from "./components/auth/AuthPage";
import Topbar from "./components/dashboard/Topbar";
import Sidebar from "./components/dashboard/Sidebar";
import FiltersBar from "./components/dashboard/FiltersBar";
import OverviewPage from "./components/dashboard/OverviewPage";
import FunnelPage from "./components/funnel/FunnelPage";
import CohortPage from "./components/cohort/CohortPage";
import AIPage from "./components/ai/AIPage";
import UploadPage from "./components/upload/UploadPage";
import StoryPage from "./components/story/StoryPage";
import {
  RevenuePage, ConversionPage, RetentionPage,
  ActiveUsersPage, ReturningPage, RFMPage, GeoPage,
} from "./components/dashboard/OtherPages";
import { generatePDFReport } from "./utils/pdfExport";
import "./index.css";

function Dashboard() {
  const [page, setPage]     = useState("overview");
  const [theme, setTheme]   = useState("dark");
  const [filters, setFilters] = useState({ period: "30d", compare: "prev_period", device: "all", source: "all" });
  const { user } = useAuth();

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleDownloadPDF = () => {
    generatePDFReport(null, null, user?.displayName || "CartPulse User");
  };

  const renderPage = () => {
    switch (page) {
      case "overview":    return <OverviewPage />;
      case "revenue":     return <RevenuePage />;
      case "conversion":  return <ConversionPage />;
      case "retention":   return <RetentionPage />;
      case "activeusers": return <ActiveUsersPage />;
      case "returning":   return <ReturningPage />;
      case "funnel":      return <FunnelPage />;
      case "ai":          return <AIPage />;
      case "cohort":      return <CohortPage />;
      case "rfm":         return <RFMPage />;
      case "geo":         return <GeoPage />;
      case "story":       return <StoryPage />;
      case "upload":      return <UploadPage />;
      default:            return <OverviewPage />;
    }
  };

  return (
    <div className="app-shell">
      <Topbar
        theme={theme}
        onThemeToggle={toggleTheme}
        onUpload={() => setPage("upload")}
        onDownloadPDF={handleDownloadPDF}
        anomalyCount={2}
      />
      <div className="app-body">
        <Sidebar activePage={page} onChange={setPage} />
        <main className="main-content">
          <FiltersBar filters={filters} onChange={setFilters} />
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#09111e", flexDirection: "column", gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, border: "3px solid #6366f1",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading CartPulse…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppInner />
      </DataProvider>
    </AuthProvider>
  );
}
