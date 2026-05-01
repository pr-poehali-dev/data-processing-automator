
-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'employee', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    registered_at DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login_at DATE
);

-- Типы заявлений
CREATE TABLE application_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL UNIQUE
);

-- Заявления
CREATE TABLE applications (
    id VARCHAR(30) PRIMARY KEY,
    type VARCHAR(300) NOT NULL,
    description TEXT,
    citizen_id INTEGER REFERENCES users(id),
    citizen_name VARCHAR(200),
    submitted_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'review', 'approved', 'rejected', 'done')),
    urgency VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high')),
    comment TEXT
);

-- Документы
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100) NOT NULL,
    size_label VARCHAR(20),
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'attached')),
    user_id INTEGER REFERENCES users(id),
    application_id VARCHAR(30) REFERENCES applications(id)
);

-- Уведомления
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'error')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Журнал аудита
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(200) NOT NULL,
    action VARCHAR(200) NOT NULL,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===== ТЕСТОВЫЕ ДАННЫЕ =====

-- Пользователи
INSERT INTO users (name, email, role, status, registered_at, last_login_at) VALUES
('Иванов Иван Иванович',    'ivanov@mail.ru',   'citizen',  'active',  '2026-01-10', '2026-05-01'),
('Петрова Мария Сергеевна', 'petrova@gov.ru',   'employee', 'active',  '2025-02-15', '2026-05-01'),
('Сидоров Алексей Петрович','sidorov@mail.ru',  'citizen',  'blocked', '2026-03-03', '2026-04-20'),
('Козлова Елена Николаевна','kozlova@gov.ru',   'employee', 'active',  '2025-06-01', '2026-04-30'),
('Белов Константин Олегович','belov@mail.ru',   'citizen',  'active',  '2026-04-22', '2026-05-01');

-- Типы заявлений
INSERT INTO application_types (name) VALUES
('Справка о регистрации по месту жительства'),
('Выписка из Единого государственного реестра'),
('Замена удостоверяющего документа'),
('Справка об отсутствии судимости'),
('Регистрация транспортного средства'),
('Получение субсидии'),
('Социальная льгота'),
('Иное обращение');

-- Заявления
INSERT INTO applications (id, type, citizen_id, citizen_name, submitted_at, updated_at, status, urgency) VALUES
('ЗАЯ-2026-00346', 'Справка о регистрации по месту жительства',    1, 'Смирнов А.В.',   '2026-05-01', '2026-05-01', 'new',      'high'),
('ЗАЯ-2026-00345', 'Справка о регистрации по месту жительства',    1, 'Иванов И.И.',    '2026-04-28', '2026-04-30', 'approved', 'normal'),
('ЗАЯ-2026-00340', 'Замена удостоверяющего документа',             3, 'Козлова М.Н.',   '2026-04-30', '2026-04-30', 'new',      'low'),
('ЗАЯ-2026-00337', 'Социальная льгота',                            5, 'Белов К.О.',     '2026-04-28', '2026-04-29', 'review',   'high'),
('ЗАЯ-2026-00330', 'Получение субсидии',                           4, 'Новикова Т.П.',  '2026-04-25', '2026-04-27', 'review',   'normal'),
('ЗАЯ-2026-00312', 'Выписка из Единого государственного реестра',  1, 'Иванов И.И.',    '2026-04-15', '2026-04-25', 'review',   'normal'),
('ЗАЯ-2026-00289', 'Замена удостоверяющего документа',             1, 'Иванов И.И.',    '2026-04-02', '2026-04-20', 'done',     'normal'),
('ЗАЯ-2026-00201', 'Справка об отсутствии судимости',              1, 'Иванов И.И.',    '2026-03-10', '2026-03-18', 'rejected', 'normal'),
('ЗАЯ-2026-00178', 'Регистрация транспортного средства',           1, 'Иванов И.И.',    '2026-03-01', '2026-03-15', 'done',     'low');

-- Документы (привязаны к пользователю Иванов)
INSERT INTO documents (name, type, size_label, uploaded_at, status, user_id) VALUES
('Паспорт РФ (стр. 2-3)',           'Удостоверение личности',  '1.2 МБ', '2026-04-28', 'verified', 1),
('Справка о регистрации',           'Справка',                 '0.8 МБ', '2026-04-25', 'verified', 1),
('СНИЛС',                           'Страховое свидетельство', '0.4 МБ', '2026-04-15', 'pending',  1),
('Заявление № ЗАЯ-2026-00312',      'Заявление',               '0.2 МБ', '2026-04-15', 'attached', 1),
('Водительское удостоверение',      'Удостоверение',           '1.6 МБ', '2026-03-01', 'verified', 1);

-- Уведомления (для пользователя Иванов)
INSERT INTO notifications (user_id, title, body, type, read, created_at) VALUES
(1, 'Заявление одобрено',
   'Ваше заявление ЗАЯ-2026-00345 «Справка о регистрации» успешно одобрено. Документ готов к выдаче.',
   'success', false, NOW() - INTERVAL '2 hours'),
(1, 'Требуется дополнительный документ',
   'По заявлению ЗАЯ-2026-00312 необходимо предоставить копию СНИЛС. Срок подачи — 5 рабочих дней.',
   'warning', false, NOW() - INTERVAL '1 day'),
(1, 'Вход с нового устройства',
   'Выполнен вход в систему с нового устройства. Если это были не вы, смените пароль немедленно.',
   'info', false, NOW() - INTERVAL '3 days'),
(1, 'Заявление принято в работу',
   'Заявление ЗАЯ-2026-00312 «Выписка из реестра» передано сотруднику Петровой М.С. для рассмотрения.',
   'info', true, NOW() - INTERVAL '5 days'),
(1, 'Заявление исполнено',
   'Заявление ЗАЯ-2026-00289 «Замена документа» успешно исполнено. Обратитесь в МФЦ для получения.',
   'success', true, NOW() - INTERVAL '11 days'),
(1, 'Заявление отклонено',
   'Заявление ЗАЯ-2026-00201 «Справка об отсутствии судимости» отклонено. Причина: неполный пакет документов.',
   'error', true, NOW() - INTERVAL '48 days');

-- Журнал аудита
INSERT INTO audit_log (user_name, action, details, created_at) VALUES
('Иванов И.И.',    'Подача заявления',         'ЗАЯ-2026-00346',                       NOW() - INTERVAL '2 hours'),
('Петрова М.С.',   'Обработка заявления',      'ЗАЯ-2026-00312 → В работе',            NOW() - INTERVAL '5 hours'),
('Иванов И.И.',    'Вход в систему',           '2FA через email',                       NOW() - INTERVAL '6 hours'),
('Козлова Е.Н.',   'Одобрение заявления',      'ЗАЯ-2026-00345 → Одобрено',            NOW() - INTERVAL '1 day'),
('Администратор',  'Блокировка пользователя',  'Сидоров А.П. заблокирован',             NOW() - INTERVAL '2 days'),
('Белов К.О.',     'Загрузка документа',       'Паспорт РФ',                            NOW() - INTERVAL '3 days');
