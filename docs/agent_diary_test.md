# 🧪 Agent Diary Enhanced - Тестовый План

> Полный тест всего нового функционала

---

## 📋 Что тестируем:

1. **Session Tracking** (Pending → Confirm)
2. **Terminal Command Logging**
3. **Session Statistics**
4. **API Endpoints**

---

## 🧪 ТЕСТ 1: Session Auto-Start/End

### Цель:
Проверить что сессия начинается при первом изменении и заканчивается при Confirm.

### Шаги:
1. **F5** — перезапусти расширение
2. **Открой** любой файл проекта (например `README.md`)
3. **Измени** файл (добавь строку текста)
4. **Ctrl+S** — сохрани
5. **Открой** `.localhub/agent/{today}_session.md`

### ✅ Ожидаемый результат:
```markdown
## 🚀 Session #xxxxxxxx started at HH:MM:SS

- [HH:MM:SS] MODIFIED: `README.md`
```

6. **Измени** ещё 2 файла
7. **Открой** Pending Changes → нажми **OK** (Confirm)
8. **Снова открой** `.localhub/agent/{today}_session.md`

### ✅ Ожидаемый результат:
```markdown
## 🏁 Session #xxxxxxxx ended at HH:MM:SS

### 📊 Session Statistics:
| Metric | Value |
|--------|-------|
| Duration | Xm Ys |
| Files Changed | 3 |
| Total Actions | 3 |
| Terminal Commands | 0 |
| Intent | (последнее сообщение из чата) |
| Commit Comment | TM #XX |
```

---

## 🧪 ТЕСТ 2: Terminal Command Logging

### Цель:
Проверить что терминальные команды логируются.

### Способ 1: Через API напрямую

1. Открой терминал
2. Выполни:
```bash
curl -X POST "http://127.0.0.1:19876/agent/terminal" \
  -H "Content-Type: application/json" \
  -d "{\"command\": \"npm run compile\", \"exit_code\": 0, \"duration_ms\": 3200, \"output_summary\": \"Build successful\"}"
```

3. **Открой** `.localhub/agent/{today}_session.md`

### ✅ Ожидаемый результат:
```markdown
- [HH:MM:SS] 💻 TERMINAL ✅: `npm run compile` (3200ms)
  → Build successful
```

### Способ 2: Реальная команда (если интегрирован в extension.ts)

1. Открой встроенный терминал VS Code
2. Выполни `npm run compile`
3. **Проверь** session.md — должна появиться запись

---

## 🧪 ТЕСТ 3: Session Statistics API

### Цель:
Проверить что API возвращает статистику активной сессии.

### Шаги:

1. **Начни новую сессию** (измени файл, не коммить)
2. В браузере открой: `http://127.0.0.1:19876/agent/session`

### ✅ Ожидаемый результат:
```json
{
  "ok": true,
  "active": true,
  "session_id": "a1b2c3d4",
  "duration_seconds": 120,
  "files_changed": 2,
  "actions_count": 5,
  "terminal_commands": 1
}
```

3. **Нажми Confirm** (OK)
4. **Снова открой** `http://127.0.0.1:19876/agent/session`

### ✅ Ожидаемый результат:
```json
{
  "ok": true,
  "active": false
}
```

---

## 🧪 ТЕСТ 4: Счётчики (Counters)

### Цель:
Проверить что счётчики files_changed, actions_count работают правильно.

### Шаги:

1. **Начни новую сессию**
2. **Измени 5 файлов** (каждый сохрани Ctrl+S)
3. **Залогируй 2 команды** через API (см. Тест 2)
4. **Открой** `http://127.0.0.1:19876/agent/session`

### ✅ Ожидаемый результат:
```json
{
  "files_changed": 5,
  "actions_count": 7,  // 5 файлов + 2 команды
  "terminal_commands": 2
}
```

5. **Confirm** → проверь статистику в session.md

---

## 🧪 ТЕСТ 5: Duration (Время сессии)

### Цель:
Проверить что duration считается правильно.

### Шаги:

1. **Начни сессию**
2. **Подожди 2 минуты** (можешь что-то редактировать)
3. **Confirm**
4. **Открой** session.md

### ✅ Ожидаемый результат:
```markdown
| Duration | 2m XXs |
```

---

## 🧪 ТЕСТ 6: Несколько сессий подряд

### Цель:
Проверить что после Confirm можно начать новую сессию.

### Шаги:

1. **Сессия 1:** Измени файл → Confirm
2. **Сессия 2:** Измени файл → Confirm
3. **Открой** session.md

### ✅ Ожидаемый результат:
```markdown
## 🚀 Session #aaaaaaaa started at HH:MM:SS
...
## 🏁 Session #aaaaaaaa ended at HH:MM:SS
...

## 🚀 Session #bbbbbbbb started at HH:MM:SS
...
## 🏁 Session #bbbbbbbb ended at HH:MM:SS
...
```

---

## 🧪 ТЕСТ 7: Empty State (без сессии)

### Цель:
Проверить API когда сессия не активна.

### Шаги:

1. **Убедись что нет активной сессии** (после Confirm)
2. **Открой** `http://127.0.0.1:19876/agent/session`

### ✅ Ожидаемый результат:
```json
{
  "ok": true,
  "active": false
}
```

---

## 📊 Общий чеклист:

- [ ] Session auto-start при первом изменении
- [ ] Session auto-end при Confirm
- [ ] Terminal команды логируются
- [ ] Files changed считается правильно
- [ ] Actions count считается правильно
- [ ] Terminal commands считается правильно
- [ ] Duration в минутах/секундах
- [ ] API `/agent/session` работает
- [ ] API `/agent/terminal` работает
- [ ] Несколько сессий подряд
- [ ] Session.md содержит статистику
- [ ] Session ID уникальный
- [ ] Intent Sniffer достаёт последнее сообщение

---

## 🚀 Быстрый тест (за 2 минуты):

```bash
# 1. Начни сессию
echo "test" >> test.txt && code test.txt

# 2. Залогируй команду
curl -X POST "http://127.0.0.1:19876/agent/terminal" \
  -d '{"command":"test", "exit_code":0}'

# 3. Проверь статус
curl http://127.0.0.1:19876/agent/session

# 4. Confirm (через UI)

# 5. Проверь session.md
code .localhub/agent/*_session.md
```

---

*LocalHub v2.5 | Agent Diary Enhanced Test Plan*
