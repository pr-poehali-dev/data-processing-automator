import { useState } from "react";
import LoginPage from "./LoginPage";
import TwoFactorPage from "./TwoFactorPage";
import DashboardPage from "./DashboardPage";
import ApplicationsPage from "./ApplicationsPage";
import NewApplicationPage from "./NewApplicationPage";
import DocumentsPage from "./DocumentsPage";
import NotificationsPage from "./NotificationsPage";
import StaffPanelPage from "./StaffPanelPage";
import UserManagementPage from "./UserManagementPage";
import Layout from "@/components/Layout";

type AppState = "login" | "2fa" | "app";
type Role = "citizen" | "employee" | "admin";

export default function Index() {
  const [appState, setAppState] = useState<AppState>("app");
  const [role, setRole] = useState<Role>("admin");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setAppState("2fa");
  };

  const handleVerify = () => {
    setCurrentPage(role === "citizen" ? "dashboard" : role === "employee" ? "staff-panel" : "dashboard");
    setAppState("app");
  };

  const handleLogout = () => {
    setAppState("login");
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (appState === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (appState === "2fa") {
    return (
      <TwoFactorPage
        onVerify={handleVerify}
        onBack={() => setAppState("login")}
        method="email"
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      case "applications":
        return <ApplicationsPage onNavigate={handleNavigate} />;
      case "new-application":
        return <NewApplicationPage onNavigate={handleNavigate} />;
      case "documents":
        return <DocumentsPage />;
      case "notifications":
        return <NotificationsPage />;
      case "staff-panel":
        return <StaffPanelPage />;
      case "user-management":
      case "audit":
        return <UserManagementPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      activePage={currentPage}
      onNavigate={handleNavigate}
      role={role}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}