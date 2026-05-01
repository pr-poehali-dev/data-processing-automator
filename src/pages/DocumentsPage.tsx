import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Document {
  id: number;
  name: string;
  type: string;
  size_label: string;
  date: string;
  status: string;
}

const statusMap: Record<string, { label: string; className: string; icon: string }> = {
  verified: { label: "Проверен", className: "bg-green-100 text-green-700", icon: "ShieldCheck" },
  pending: { label: "На проверке", className: "bg-yellow-100 text-yellow-700", icon: "Clock" },
  attached: { label: "Прикреплён", className: "bg-blue-100 text-blue-700", icon: "Paperclip" },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    api.getDocuments(1).then((data) => setDocuments(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Документы</h1>
        <p className="text-muted-foreground text-sm mt-1">Хранилище загруженных документов</p>
      </div>

      {/* Зона загрузки */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragging
            ? "border-[hsl(var(--gov-blue-light))] bg-blue-50 scale-[1.01]"
            : "border-border hover:border-[hsl(var(--gov-blue-light))] hover:bg-blue-50/30"
        } animate-fade-in delay-100`}
      >
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CloudUpload" size={26} className="text-[hsl(var(--gov-blue-light))]" />
        </div>
        <p className="font-semibold text-base mb-1">Перетащите файлы или нажмите для загрузки</p>
        <p className="text-sm text-muted-foreground mb-4">PDF, JPG, PNG — не более 10 МБ на файл</p>
        <button className="bg-[hsl(var(--primary))] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2 mx-auto">
          <Icon name="Upload" size={15} />
          Выбрать файлы
        </button>
      </div>

      {/* Статистика хранилища */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in delay-200">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))
          : [
              { label: "Всего документов", value: String(documents.length), icon: "Files", color: "text-[hsl(var(--primary))]" },
              { label: "Проверено", value: String(documents.filter((d) => d.status === "verified").length), icon: "ShieldCheck", color: "text-green-600" },
              { label: "Занято места", value: "— МБ", icon: "HardDrive", color: "text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
                <Icon name={stat.icon} size={20} className={stat.color} />
                <div>
                  <div className="font-bold text-lg leading-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
      </div>

      {/* Список документов */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in delay-300">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Icon name="FolderOpen" size={16} className="text-[hsl(var(--primary))]" />
            Загруженные документы
          </h2>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Размер</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </td>
                    <td><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-4 w-14 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
                    <td><div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              : documents.map((doc) => {
                  const s = statusMap[doc.status] ?? { label: doc.status, className: "bg-gray-100 text-gray-700", icon: "File" };
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Icon name="FileText" size={16} className="text-[hsl(var(--primary))] flex-shrink-0" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground text-sm">{doc.type}</td>
                      <td className="text-muted-foreground text-sm">{doc.size_label}</td>
                      <td className="text-muted-foreground text-sm">{doc.date}</td>
                      <td>
                        <span className={`${s.className} text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit`}>
                          <Icon name={s.icon} size={12} />
                          {s.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-[hsl(var(--gov-blue-light))] hover:underline text-xs flex items-center gap-1">
                            <Icon name="Download" size={13} />
                            Скачать
                          </button>
                          <button className="text-red-500 hover:underline text-xs flex items-center gap-1">
                            <Icon name="Trash2" size={13} />
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
