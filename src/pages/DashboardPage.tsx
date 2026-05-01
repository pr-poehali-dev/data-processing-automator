import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const statusColors: Record<string, string> = {
  new: "status-new", review: "status-review", approved: "status-approved",
  rejected: "status-rejected", done: "status-done",
};
const typeIcons: Record<string, string> = {
  success: "CheckCircle", warning: "AlertCircle", info: "Info", error: "XCircle",
};
const typeColors: Record<string, string> = {
  success: "text-green-600", warning: "text-amber-600", info: "text-blue-600", error: "text-red-600",
};

type AppData = { stats: Record<string,number>; recent_applications: Record<string,string>[]; notifications: Record<string,string|boolean>[] };

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard(1).then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}</div>
    </div>
  );

  const { stats, recent_applications, notifications } = data || {};
  const statCards = [
    { label: "Всего заявлений", value: stats?.total ?? 0, icon: "FileText", color: "bg-blue-600" },
    { label: "На рассмотрении", value: stats?.pending ?? 0, icon: "Clock", color: "bg-amber-500" },
    { label: "Одобрено", value: stats?.approved ?? 0, icon: "CheckCircle", color: "bg-green-600" },
    { label: "Отклонено", value: stats?.rejected ?? 0, icon: "XCircle", color: "bg-red-600" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Добрый день, Иванов Иван Иванович</h1>
        <p className="text-muted-foreground text-sm mt-1">1 мая 2026 г. · Личный кабинет заявителя</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className={`bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm animate-fade-in delay-${(i+1)*100}`}>
            <div className={`${s.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon name={s.icon} size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm animate-fade-in delay-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Icon name="FileText" size={16} className="text-[hsl(var(--primary))]" />
              Последние заявления
            </h2>
            <button onClick={() => onNavigate("applications")} className="text-xs text-[hsl(var(--gov-blue-light))] hover:underline">Все заявления →</button>
          </div>
          <div className="divide-y divide-border">
            {(recent_applications || []).map((app) => (
              <div key={app.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-secondary/30 transition">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{app.id}</div>
                  <div className="text-sm font-medium mt-0.5">{app.type}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{app.date}</div>
                </div>
                <span className={`${statusColors[app.status] || 'status-new'} text-xs font-medium px-2.5 py-1 rounded-full`}>{app.statusLabel}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border">
            <button onClick={() => onNavigate("new-application")} className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] font-medium hover:text-[hsl(var(--gov-blue-light))] transition">
              <Icon name="Plus" size={16} />Подать новое заявление
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm animate-fade-in delay-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Icon name="Bell" size={16} className="text-[hsl(var(--primary))]" />
              Уведомления
            </h2>
            {notifications?.filter((n) => !n.read).length > 0 && (
              <span className="bg-[hsl(var(--accent))] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </div>
          <div className="divide-y divide-border">
            {(notifications || []).map((n) => (
              <div key={n.id} className="px-4 py-3 flex gap-3">
                <Icon name={typeIcons[n.type] || 'Info'} size={16} className={`${typeColors[n.type] || 'text-blue-600'} mt-0.5 flex-shrink-0`} />
                <div>
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <button onClick={() => onNavigate("notifications")} className="text-xs text-[hsl(var(--gov-blue-light))] hover:underline">Все уведомления →</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-5 animate-fade-in delay-400">
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Icon name="Zap" size={16} className="text-[hsl(var(--primary))]" />
          Быстрые действия
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Подать заявление", icon: "FilePlus", page: "new-application", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { label: "Загрузить документ", icon: "Upload", page: "documents", color: "bg-green-50 text-green-700 hover:bg-green-100" },
            { label: "Статус заявления", icon: "Search", page: "applications", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            { label: "Уведомления", icon: "Bell", page: "notifications", color: "bg-red-50 text-red-700 hover:bg-red-100" },
          ].map((a) => (
            <button key={a.page} onClick={() => onNavigate(a.page)} className={`${a.color} rounded-lg p-3 flex flex-col items-center gap-2 transition text-center`}>
              <Icon name={a.icon} size={22} />
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}