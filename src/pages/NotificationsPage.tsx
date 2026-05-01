import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  read: boolean;
  time: string;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  success: { icon: "CheckCircle", color: "text-green-600", bg: "bg-green-100" },
  warning: { icon: "AlertTriangle", color: "text-amber-600", bg: "bg-amber-100" },
  info: { icon: "Info", color: "text-blue-600", bg: "bg-blue-100" },
  error: { icon: "XCircle", color: "text-red-600", bg: "bg-red-100" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    api.getNotifications(1).then(setNotifications).finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    api.markAllRead(1).then(() => {
      setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    });
  };

  const markRead = (id: number) => {
    api.markNotificationRead(id).then(() => {
      setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Уведомления
            {unreadCount > 0 && (
              <span className="bg-[hsl(var(--accent))] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Информация о статусах заявлений и событиях</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-[hsl(var(--gov-blue-light))] hover:underline flex items-center gap-1"
          >
            <Icon name="CheckCheck" size={14} />
            Прочитать все
          </button>
        )}
      </div>

      <div className="flex gap-2 animate-fade-in delay-100">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            filter === "all"
              ? "bg-[hsl(var(--primary))] text-white"
              : "bg-white border border-border hover:bg-secondary"
          }`}
        >
          Все ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            filter === "unread"
              ? "bg-[hsl(var(--primary))] text-white"
              : "bg-white border border-border hover:bg-secondary"
          }`}
        >
          Непрочитанные ({unreadCount})
        </button>
      </div>

      <div className="space-y-3 animate-fade-in delay-200">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border shadow-sm p-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))
          : filtered.map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.info;
              return (
                <div
                  key={n.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 flex gap-4 transition ${
                    !n.read ? "border-[hsl(var(--gov-blue-light))]/30 bg-blue-50/20" : "border-border"
                  }`}
                >
                  <div
                    className={`${cfg.bg} ${cfg.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon name={cfg.icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-[hsl(var(--gov-blue-light))] hover:underline"
                        >
                          Отметить прочитанным
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-border py-12 text-center text-muted-foreground">
            <Icon name="BellOff" size={36} className="mx-auto mb-2 opacity-40" />
            <p>Нет непрочитанных уведомлений</p>
          </div>
        )}
      </div>
    </div>
  );
}
