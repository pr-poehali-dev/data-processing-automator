import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LoginPageProps {
  onLogin: (role: "citizen" | "employee" | "admin") => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"citizen" | "employee" | "admin">("citizen");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }
    setError("");
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--gov-bg))] flex flex-col">
      {/* Шапка */}
      <header className="bg-[hsl(var(--gov-stripe))] text-white">
        <div className="tricolor-bar" />
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-[hsl(var(--gov-stripe))]" />
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-widest">Российская Федерация</div>
            <div className="font-bold text-lg tracking-tight">ГосПортал</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--primary))] rounded-full mb-4 shadow-lg">
              <Icon name="ShieldCheck" size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">
              Вход в систему
            </h1>
            <p className="text-sm text-muted-foreground">
              Единая система обращений граждан
            </p>
          </div>

          {/* Форма */}
          <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
            {/* Выбор роли */}
            <div className="grid grid-cols-3 border-b border-border">
              {(["citizen", "employee", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 text-xs font-semibold transition-all ${
                    role === r
                      ? "bg-[hsl(var(--primary))] text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {r === "citizen" ? "Гражданин" : r === "employee" ? "Сотрудник" : "Администратор"}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Электронная почта
                </label>
                <div className="relative">
                  <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gov.ru"
                    className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Пароль
                </label>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gov-blue-light))] transition"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 animate-scale-in">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(220,72%,20%)] text-white font-semibold py-2.5 rounded-lg transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Icon name="LogIn" size={16} />
                Войти
              </button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Shield" size={12} className="text-[hsl(var(--gov-blue-light))]" />
                <span>Вход защищён двухфакторной аутентификацией</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            © 2026 ГосПортал. Официальный государственный ресурс.
          </p>
        </div>
      </div>
    </div>
  );
}