"""
Главный API для ГосПортала: заявления, документы, уведомления, пользователи, аудит.
Роутинг через query-параметр ?action=
"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ok(data):
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, code=400):
    return {'statusCode': code, 'headers': CORS, 'body': json.dumps({'error': msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # === ЗАЯВЛЕНИЯ ===
        if action == 'applications' and method == 'GET':
            user_id = params.get('user_id')
            status = params.get('status')
            query = """
                SELECT id, type, citizen_id, citizen_name,
                       to_char(submitted_at,'DD.MM.YYYY') as date,
                       to_char(updated_at,'DD.MM.YYYY') as updated,
                       status, urgency, comment
                FROM applications WHERE 1=1
            """
            args = []
            if user_id:
                query += ' AND citizen_id = %s'
                args.append(int(user_id))
            if status:
                query += ' AND status = %s'
                args.append(status)
            query += ' ORDER BY submitted_at DESC'
            cur.execute(query, args)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            labels = {'new':'Новое','review':'На рассмотрении','approved':'Одобрено','rejected':'Отклонено','done':'Исполнено'}
            for r in rows:
                r['statusLabel'] = labels.get(r['status'], r['status'])
            return ok(rows)

        if action == 'applications' and method == 'POST':
            cur.execute("SELECT COUNT(*) FROM applications")
            count = cur.fetchone()[0]
            new_id = f"ЗАЯ-2026-{count + 1:05d}"
            cur.execute("""
                INSERT INTO applications (id, type, description, citizen_id, citizen_name, status, urgency)
                VALUES (%s, %s, %s, %s, %s, 'new', %s)
            """, (new_id, body.get('type',''), body.get('description',''),
                  body.get('citizen_id'), body.get('citizen_name',''), body.get('urgency','normal')))
            cur.execute("INSERT INTO audit_log (user_name, action, details) VALUES (%s, %s, %s)",
                        (body.get('citizen_name','Гражданин'), 'Подача заявления', new_id))
            conn.commit()
            return ok({'id': new_id, 'message': 'Заявление подано'})

        if action == 'update_application' and method == 'POST':
            app_id = body.get('id')
            new_status = body.get('status')
            comment = body.get('comment', '')
            cur.execute("""
                UPDATE applications SET status=%s, comment=%s, updated_at=CURRENT_DATE WHERE id=%s
            """, (new_status, comment, app_id))
            cur.execute("INSERT INTO audit_log (user_name, action, details) VALUES (%s, %s, %s)",
                        (body.get('employee_name','Сотрудник'), 'Обновление статуса', f'{app_id} → {new_status}'))
            conn.commit()
            return ok({'message': 'Статус обновлён'})

        # === ДОКУМЕНТЫ ===
        if action == 'documents' and method == 'GET':
            user_id = params.get('user_id', '1')
            cur.execute("""
                SELECT id, name, type, size_label,
                       to_char(uploaded_at,'DD.MM.YYYY') as date,
                       status, user_id, application_id
                FROM documents WHERE user_id=%s ORDER BY uploaded_at DESC
            """, (int(user_id),))
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # === УВЕДОМЛЕНИЯ ===
        if action == 'notifications' and method == 'GET':
            user_id = params.get('user_id', '1')
            cur.execute("""
                SELECT id, title, body, type, read,
                       to_char(created_at,'DD.MM.YYYY HH24:MI') as time
                FROM notifications WHERE user_id=%s ORDER BY created_at DESC
            """, (int(user_id),))
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        if action == 'read_notification' and method == 'POST':
            notif_id = body.get('id')
            cur.execute("UPDATE notifications SET read=true WHERE id=%s", (int(notif_id),))
            conn.commit()
            return ok({'message': 'Отмечено прочитанным'})

        if action == 'read_all_notifications' and method == 'POST':
            user_id = body.get('user_id', 1)
            cur.execute("UPDATE notifications SET read=true WHERE user_id=%s", (int(user_id),))
            conn.commit()
            return ok({'message': 'Все прочитаны'})

        # === ПОЛЬЗОВАТЕЛИ ===
        if action == 'users' and method == 'GET':
            cur.execute("""
                SELECT id, name, email, role, status,
                       to_char(registered_at,'DD.MM.YYYY') as registered,
                       to_char(last_login_at,'DD.MM.YYYY') as last_login
                FROM users ORDER BY id
            """)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        if action == 'update_user' and method == 'POST':
            user_id = body.get('id')
            new_status = body.get('status')
            new_role = body.get('role')
            if new_status:
                cur.execute("UPDATE users SET status=%s WHERE id=%s", (new_status, int(user_id)))
                cur.execute("INSERT INTO audit_log (user_name, action, details) VALUES (%s,%s,%s)",
                            ('Администратор', 'Изменение статуса пользователя', f'user_id={user_id} → {new_status}'))
            if new_role:
                cur.execute("UPDATE users SET role=%s WHERE id=%s", (new_role, int(user_id)))
            conn.commit()
            return ok({'message': 'Обновлено'})

        # === АУДИТ ===
        if action == 'audit' and method == 'GET':
            cur.execute("""
                SELECT id, user_name, action, details,
                       to_char(created_at,'DD.MM.YYYY HH24:MI') as time
                FROM audit_log ORDER BY created_at DESC LIMIT 100
            """)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # === ТИПЫ ЗАЯВЛЕНИЙ ===
        if action == 'application_types' and method == 'GET':
            cur.execute("SELECT name FROM application_types ORDER BY id")
            rows = [r[0] for r in cur.fetchall()]
            return ok(rows)

        # === ДАШБОРД ===
        if action == 'dashboard' and method == 'GET':
            user_id = params.get('user_id', '1')
            cur.execute("""
                SELECT
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE status IN ('new','review')) as pending,
                    COUNT(*) FILTER (WHERE status = 'approved') as approved,
                    COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
                    COUNT(*) FILTER (WHERE status = 'done') as done
                FROM applications WHERE citizen_id=%s
            """, (int(user_id),))
            row = cur.fetchone()
            stats = {'total': row[0], 'pending': row[1], 'approved': row[2], 'rejected': row[3], 'done': row[4]}

            cur.execute("""
                SELECT id, type, to_char(submitted_at,'DD.MM.YYYY') as date, status
                FROM applications WHERE citizen_id=%s ORDER BY submitted_at DESC LIMIT 3
            """, (int(user_id),))
            cols = [d[0] for d in cur.description]
            recent = [dict(zip(cols, r)) for r in cur.fetchall()]
            labels = {'new':'Новое','review':'На рассмотрении','approved':'Одобрено','rejected':'Отклонено','done':'Исполнено'}
            for r in recent:
                r['statusLabel'] = labels.get(r['status'], r['status'])

            cur.execute("""
                SELECT id, title, type, read, to_char(created_at,'DD.MM.YYYY HH24:MI') as time
                FROM notifications WHERE user_id=%s ORDER BY created_at DESC LIMIT 3
            """, (int(user_id),))
            cols = [d[0] for d in cur.description]
            notifs = [dict(zip(cols, r)) for r in cur.fetchall()]

            return ok({'stats': stats, 'recent_applications': recent, 'notifications': notifs})

        return err(f'Unknown action: {action}', 404)

    finally:
        cur.close()
        conn.close()
