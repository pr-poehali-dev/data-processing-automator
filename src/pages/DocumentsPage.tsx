import { useState, useEffect, useRef } from "react";
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

interface UploadingFile {
  name: string;
  progress: number;
}

const statusMap: Record<string, { label: string; className: string; icon: string }> = {
  verified: { label: "Проверен",    className: "bg-green-100 text-green-700",  icon: "ShieldCheck" },
  pending:  { label: "На проверке", className: "bg-yellow-100 text-yellow-700", icon: "Clock" },
  attached: { label: "Прикреплён",  className: "bg-blue-100 text-blue-700",    icon: "Paperclip" },
};

const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/jpg",
                 "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getDocuments(1).then((data: Document[]) => setDocuments(data)).finally(() => setLoading(false));
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files);
    const invalid = list.filter((f) => !ALLOWED.includes(f.type));
    if (invalid.length) {
      setError(`Недопустимый формат: ${invalid.map((f) => f.name).join(", ")}. Разрешены PDF, JPG, PNG, DOC.`);
      return;
    }
    const tooBig = list.filter((f) => f.size > 10 * 1024 * 1024);
    if (tooBig.length) {
      setError(`Файл слишком большой: ${tooBig.map((f) => f.name).join(", ")}. Максимум 10 МБ.`);
      return;
    }

    for (const file of list) {
      setUploading((prev) => [...prev, { name: file.name, progress: 0 }]);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise<void>((resolve) => {
        reader.onload = async () => {
          // Имитируем прогресс
          for (let p = 20; p <= 80; p += 20) {
            await new Promise((r) => setTimeout(r, 150));
            setUploading((prev) => prev.map((u) => u.name === file.name ? { ...u, progress: p } : u));
          }
          const base64 = (reader.result as string).split(',')[1];
          try {
            const doc = await api.uploadDocument(1, file.name, base64, file.type);
            setUploading((prev) => prev.map((u) => u.name === file.name ? { ...u, progress: 100 } : u));
            await new Promise((r) => setTimeout(r, 400));
            setDocuments((prev) => [doc, ...prev]);
          } catch {
            setError(`Ошибка при загрузке ${file.name}`);
          }
          setUploading((prev) => prev.filter((u) => u.name !== file.name));
          resolve();
        };
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

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
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragging
            ? "border-[hsl(var(--gov-blue-light))] bg-blue-50 scale-[1.01]"
            : "border-border hover:border-[hsl(var(--gov-blue-light))] hover:bg-blue-50/30"
        } animate-fade-in delay-100`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CloudUpload" size={26} className="text-[hsl(var(--gov-blue-light))]" />
        </div>
        <p className="font-semibold text-base mb-1">Перетащите файлы или нажмите для загрузки</p>
        <p className="text-sm text-muted-foreground mb-4">PDF, JPG, PNG, DOC — не более 10 МБ на файл</p>
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="bg-[hsl(var(--primary))] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2 mx-auto"
        >
          <Icon name="Upload" size={15} />
          Выбрать файлы
        </button>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
          <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto flex-shrink-0"><Icon name="X" size={14} /></button>
        </div>
      )}

      {/* Прогресс загрузки */}
      {uploading.length > 0 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-3 animate-fade-in">
          <p className="text-sm font-semibold text-muted-foreground">Загрузка файлов...</p>
          {uploading.map((u) => (
            <div key={u.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm truncate max-w-xs">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--primary))] rounded-full transition-all duration-200"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
              { label: "На проверке", value: String(documents.filter((d) => d.status === "pending").length), icon: "Clock", color: "text-amber-600" },
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
                    <td><div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0" /><div className="h-4 w-40 bg-gray-200 rounded animate-pulse" /></div></td>
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
                            <Icon name="Download" size={13} />Скачать
                          </button>
                          <button
                            onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                            className="text-red-500 hover:underline text-xs flex items-center gap-1"
                          >
                            <Icon name="Trash2" size={13} />Удалить
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
