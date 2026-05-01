-- Устанавливаем демо-пароли через bcrypt
-- 'Citizen123!' для граждан: $2b$12$K8EJFvCOHVKiRPbHGJv7OuaZ9LsXOEqUKg4e5TZ8iYt3.T4pFJn6i
-- 'Employee123!' для сотрудников: $2b$12$y6UBrQ5zOmw8K4q1cY8vvuqAOT5y7JjXqWbDzNPmTCbVQ0c7FXwWi
-- 'Admin123!' для администратора: $2b$12$yq3tAa7MvHJFqOyNI1u6YeEb1Y2aJbDHZhJThDBF.JlA1UvMFW0Mi
-- Для упрощения используем единый хэш 'Demo1234!' для всех пользователей
-- bcrypt hash of 'Demo1234!': $2b$12$mFMbCbFNNF5hKqZueBNqDOp9R.4s5f9D9b7lVn3Y4AQEYJzW9Uqjq
UPDATE users SET password_hash = '$2b$12$mFMbCbFNNF5hKqZueBNqDOp9R.4s5f9D9b7lVn3Y4AQEYJzW9Uqjq' WHERE password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKtYbJLxFz5YV.5O';
