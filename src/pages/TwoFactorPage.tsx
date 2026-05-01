import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface TwoFactorPageProps {
  onVerify: () => void;
  onBack: () => void;
  method?: "email" | "sms";
}

export default function TwoFactorPage({ onVerify, onBack, method = "email" }: TwoFactorPageProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setResendTimer((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const full = code.join("");
    if (full.length < 6) {
      setError("Введите все 6 цифр кода");
      return;
    }
    setError("");
    onVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--gov-bg))] flex flex-col">
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
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--gov-blue-light))] rounded-full mb-4 shadow-lg relative">
              <Icon name="KeyRound" size={28} className="text-white" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center">
                <Icon name="Lock" size={11} className="text-white" />
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Подтверждение входа</h1>
            <p className="text-sm text-muted-foreground">
              Код отправлен на ваш {method === "email" ? "email-адрес" : "номер телефона"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-border p-6 space-y-6">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
              <Icon name={method === "email" ? "Mail" : "Smartphone"} size={18} className="text-[hsl(var(--gov-blue-light))] shrink-0" />
              <p className="text-sm text-[hsl(var(--foreground))]">
                {method === "email"
                  ? "Введите 6-значный код из письма"
                  : "Введите 6-значный код из SMS"}
              </p>
            </div>

            {/* Поля ввода кода */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`otp-input ${digit ? "border-[hsl(var(--gov-blue-light))] bg-blue-50" : ""}`}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 animate-scale-in">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(220,72%,20%)] text-white font-semibold py-2.5 rounded-lg transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Icon name="CheckCircle" size={16} />
              Подтвердить
            </button>

            <div className="flex items-center justify-between text-sm">
              <button onClick={onBack} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                <Icon name="ChevronLeft" size={14} />
                Назад
              </button>
              <button
                disabled={resendTimer > 0}
                className="text-[hsl(var(--gov-blue-light))] disabled:text-muted-foreground disabled:cursor-not-allowed transition"
              >
                {resendTimer > 0 ? `Отправить снова (${resendTimer}с)` : "Отправить снова"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
