import { useState } from "react";
import Icon from "@/components/ui/icon";

const applications = [
  { id: "ЗАЯ-2026-00346", citizen: "Смирнов А.В.", type: "Справка о регистрации", submitted: "01.05.2026", status: "new", urgency: "high" },
  { id: "ЗАЯ-2026-00312", citizen: "Иванов И.И.", type: "Выписка из реестра", submitted: "15.04.2026", status: "review", urgency: "normal" },
  { id: "ЗАЯ-2026-00340", citizen: "Козлова М.Н.", type: "Замена документа", submitted: "30.04.2026", status: "new", urgency: "low" },
  { id: "ЗАЯ-2026-00337", citizen: "Белов К.О.", type: "Социальная льгота", submitted: "28.04.2026", status: "review", urgency: "high" },
  { id: "ЗАЯ-2026-00330", citizen: "Новикова Т.П.", type: "Получение субсидии", submitted: "25.04.2026", status: "review", urgency: "normal" },
];

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
  const [apps, setApps] = useState(applications);
  const [selected, setSelected] = useState<typeof applications[0] | null>(null);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("all");

  const updateStatus = (id: string, status: string) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setSelected(null);
    setComment("");
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const stats = [
    { label: "Новые заявления", value: apps.filter((a) => a.status === "new").length, color: "bg-blue-600", icon: "FilePlus" },
    { label: "В работе", value: apps.filter((a) => a.status === "review").length, color: "bg-amber-500", icon: "Clock" },
    { label: "Одобрено сегодня", value: apps.filter((a) => a.status === "approved").length, color: "bg-green-600", icon: "CheckCircle" },
    { label: "Отклонено", value: apps.filter((a) => a.status === "rejected").length, color: "bg-red-600", icon: "XCircle" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Рабочий стол</h1>
        <p className="text-muted-foreground text-sm mt-1">Обработка поступивших заявлений</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in delay-100">
        {stats.map((s) => (
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

      {/* Фильтры */}
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

      {/* Таблица */}
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
            {filtered.map((app) => {
              const sc = statusConfig[app.status] || statusConfig.new;
              const ug = urgencyConfig[app.urgency];
              return (
                <tr key={app.id}>
                  <td><span className="font-mono text-sm font-semibold text-[hsl(var(--primary))]">{app.id}</span></td>
                  <td className="font-medium text-sm">{app.citizen}</td>
                  <td className="text-sm text-muted-foreground max-w-[180px] truncate">{app.type}</td>
                  <td className="text-sm text-muted-foreground">{app.submitted}</td>
                  <td><span className={`text-xs font-semibold ${ug.color}`}>{ug.label}</span></td>
                  <td><span className={`${sc.className} text-xs font-medium px-2.5 py-1 rounded-full`}>{sc.label}</span></td>
                  <td>
                    <button
                      onClick={() => setSelected(app)}
                      className="text-[hsl(var(--gov-blue-light))] hover:underline text-xs flex items-center gap-1"
                    >
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

      {/* Модалка обработки */}
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
              {[["Заявитель", selected.citizen], ["Тип", selected.type], ["Подано", selected.submitted]].map(([l, v]) => (
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
              <button
                onClick={() => updateStatus(selected.id, "approved")}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <Icon name="CheckCircle" size={16} />
                Одобрить
              </button>
              <button
                onClick={() => updateStatus(selected.id, "review")}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2 text-sm"
              >
                <Icon name="Clock" size={16} />
                В работу
              </button>
              <button
                onClick={() => updateStatus(selected.id, "rejected")}
                className="flex-1 bg-[hsl(var(--accent))] text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <Icon name="XCircle" size={16} />
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
