import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";


interface NewApplicationPageProps {
  onNavigate: (page: string) => void;
}

export default function NewApplicationPage({ onNavigate }: NewApplicationPageProps) {
  const [applicationTypes, setApplicationTypes] = useState<string[]>([]);
  const [newId, setNewId] = useState("ЗАЯ-2026-...");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: "",
    description: "",
    urgency: "normal",
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    passportSeries: "",
    passportNumber: "",
    phone: "",
    email: "ivanov@mail.ru",
    address: "",
    files: [] as string[],
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getApplicationTypes().then((types: string[]) => setApplicationTypes(types));
  }, []);

  const update = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    api.createApplication({
      type: form.type,
      description: form.description,
      urgency: form.urgency,
      citizen_id: 1,
      citizen_name: `${form.lastName} ${form.firstName[0]}.${form.middleName[0]}.`,
    }).then((res: { id?: string }) => {
      if (res.id) setNewId(res.id);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Заявление подано!</h2>
          <p className="text-muted-foreground mb-2">Ваше заявление успешно зарегистрировано в системе.</p>
          <div className="inline-block bg-blue-50 rounded-lg px-4 py-2 mb-6">
            <span className="font-mono font-bold text-[hsl(var(--primary))] text-lg">{newId}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Уведомление об изменении статуса придёт на {form.email}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate("applications")}
              className="bg-[hsl(var(--primary))] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2"
            >
              <Icon name="List" size={16} />
              К списку заявлений
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm((f) => ({ ...f, type: "", description: "" })); }}
              className="border border-border px-6 py-2.5 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Подать ещё
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Подача заявления</h1>
        <p className="text-muted-foreground text-sm mt-1">Заполните форму для подачи обращения</p>
      </div>

      {/* Прогресс */}
      <div className="flex items-center gap-0 animate-fade-in delay-100">
        {["Тип обращения", "Данные заявителя", "Документы", "Подтверждение"].map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              i + 1 < step ? "bg-green-600 text-white" :
              i + 1 === step ? "bg-[hsl(var(--primary))] text-white ring-4 ring-[hsl(var(--primary))]/20" :
              "bg-gray-200 text-gray-400"
            }`}>
              {i + 1 < step ? <Icon name="Check" size={12} /> : i + 1}
            </div>
            <span className="text-[11px] mx-1 text-muted-foreground hidden sm:block">{s}</span>
            {i < 3 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "bg-green-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Шаг 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Тип обращения</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Вид заявления <span className="text-red-500">*</span></label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]"
            >
              <option value="">— Выберите тип —</option>
              {applicationTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Описание обращения <span className="text-red-500">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              placeholder="Опишите суть вашего обращения подробно..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Срочность</label>
            <div className="flex gap-3">
              {[
                { value: "low", label: "Обычная", color: "border-green-400 text-green-700" },
                { value: "normal", label: "Стандартная", color: "border-blue-400 text-blue-700" },
                { value: "high", label: "Срочная", color: "border-red-400 text-red-700" },
              ].map((u) => (
                <button
                  key={u.value}
                  onClick={() => update("urgency", u.value)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition ${
                    form.urgency === u.value ? u.color + " bg-opacity-10" : "border-border text-muted-foreground"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              disabled={!form.type || !form.description}
              onClick={() => setStep(2)}
              className="bg-[hsl(var(--primary))] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2"
            >
              Далее <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Шаг 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Данные заявителя</h2>
          <div className="grid grid-cols-3 gap-3">
            {["lastName", "firstName", "middleName"].map((field, i) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1.5">
                  {["Фамилия", "Имя", "Отчество"][i]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form[field as keyof typeof form] as string}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Серия паспорта</label>
              <input type="text" value={form.passportSeries} onChange={(e) => update("passportSeries", e.target.value)} placeholder="0000" maxLength={4}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Номер паспорта</label>
              <input type="text" value={form.passportNumber} onChange={(e) => update("passportNumber", e.target.value)} placeholder="000000" maxLength={6}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Телефон</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+7 (___) ___-__-__"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Электронная почта</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Адрес регистрации</label>
            <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))]" />
          </div>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="border border-border px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary transition flex items-center gap-2">
              <Icon name="ChevronLeft" size={16} /> Назад
            </button>
            <button onClick={() => setStep(3)} className="bg-[hsl(var(--primary))] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2">
              Далее <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Шаг 3 */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Прикрепление документов</h2>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-[hsl(var(--gov-blue-light))] transition cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
              <Icon name="Upload" size={22} className="text-[hsl(var(--gov-blue-light))]" />
            </div>
            <p className="font-medium text-sm">Нажмите для загрузки или перетащите файлы</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · не более 10 МБ каждый</p>
          </div>
          <div className="space-y-2">
            {["Копия паспорта (стр. 2-3)", "Заявление установленного образца"].map((doc) => (
              <div key={doc} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2.5">
                <Icon name="FileCheck" size={16} className="text-green-600" />
                <span className="text-sm flex-1">{doc}</span>
                <span className="text-xs text-green-700 font-medium">Загружен</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="border border-border px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary transition flex items-center gap-2">
              <Icon name="ChevronLeft" size={16} /> Назад
            </button>
            <button onClick={() => setStep(4)} className="bg-[hsl(var(--primary))] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[hsl(220,72%,20%)] transition flex items-center gap-2">
              Далее <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Шаг 4 */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Подтверждение</h2>
          <div className="space-y-2">
            {[
              ["Тип заявления", form.type],
              ["Заявитель", `${form.lastName} ${form.firstName} ${form.middleName}`],
              ["Контакт", form.email],
              ["Срочность", form.urgency === "high" ? "Срочная" : form.urgency === "low" ? "Обычная" : "Стандартная"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[hsl(var(--primary))]" />
            <span className="text-sm text-muted-foreground">
              Я подтверждаю достоверность указанных сведений и даю согласие на обработку персональных данных
            </span>
          </label>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className="border border-border px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary transition flex items-center gap-2">
              <Icon name="ChevronLeft" size={16} /> Назад
            </button>
            <button
              disabled={!form.agree}
              onClick={handleSubmit}
              className="bg-[hsl(var(--accent))] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
            >
              <Icon name="Send" size={16} />
              Подать заявление
            </button>
          </div>
        </div>
      )}
    </div>
  );
}