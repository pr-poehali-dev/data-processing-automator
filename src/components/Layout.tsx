import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  role: "citizen" | "employee" | "admin";
  onLogout: () => void;
}

const citizenNav = [
  { id: "dashboard", label: "Личный кабинет", icon: "LayoutDashboard" },
  { id: "new-application", label: "Подать заявление", icon: "FilePlus" },
  { id: "applications", label: "Мои заявления", icon: "FileText" },
  { id: "documents", label: "Документы", icon: "FolderOpen" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
];

const employeeNav = [
  { id: "staff-panel", label: "Рабочий стол", icon: "LayoutDashboard" },
  { id: "applications", label: "Заявления", icon: "FileText" },
  { id: "documents", label: "Документы", icon: "FolderOpen" },
];

const adminNav = [
  { id: "dashboard", label: "Обзор", icon: "LayoutDashboard" },
  { id: "staff-panel", label: "Рабочий стол", icon: "Monitor" },
  { id: "applications", label: "Заявления", icon: "FileText" },
  { id: "new-application", label: "Подать заявление", icon: "FilePlus" },
  { id: "documents", label: "Документы", icon: "FolderOpen" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
  { id: "user-management", label: "Пользователи", icon: "Users" },
  { id: "audit", label: "Журнал аудита", icon: "ClipboardList" },
];

export default function Layout({ children, activePage, onNavigate, role, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifCount] = useState(3);

  const navItems = role === "citizen" ? citizenNav : role === "employee" ? employeeNav : adminNav;
  const roleLabel = role === "citizen" ? "Заявитель" : role === "employee" ? "Сотрудник" : "Администратор";
  const userName = role === "citizen" ? "Иванов Иван Иванович" : role === "employee" ? "Петрова М.С." : "Администратор";

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--gov-bg))]">
      {/* Шапка */}
      <header className="bg-[hsl(var(--gov-stripe))] text-white z-20 sticky top-0 shadow-lg">
        <div className="tricolor-bar" />
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-white/10 transition"
          >
            <Icon name="Menu" size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Icon name="Building2" size={16} className="text-[hsl(var(--gov-stripe))]" />
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-widest leading-none">Российская Федерация</div>
              <div className="font-bold text-base leading-tight">ГосПортал</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("notifications")}
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <Icon name="Bell" size={18} />
              {notifCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[hsl(var(--accent))] rounded-full text-[10px] font-bold flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-sm">
              <Icon name="UserCircle" size={16} />
              <span className="hidden sm:block max-w-[120px] truncate">{userName}</span>
              <span className="text-xs text-white/60">· {roleLabel}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title="Выйти"
            >
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Боковое меню */}
        <aside
          className={`${sidebarOpen ? "w-60" : "w-0 overflow-hidden"} transition-all duration-300 bg-[hsl(var(--gov-stripe))] flex-shrink-0 flex flex-col`}
        >
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-item w-full ${activePage === item.id ? "active" : ""}`}
              >
                <Icon name={item.icon} fallback="Circle" size={18} />
                <span>{item.label}</span>
                {item.id === "notifications" && notifCount > 0 && (
                  <span className="ml-auto bg-[hsl(var(--accent))] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="nav-item w-full text-white/60 hover:text-white"
            >
              <Icon name="LogOut" size={16} />
              <span className="text-sm">Выйти из системы</span>
            </button>
          </div>
        </aside>

        {/* Основной контент */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}