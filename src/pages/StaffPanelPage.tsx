import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Application {
  id: string;
  citizen_name: string;
  type: string;
  date: string;
  status: string;
  urgency: string;
  comment?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Новое", className: "status-new" },
  review: { label: "В работе", className: "status-review" },
  approved: { label: "Одобрено", className: "status-approved" },
  rejected: { label: "Отклонено", className: "status-rejected" },
};

const urgencyConfig: Record<string, { label: string; color: string }> = {
  high: { label: "Срочно", color: "text-red-600" },
  normal: { label: "Обычная", color: "text-blue-600" },
  low: { label: "Низкая", color: "text-gray-500" },
};

export default function StaffPanelPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getApplications().then((data: Application[]) => setApps(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = (id: string, status: string) => {
    api.updateApplication({ id, status, comment, employee_name: "Петрова М.С." });
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setSelected(null);
    setComment("");
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const stats = [
    { label: "Новые заявления", value: apps.filter((a) => a.status === "new").length, color: "bg-blue-600", icon: "FilePlus" },
    { label: "В работе", value: apps.filter((a) => a.status === "review").length, color: "bg-amber-500", icon: "Clock" },
    { label: "Одобрено", value: apps.filter((a) => a.status === "approved").length, color: "bg-green-600", icon: "CheckCircle" },
    { label: "Отклонено", value: apps.filter((a) => a.status === "rejected").length, color: "bg-red-600", icon: "XCircle" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Рабочий стол</h1>
        <p className="text-muted-foreground text-sm mt-1">Обработка поступивших заявлений</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in delay-100">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)
          : stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
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

      <div className="flex gap-2 flex-wrap animate-fade-in delay-200">
        {[
          { key: "all", label: "Все" },
          { key: "new", label: "Новые" },
          { key: "review", label: "В работе" },
          { key: "approved", label: "Одобрено" },
          { key: "rejected", label: "Отклонено" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === f.key ? "bg-[hsl(var(--primary))] text-white" : "bg-white border border-border hover:bg-secondary"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in delay-300">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Заявитель</th>
              <th>Тип обращения</th>
              <th>Дата подачи</th>
              <th>Срочность</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((__, j) => (
                    <td key={j}><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
              : filtered.map((app) => {
                const sc = statusConfig[app.status] || statusConfig.new;
                const ug = urgencyConfig[app.urgency] || urgencyConfig.normal;
                return (
                  <tr key={app.id}>
                    <td><span className="font-mono text-sm font-semibold text-[hsl(var(--primary))]">{app.id}</span></td>
                    <td className="font-medium text-sm">{app.citizen_name}</td>
                    <td className="text-sm text-muted-foreground max-w-[180px] truncate">{app.type}</td>
                    <td className="text-sm text-muted-foreground">{app.date}</td>
                    <td><span className={`text-xs font-semibold ${ug.color}`}>{ug.label}</span></td>
                    <td><span className={`${sc.className} text-xs font-medium px-2.5 py-1 rounded-full`}>{sc.label}</span></td>
                    <td>
                      <button onClick={() => setSelected(app)}
                        className="text-[hsl(var(--gov-blue-light))] hover:underline text-xs flex items-center gap-1">
                        <Icon name="ClipboardEdit" size={14} />
                        Обработать
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">Обработка заявления</h3>
                <p className="font-mono text-sm text-[hsl(var(--primary))] mt-0.5">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-secondary transition">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-2 mb-5">
              {[["Заявитель", selected.citizen_name], ["Тип", selected.type], ["Подано", selected.date]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{l}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Комментарий к решению</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Введите комментарий для заявителя..."
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(selected.id, "approved")}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm">
                <Icon name="CheckCircle" size={16} />Одобрить
              </button>
              <button onClick={() => updateStatus(selected.id, "review")}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2 text-sm">
                <Icon name="Clock" size={16} />В работу
              </button>
              <button onClick={() => updateStatus(selected.id, "rejected")}
                className="flex-1 bg-[hsl(var(--accent))] text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm">
                <Icon name="XCircle" size={16} />Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
