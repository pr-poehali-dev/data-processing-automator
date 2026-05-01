import Icon from "@/components/ui/icon";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { label: "Всего заявлений", value: "12", icon: "FileText", color: "bg-blue-600" },
  { label: "На рассмотрении", value: "3", icon: "Clock", color: "bg-amber-500" },
  { label: "Одобрено", value: "8", icon: "CheckCircle", color: "bg-green-600" },
  { label: "Отклонено", value: "1", icon: "XCircle", color: "bg-red-600" },
];

const recentApplications = [
  { id: "ЗАЯ-2026-00345", type: "Справка о регистрации", date: "28.04.2026", status: "approved", statusLabel: "Одобрено" },
  { id: "ЗАЯ-2026-00312", type: "Выписка из реестра", date: "15.04.2026", status: "review", statusLabel: "На рассмотрении" },
  { id: "ЗАЯ-2026-00289", type: "Замена документа", date: "02.04.2026", status: "done", statusLabel: "Исполнено" },
];

const notifications = [
  { text: "Заявление ЗАЯ-2026-00345 одобрено", time: "2 часа назад", icon: "CheckCircle", color: "text-green-600" },
  { text: "Требуется дополнительный документ для ЗАЯ-2026-00312", time: "1 день назад", icon: "AlertCircle", color: "text-amber-600" },
  { text: "Подтверждение входа выполнено с нового устройства", time: "3 дня назад", icon: "Shield", color: "text-blue-600" },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Приветствие */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Добрый день, Иванов Иван Иванович
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          1 мая 2026 г. · Личный кабинет заявителя
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm animate-fade-in delay-${(i + 1) * 100}`}
          >
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
        {/* Последние заявления */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm animate-fade-in delay-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Icon name="FileText" size={16} className="text-[hsl(var(--primary))]" />
              Последние заявления
            </h2>
            <button
              onClick={() => onNavigate("applications")}
              className="text-xs text-[hsl(var(--gov-blue-light))] hover:underline"
            >
              Все заявления →
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentApplications.map((app) => (
              <div key={app.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-secondary/30 transition">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{app.id}</div>
                  <div className="text-sm font-medium mt-0.5">{app.type}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{app.date}</div>
                </div>
                <span className={`status-${app.status} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {app.statusLabel}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border">
            <button
              onClick={() => onNavigate("new-application")}
              className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] font-medium hover:text-[hsl(var(--gov-blue-light))] transition"
            >
              <Icon name="Plus" size={16} />
              Подать новое заявление
            </button>
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-xl border border-border shadow-sm animate-fade-in delay-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Icon name="Bell" size={16} className="text-[hsl(var(--primary))]" />
              Уведомления
            </h2>
            <span className="bg-[hsl(var(--accent))] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <div className="divide-y divide-border">
            {notifications.map((n, i) => (
              <div key={i} className="px-4 py-3 flex gap-3">
                <Icon name={n.icon} size={16} className={`${n.color} mt-0.5 flex-shrink-0`} />
                <div>
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={() => onNavigate("notifications")}
              className="text-xs text-[hsl(var(--gov-blue-light))] hover:underline"
            >
              Все уведомления →
            </button>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
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
          ].map((action) => (
            <button
              key={action.page}
              onClick={() => onNavigate(action.page)}
              className={`${action.color} rounded-lg p-3 flex flex-col items-center gap-2 transition text-center`}
            >
              <Icon name={action.icon} size={22} />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
