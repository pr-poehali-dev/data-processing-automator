import { useState } from "react";
import Icon from "@/components/ui/icon";

const documents = [
  { id: 1, name: "Паспорт РФ (стр. 2-3)", type: "Удостоверение личности", size: "1.2 МБ", date: "28.04.2026", status: "verified" },
  { id: 2, name: "Справка о регистрации", type: "Справка", size: "0.8 МБ", date: "25.04.2026", status: "verified" },
  { id: 3, name: "СНИЛС", type: "Страховое свидетельство", size: "0.4 МБ", date: "15.04.2026", status: "pending" },
  { id: 4, name: "Заявление № ЗАЯ-2026-00312", type: "Заявление", size: "0.2 МБ", date: "15.04.2026", status: "attached" },
  { id: 5, name: "Водительское удостоверение", type: "Удостоверение", size: "1.6 МБ", date: "01.03.2026", status: "verified" },
];

const statusMap: Record<string, { label: string; className: string; icon: string }> = {
  verified: { label: "Проверен", className: "bg-green-100 text-green-700", icon: "ShieldCheck" },
  pending: { label: "На проверке", className: "bg-yellow-100 text-yellow-700", icon: "Clock" },
  attached: { label: "Прикреплён", className: "bg-blue-100 text-blue-700", icon: "Paperclip" },
};

export default function DocumentsPage() {
  const [dragging, setDragging] = useState(false);

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
        {[
          { label: "Всего документов", value: "5", icon: "Files", color: "text-[hsl(var(--primary))]" },
          { label: "Проверено", value: "3", icon: "ShieldCheck", color: "text-green-600" },
          { label: "Занято места", value: "4.2 МБ", icon: "HardDrive", color: "text-amber-600" },
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
            {documents.map((doc) => {
              const s = statusMap[doc.status];
              return (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Icon name="FileText" size={16} className="text-[hsl(var(--primary))] flex-shrink-0" />
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground text-sm">{doc.type}</td>
                  <td className="text-muted-foreground text-sm">{doc.size}</td>
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
