import { useState } from "react";
import Icon from "@/components/ui/icon";

const users = [
  { id: 1, name: "Иванов Иван Иванович", email: "ivanov@mail.ru", role: "citizen", status: "active", registered: "10.01.2026", lastLogin: "01.05.2026" },
  { id: 2, name: "Петрова Мария Сергеевна", email: "petrova@gov.ru", role: "employee", status: "active", registered: "15.02.2025", lastLogin: "01.05.2026" },
  { id: 3, name: "Сидоров Алексей Петрович", email: "sidorov@mail.ru", role: "citizen", status: "blocked", registered: "03.03.2026", lastLogin: "20.04.2026" },
  { id: 4, name: "Козлова Елена Николаевна", email: "kozlova@gov.ru", role: "employee", status: "active", registered: "01.06.2025", lastLogin: "30.04.2026" },
  { id: 5, name: "Белов Константин Олегович", email: "belov@mail.ru", role: "citizen", status: "active", registered: "22.04.2026", lastLogin: "01.05.2026" },
];

const auditLog = [
  { id: 1, user: "Иванов И.И.", action: "Подача заявления", details: "ЗАЯ-2026-00346", time: "01.05.2026 10:34" },
  { id: 2, user: "Петрова М.С.", action: "Обработка заявления", details: "ЗАЯ-2026-00312 → В работе", time: "01.05.2026 09:15" },
  { id: 3, user: "Иванов И.И.", action: "Вход в систему", details: "2FA через email", time: "01.05.2026 09:02" },
  { id: 4, user: "Козлова Е.Н.", action: "Одобрение заявления", details: "ЗАЯ-2026-00345 → Одобрено", time: "30.04.2026 16:47" },
  { id: 5, user: "Администратор", action: "Блокировка пользователя", details: "Сидоров А.П. заблокирован", time: "29.04.2026 11:30" },
  { id: 6, user: "Белов К.О.", action: "Загрузка документа", details: "Паспорт РФ", time: "28.04.2026 14:22" },
];

const roleConfig: Record<string, { label: string; className: string }> = {
  citizen: { label: "Гражданин", className: "bg-blue-100 text-blue-700" },
  employee: { label: "Сотрудник", className: "bg-purple-100 text-purple-700" },
  admin: { label: "Администратор", className: "bg-orange-100 text-orange-700" },
};

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"users" | "audit">("users");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <p className="text-muted-foreground text-sm mt-1">Роли, доступы и журнал аудита</p>
      </div>

      {/* Вкладки */}
      <div className="flex gap-0 border-b border-border animate-fade-in delay-100">
        {[
          { key: "users", label: "Пользователи", icon: "Users" },
          { key: "audit", label: "Журнал аудита", icon: "ClipboardList" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "users" | "audit")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <div className="space-y-4 animate-fade-in">
          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Всего пользователей", value: users.length, icon: "Users", color: "bg-blue-600" },
              { label: "Активных", value: users.filter((u) => u.status === "active").length, icon: "UserCheck", color: "bg-green-600" },
              { label: "Заблокированных", value: users.filter((u) => u.status === "blocked").length, icon: "UserX", color: "bg-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
                <div className={`${s.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon name={s.icon} size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Поиск и таблица */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-3">
              <Icon name="Search" size={16} className="text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по имени или email..."
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Регистрация</th>
                  <th>Последний вход</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const rc = roleConfig[user.role];
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center text-[hsl(var(--primary))] font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground text-sm">{user.email}</td>
                      <td><span className={`${rc.className} text-xs font-medium px-2.5 py-1 rounded-full`}>{rc.label}</span></td>
                      <td className="text-muted-foreground text-sm">{user.registered}</td>
                      <td className="text-muted-foreground text-sm">{user.lastLogin}</td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.status === "active" ? "Активен" : "Заблокирован"}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-[hsl(var(--gov-blue-light))] hover:underline text-xs flex items-center gap-1">
                            <Icon name="Edit" size={13} />
                            Изменить
                          </button>
                          <button className={`text-xs flex items-center gap-1 ${user.status === "active" ? "text-red-500 hover:underline" : "text-green-600 hover:underline"}`}>
                            <Icon name={user.status === "active" ? "UserX" : "UserCheck"} size={13} />
                            {user.status === "active" ? "Блок" : "Разблок"}
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
      )}

      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Icon name="ClipboardList" size={16} className="text-[hsl(var(--primary))]" />
            <h2 className="font-semibold">Журнал действий в системе</h2>
          </div>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Действие</th>
                <th>Детали</th>
                <th>Дата и время</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center text-[hsl(var(--primary))] font-bold text-[10px]">
                        {entry.user.charAt(0)}
                      </div>
                      <span className="text-sm">{entry.user}</span>
                    </div>
                  </td>
                  <td className="font-medium text-sm">{entry.action}</td>
                  <td className="text-muted-foreground text-sm">{entry.details}</td>
                  <td className="text-muted-foreground text-xs font-mono">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
