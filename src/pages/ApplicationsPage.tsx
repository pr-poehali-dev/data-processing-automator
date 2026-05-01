import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Application {
  id: string;
  type: string;
  date: string;
  updated: string;
  status: string;
  statusLabel: string;
  urgency: string;
  citizen_name?: string;
  comment?: string;
}

const statusFilters = ["Все", "На рассмотрении", "Одобрено", "Отклонено", "Исполнено"];

export default function ApplicationsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    api.getApplications({ user_id: 1 }).then(setApplications).finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter((a) => {
    const matchFilter = activeFilter === "Все" || a.statusLabel === activeFilter;
    const matchSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Мои заявления</h1>
          <p className="text-muted-foreground text-sm mt-1">История всех поданных обращений</p>
        </div>
        <button
          onClick={() => onNavigate("new-application")}
          className="bg-[hsl(var(--primary))] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Новое заявление
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in delay-100">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по номеру или типу заявления..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                activeFilter === f
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-white border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in delay-200">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Номер заявления</th>
              <th>Тип обращения</th>
              <th>Дата подачи</th>
              <th>Обновлено</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="h-4 w-36 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-4 w-48 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              : filtered.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold text-[hsl(var(--primary))]">{app.id}</span>
                    </td>
                    <td className="max-w-[220px]">
                      <span className="text-sm">{app.type}</span>
                    </td>
                    <td className="text-muted-foreground">{app.date}</td>
                    <td className="text-muted-foreground">{app.updated}</td>
                    <td>
                      <span className={`status-${app.status} text-xs font-medium px-2.5 py-1 rounded-full`}>
                        {app.statusLabel}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-[hsl(var(--gov-blue-light))] hover:underline text-xs flex items-center gap-1"
                      >
                        <Icon name="Eye" size={14} />
                        Подробнее
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Icon name="FileSearch" size={36} className="mx-auto mb-2 opacity-40" />
            <p>Заявления не найдены</p>
          </div>
        )}
      </div>

      {/* Детали заявления */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Детали заявления</h3>
              <button onClick={() => setSelectedApp(null)} className="p-1 rounded hover:bg-secondary transition">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Номер</span>
                <span className="font-mono font-semibold text-sm text-[hsl(var(--primary))]">{selectedApp.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Тип</span>
                <span className="text-sm text-right max-w-[260px]">{selectedApp.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Дата подачи</span>
                <span className="text-sm">{selectedApp.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Обновлено</span>
                <span className="text-sm">{selectedApp.updated}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Статус</span>
                <span className={`status-${selectedApp.status} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {selectedApp.statusLabel}
                </span>
              </div>
            </div>

            {/* Трекер статуса */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-sm font-semibold mb-3">Ход рассмотрения</p>
              <div className="flex items-center gap-0">
                {["Подано", "Принято", "Рассмотрение", "Решение"].map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i <= 2 ? "bg-[hsl(var(--primary))] text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {i <= 2 ? <Icon name="Check" size={12} /> : i + 1}
                    </div>
                    <div className="text-[10px] text-center mx-1 hidden sm:block">{step}</div>
                    {i < 3 && (
                      <div className={`flex-1 h-0.5 ${i < 2 ? "bg-[hsl(var(--primary))]" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
