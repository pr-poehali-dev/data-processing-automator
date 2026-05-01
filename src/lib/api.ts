const BASE_URL = 'https://functions.poehali.dev/90daefe7-bd91-42bd-ae14-aa4a420247c3';

async function request(action: string, method = 'GET', params: Record<string, string> = {}, body?: object) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${BASE_URL}?${qs}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    // Функция может вернуть тело как строку JSON внутри JSON
    if (typeof parsed === 'string') return JSON.parse(parsed);
    return parsed;
  } catch {
    return text;
  }
}

export const api = {
  // Дашборд
  getDashboard: (userId = 1) => request('dashboard', 'GET', { user_id: String(userId) }),

  // Заявления
  getApplications: (params?: { user_id?: number; status?: string }) =>
    request('applications', 'GET', {
      ...(params?.user_id ? { user_id: String(params.user_id) } : {}),
      ...(params?.status ? { status: params.status } : {}),
    }),
  createApplication: (data: object) => request('applications', 'POST', {}, data),
  updateApplication: (data: object) => request('update_application', 'POST', {}, data),

  // Документы
  getDocuments: (userId = 1) => request('documents', 'GET', { user_id: String(userId) }),

  // Уведомления
  getNotifications: (userId = 1) => request('notifications', 'GET', { user_id: String(userId) }),
  markNotificationRead: (id: number) => request('read_notification', 'POST', {}, { id }),
  markAllRead: (userId = 1) => request('read_all_notifications', 'POST', {}, { user_id: userId }),

  // Пользователи
  getUsers: () => request('users', 'GET'),
  updateUser: (data: object) => request('update_user', 'POST', {}, data),

  // Аудит
  getAudit: () => request('audit', 'GET'),

  // Типы заявлений
  getApplicationTypes: () => request('application_types', 'GET'),
};