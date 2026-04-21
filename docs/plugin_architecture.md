# 🔌 LocalHub Plugin System — Architecture Design

> Версия 1.0 | Дизайн-документ для разработки

---

## 🎯 Цели системы плагинов

1. **Расширяемость** — любой может добавить функционал
2. **Безопасность** — плагины не могут сломать ядро
3. **Изоляция** — плагины работают через API, не лезут в код
4. **Документация** — подробная документация для разработчиков плагинов

---

## 🏗️ Архитектура

### Слои системы:

```
┌─────────────────────────────────────────────┐
│              ПЛАГИНЫ (Plugins)               │
│  ┌─────────┐ ┌─────────┐ ┌─────────────┐    │
│  │ Logger  │ │ Metrics │ │ Telegram    │    │
│  │ Plugin  │ │ Plugin  │ │ Notifier    │    │
│  └────┬────┘ └────┬────┘ └──────┬──────┘    │
├───────┼──────────┼─────────────┼────────────┤
│       ▼          ▼             ▼            │
│        PLUGIN API (REST + WebHooks)         │
│  ┌────────────────────────────────────────┐ │
│  │ Events │ Hooks │ Permissions │ Config  │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│            LOCALHUB CORE (Ядро)             │
│  ┌─────────────────────────────────────┐    │
│  │ Time Machine │ Branches │ Merge     │    │
│  │ Agent Diary  │ Cloud    │ Trash     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 📂 Структура файлов

```
.localhub/
├── plugins/
│   ├── registry.json        # Список установленных плагинов
│   ├── installed/
│   │   ├── logger-plugin/
│   │   │   ├── manifest.json
│   │   │   ├── main.py (или main.js)
│   │   │   └── README.md
│   │   └── telegram-notifier/
│   │       ├── manifest.json
│   │       └── main.py
│   └── config/
│       ├── logger-plugin.json   # Конфиг плагина
│       └── telegram-notifier.json
└── agent/
    └── ... (Agent Diary)
```

---

## 📋 Manifest (plugin.json)

Каждый плагин должен иметь manifest:

```json
{
  "name": "telegram-notifier",
  "version": "1.0.0",
  "description": "Уведомления в Telegram о коммитах",
  "author": "Adam Gold",
  
  "permissions": [
    "read:history",
    "read:branches",
    "subscribe:events"
  ],
  
  "events": [
    "group:confirm",
    "branch:create",
    "branch:merge",
    "file:restore"
  ],
  
  "config": {
    "telegram_token": {
      "type": "string",
      "required": true,
      "description": "Bot token"
    },
    "chat_id": {
      "type": "string",
      "required": true,
      "description": "Chat ID"
    }
  },
  
  "entrypoint": "main.py"
}
```

---

## 🔐 Permissions (Права доступа)

| Permission | Описание |
|------------|----------|
| `read:history` | Читать историю файлов |
| `read:branches` | Читать список веток |
| `read:groups` | Читать группы/коммиты |
| `read:pending` | Читать pending changes |
| `read:trash` | Читать корзину |
| `read:config` | Читать настройки |
| `write:snapshot` | Создавать snapshots |
| `write:branches` | Создавать ветки |
| `write:groups` | Подтверждать группы |
| `subscribe:events` | Подписка на события |
| `execute:commands` | Выполнять CLI команды |

---

## 📡 Events (События)

Плагины могут подписаться на события:

| Event | Данные |
|-------|--------|
| `file:save` | `{path, version, reason}` |
| `file:delete` | `{path}` |
| `file:restore` | `{path, version, from_trash}` |
| `group:confirm` | `{name, files, comment}` |
| `branch:create` | `{name, id}` |
| `branch:switch` | `{from_branch, to_branch}` |
| `branch:delete` | `{name, id}` |
| `branch:merge` | `{source, target, conflicts}` |
| `stash:save` | `{files_count}` |
| `stash:pop` | `{stash_name}` |
| `tag:create` | `{name}` |
| `tag:delete` | `{name}` |
| `github:sync` | `{repo, files_count}` |
| `github:clone` | `{repo}` |
| `session:start` | `{}` |
| `session:end` | `{}` |

---

## 🔌 Plugin API Endpoints

### Для управления плагинами:

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/plugins` | GET | Список установленных плагинов |
| `/plugins/install` | POST | Установить плагин |
| `/plugins/{name}` | DELETE | Удалить плагин |
| `/plugins/{name}/enable` | POST | Включить |
| `/plugins/{name}/disable` | POST | Выключить |
| `/plugins/{name}/config` | GET/PUT | Конфигурация |

### Для плагинов (доступ к ядру):

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/api/v1/history` | GET | История файла |
| `/api/v1/branches` | GET | Список веток |
| `/api/v1/groups` | GET | Группы |
| `/api/v1/pending` | GET | Pending changes |
| `/api/v1/snapshot` | POST | Создать snapshot |
| `/api/v1/events/subscribe` | POST | Подписка на события |
| `/api/v1/events/unsubscribe` | POST | Отписка |

---

## 🔔 WebHooks (Уведомления)

Плагин регистрирует webhook URL:

```json
{
  "plugin": "telegram-notifier",
  "events": ["group:confirm", "branch:merge"],
  "webhook_url": "http://localhost:19877/webhook"
}
```

Когда событие происходит, LocalHub шлёт POST:

```json
{
  "event": "group:confirm",
  "timestamp": 1736715000,
  "data": {
    "name": "Added new feature",
    "files": ["app.py", "utils.py"],
    "comment": "Fixed bug #123"
  }
}
```

---

## 💻 CLI Commands для плагинов

```bash
lh plugin                    # Список плагинов
lh plugin install <name>     # Установить
lh plugin remove <name>      # Удалить
lh plugin enable <name>      # Включить
lh plugin disable <name>     # Выключить
lh plugin config <name>      # Настроить
```

---

## 📝 Пример плагина: Telegram Notifier

### manifest.json:
```json
{
  "name": "telegram-notifier",
  "version": "1.0.0",
  "permissions": ["subscribe:events"],
  "events": ["group:confirm"],
  "entrypoint": "main.py"
}
```

### main.py:
```python
import requests
from localhub_plugin import Plugin, on_event

class TelegramNotifier(Plugin):
    
    @on_event("group:confirm")
    def on_commit(self, event_data):
        name = event_data["name"]
        files = event_data["files"]
        
        message = f"✅ Commit: {name}\n📁 Files: {len(files)}"
        
        self.send_telegram(message)
    
    def send_telegram(self, message):
        token = self.config["telegram_token"]
        chat_id = self.config["chat_id"]
        
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        requests.post(url, json={
            "chat_id": chat_id,
            "text": message
        })
```

---

## 🛠️ Встроенные плагины (Core Plugins)

Эти плагины идут из коробки:

| Плагин | Описание |
|--------|----------|
| `agent-diary` | Логирование для AI (уже есть) |
| `backup-manager` | Управление бэкапами |
| `github-sync` | GitHub интеграция |
| `metrics` | Статистика проекта |

---

## 📚 Документация для разработчиков

Создадим файл: `docs/PLUGIN_DEVELOPMENT.md`

Содержимое:
1. Как создать плагин
2. Manifest формат
3. Permissions
4. Events
5. API endpoints
6. Примеры

---

## 🎯 План реализации

### Фаза 1: Инфраструктура
- [ ] Создать `/plugins` endpoints в server.py
- [ ] Создать `plugin_manager.py` 
- [ ] Создать структуру папок `.localhub/plugins/`

### Фаза 2: Events
- [ ] Добавить EventBus для рассылки событий
- [ ] Интегрировать во все операции (save, commit, merge...)

### Фаза 3: CLI
- [ ] Добавить `lh plugin` команды
- [ ] Документация в `lh help`

### Фаза 4: Примеры
- [ ] Telegram Notifier
- [ ] Metrics Dashboard
- [ ] Custom Logger

---

*LocalHub Plugin System v1.0 | Design Document*
