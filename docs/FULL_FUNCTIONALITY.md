# 📋 LocalHub v2.6 — Полный Функционал

> Единый источник правды для сравнения с Git и тестирования AI агентов

---

## 🔄 Основные концепции

| Концепция | LocalHub | Git |
|-----------|----------|-----|
| Сохранение | Автоматическое (на каждое Ctrl+S) | Ручное (git add + commit) |
| Ветки | Полная изоляция файлов | Указатели на коммиты |
| История | Версии каждого файла | Коммиты всего проекта |
| Конфликты | Определение + Smart Merge | Merge + ручное редактирование |
| Удалённые файлы | Корзина с восстановлением | Нет (нужен git checkout) |

---

## 📁 Версионирование файлов

### Автоматические триггеры сохранения:
| Триггер | Описание |
|---------|----------|
| `SAVE` | Ctrl+S — ручное сохранение |
| `TAB_SWITCH` | Переключение между файлами |
| `TEXT_CHANGED` | Изменение текста (2 сек debounce) |
| `EXTERNAL_CHANGE` | Изменение извне (AI агент, терминал) |
| `FILE_CREATED` | Создание нового файла |
| `BEFORE_CLOSE` | Перед закрытием файла |
| `TERMINAL_BEFORE` | Перед командой терминала |
| `TERMINAL_AFTER` | После команды терминала |

### Действия с версиями:
| Действие | UI | API | CLI |
|----------|-----|-----|-----|
| Показать историю | Панель File History | `GET /history?path=...` | - |
| Посмотреть diff | Клик на версию | `GET /diff?path=...&v1=X&v2=Y` | - |
| Восстановить полностью | ПКМ → Restore | `POST /restore` | - |
| Частичное восстановление | ПКМ → Partial Restore | `POST /restore/partial` | - |
| Удалить версию | ПКМ → Delete | `DELETE /history/version` | - |
| Удалить всю историю файла | ПКМ → Delete All | `DELETE /history/file` | - |

---

## 🌿 Ветки (Branches)

### Особенности:
- **Полная изоляция** — файлы ветки A не видны в ветке B
- **Физическое переключение** — при switch файлы удаляются/восстанавливаются
- **Pending changes** изолированы по веткам

### Действия:
| Действие | UI | API | CLI |
|----------|-----|-----|-----|
| Список веток | Панель Branches | `GET /branches` | `lh branch` |
| Создать ветку | ➕ кнопка / Ctrl+Alt+B | `POST /branches` | `lh branch <name>` |
| Переключить | Клик на ветку | `POST /branches/{id}/switch` | `lh switch <name>` |
| Удалить | ПКМ → Delete | `DELETE /branches/{id}` | - |
| Экспорт в ZIP | ПКМ → Export | `POST /branches/{id}/export` | - |
| Импорт из ZIP | Command Palette | `POST /import/zip` | - |

---

## 🔀 Merge (Слияние веток)

### Типы merge:
| Тип | Описание | API |
|-----|----------|-----|
| **Normal Merge** | Объединяет файлы, определяет конфликты | `POST /branches/{id}/merge` |
| **Force Merge** | Перезаписывает всё из source | `POST /branches/{id}/merge?force=true` |
| **Smart Merge** | Выбор действия для каждого файла | `POST /branches/{id}/merge/smart` |

### Smart Merge — действия на файл:
| Действие | Описание |
|----------|----------|
| `source` | Взять файл из source ветки |
| `target` | Оставить файл из target ветки |
| `skip` | Не трогать этот файл |

### Определение конфликтов:
- Файл изменён в обеих ветках после точки разветвления
- View Diff — просмотр различий перед merge

---

## ✅ TM Groups (Коммиты)

### Концепция:
- **Pending Changes** — файлы изменённые с последнего OK
- **TM Group** — подтверждённая группа изменений (аналог commit)

### Действия:
| Действие | UI | API | CLI |
|----------|-----|-----|-----|
| Показать pending | Панель Pending Changes | `GET /groups/pending` | `lh status` |
| Подтвердить (OK) | Кнопка OK | `POST /groups/confirm` | `lh commit [msg]` |
| Список групп | Панель TM Groups | `GET /groups` | `lh group` |
| Checkout TM Group | ПКМ / inline action / Command Palette | `POST /groups/{id}/checkout` | `lh group checkout <id>` |
| Статус TM Group checkout | Панель TM Groups / Command Palette | `GET /groups/checkout/status` | `lh group status` |
| Return To Branch Head | Toolbar / ПКМ / Command Palette | `POST /groups/checkout/clear` | `lh group head` |
| Удалить группу (keep snapshots) | ПКМ → Delete | `DELETE /groups/{id}?delete_snapshots=false` | `lh group -d <id>` |
| Удалить группу + snapshots | Модальное Delete ALL | `DELETE /groups/{id}?delete_snapshots=true` | `lh group -d <id> --with-snapshots` |
| Корзина удалённых TM Groups | 🗑️ кнопка в TM Groups / `Ctrl+Alt+Shift+G` | `GET /group-trash` | `lh group trash` |
| Restore zombie TM Group | QuickPick / ПКМ на zombie group | `POST /groups/{id}/restore` | `lh group restore <id|name>` |
| Restore ALL zombie TM Groups | QuickPick action | `POST /group-trash/restore-all` | `lh group restore --all` |
| Empty TM Group Trash | QuickPick action | `DELETE /group-trash` | `lh group empty-trash` |

---

## 🤖 Agent Diary (Black Box)

### Описание:
- **Автоматическое логирование** ВСЕХ действий в `.localhub/agent/`
- **Session-based tracking** — от первого изменения до Confirm
- **Терминальные команды** — логируются автоматически
- **Статистика** — duration, files changed, actions count

### Файловая структура:
```
.localhub/agent/
├── YYYY-MM-DD_session.md      # Все изменения за день
├── YYYY-MM-DD_event_001.md    # Коммиты/Merges
├── AGENT_PROTOCOL.md          # Инструкции для агента
└── DOCS.md                    # Полная документация
```

### Session (Сессия):
| Момент | Действие |
|--------|----------|
| **Начало** | Первое изменение файла (попало в Pending) |
| **Конец** | Confirm/Commit (OK нажат) |

### Что логируется автоматически:
| Событие | Формат |
|---------|--------|
| File save | `[HH:MM:SS] MODIFIED: path/to/file.ts` |
| Terminal command | `[HH:MM:SS] 💻 TERMINAL ✅: npm run build (3200ms)` |
| Branch operation | `[HH:MM:SS] 🌱 BRANCH CREATE: feature-x` |
| Restore | `[HH:MM:SS] ♻️ RESTORE from HISTORY: file.ts v12` |
| Stash | `[HH:MM:SS] 📦 STASH SAVE: 3 files` |
| Tag | `[HH:MM:SS] 🏷️+ TAG CREATE: v1.0` |
| GitHub | `[HH:MM:SS] ☁️↑ GITHUB SYNC: repo (15 files)` |

### Intent Sniffer (NEW):
- **Автоматически достаёт** последнее сообщение из VS Code
- **Кросс-платформенный**: Windows, macOS, Linux
- **Источники**: Chat history, Terminal history, Interactive history
- **Записывается** в Session Statistics при Confirm

### Session Statistics (автоматически в конце):
```markdown
## 🏁 Session #a1b2c3d4 ended at 19:15:00

### 📊 Session Statistics:
| Metric | Value |
|--------|-------|
| Duration | 10m 45s |
| Files Changed | 5 |
| Total Actions | 12 |
| Terminal Commands | 3 |
| Commit Comment | Added plugin system |
```

### API:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/agent/session` | GET | Получить статистику сессии |
| `/agent/session/start` | POST | Начать новую сессию вручную |
| `/agent/session/end` | POST | Завершить сессию |
| `/agent/terminal` | POST | Залогировать команду терминала |

### Пример session.md:
```markdown
## 🚀 Session #a1b2c3d4 started at 18:00:00

- [18:00:15] MODIFIED: `src/api.ts`
- [18:01:30] MODIFIED: `src/extension.ts`
- [18:02:00] 💻 TERMINAL ✅: `npm run compile` (3200ms)
  → Compilation successful
- [18:03:45] MODIFIED: `python/server.py`
- [18:04:00] 🌱 BRANCH CREATE: `feature-x`

## 🏁 Session #a1b2c3d4 ended at 18:10:00

### 📊 Session Statistics:
| Metric | Value |
|--------|-------|
| Duration | 10m 0s |
| Files Changed | 3 |
| Total Actions | 5 |
| Terminal Commands | 1 |
| Intent | Добавь терминальную команду логирование |
| Commit Comment | Added new feature |

---
```

---


## 🗑️ Корзина (Trash Bin)

### Особенности:
- Удалённые файлы сохраняются в истории
- Можно восстановить из любой версии
- Настраиваемый retention период

### Действия:
| Действие | UI | API | CLI |
|----------|-----|-----|-----|
| Показать корзину | 🗑️ кнопка / Ctrl+Alt+T | `GET /files/deleted` | `lh trash` |
| Восстановить файл | Выбрать → Restore | `POST /restore` | `lh restore <file>` |
| Восстановить все | - | - | `lh restore --all` |
| Очистить корзину | Command Palette | `DELETE /files/deleted` | `lh empty-trash` |

---

## 🤖 Agent Diary (Чёрный ящик)

### Расположение: `.localhub/agent/`

### Файлы:
| Файл | Описание |
|------|----------|
| `AGENT_PROTOCOL.md` | Инструкция для AI агентов |
| `YYYY-MM-DD_session.md` | Лог изменений файлов |
| `YYYY-MM-DD_event_NNN.md` | События (commits, merges) |

### Что логируется:
| Событие | Описание |
|---------|----------|
| File change | Каждое сохранение файла (путь, время, причина) |
| Group confirm | Каждый commit (файлы, комментарий) |
| Branch operation | Create, switch, delete |
| Merge | Source, target, конфликты |
| **Restore** | Восстановление файла (from trash/history) |
| **Stash** | Save, pop, drop операции |
| **Trash** | Restore, empty операции |
| **Tag** | Create, delete, checkout |
| **Cherry-pick** | File, version, source branch |
| **Error** | Ошибки сервера |
| **Session** | Start/end сессии |
| **GitHub** | Sync, clone, push операции |

### Для AI агентов:
- `.localhub/DOCS.md` — полная документация (read-only)
- Агент может читать историю и понимать контекст проекта

---

## 📦 Stash (Временное хранилище)

### Особенности:
- Прячет pending changes временно
- Позволяет переключиться на другую ветку
- Можно иметь несколько stash'ей

### Действия:
| Действие | API | CLI |
|----------|-----|-----|
| Спрятать | `POST /stash` | `lh stash` |
| Вернуть | `POST /stash/pop` | `lh stash pop` |
| Список | `GET /stash` | `lh stash list` |
| Удалить | `DELETE /stash/{id}` | `lh stash drop <n>` |

---

## 🏷️ Tags (Метки версий)

### Особенности:
- Метки для важных версий (v1.0, v2.0)
- Привязаны к ветке
- Можно checkout по тегу

### Действия:
| Действие | API | CLI |
|----------|-----|-----|
| Создать | `POST /tags?name=v1.0` | `lh tag v1.0` |
| Список | `GET /tags` | `lh tag` |
| Удалить | `DELETE /tags/{name}` | `lh tag -d v1.0` |
| Checkout | `POST /tags/{name}/checkout` | - |

---

## 🍒 Cherry-pick

### Особенности:
- Копирует файл из другой ветки
- Можно выбрать конкретную версию
- Не затрагивает source ветку

### Действия:
| Действие | API | CLI |
|----------|-----|-----|
| Cherry-pick | `POST /cherry-pick?source_branch_id=X&file_path=Y` | `lh cherry-pick <branch> <file>` |

---

## ☁️ Cloud Sync

### GitHub Integration:
| Действие | UI | API |
|----------|-----|-----|
| Настроить GitHub | Command Palette | `POST /cloud/github/setup` |
| Sync to GitHub | Command Palette | `POST /cloud/github/sync` |
| Clone from GitHub | Command Palette | `POST /cloud/github/clone` |

### SSH/Git Push:
| Действие | UI | CLI |
|----------|-----|-----|
| Push via SSH | Command Palette | `lh push` |

### Настройки (глобальные):
| Настройка | Описание |
|-----------|----------|
| `localhub.github.token` | GitHub Personal Access Token (GLOBAL) |
| `localhub.github.owner` | GitHub username (GLOBAL) |
| `localhub.github.repo` | Repository name |
| `localhub.github.branch` | Target branch |

---

## 💾 Backup System

### Central Backup:
- Расположение: `%APPDATA%/LocalHub/backups/`
- Все проекты бэкапятся в одно место
- Защита от потери данных при удалении проекта

### Настройки:
| Настройка | Описание | Default |
|-----------|----------|---------|
| `backup.enabled` | Включить бэкап | true |
| `backup.centralPath` | Путь к бэкапам | %APPDATA%/LocalHub |
| `backup.retentionDays` | Хранить N дней | 30 |
| `backup.autoCleanup` | Авто-очистка | Never |

---

## 🚫 .localhubignore

### Игнорирование файлов:
- Создать: Command Palette или 👁️ кнопка
- Формат как `.gitignore`

### CLI команды:
| Действие | CLI |
|----------|-----|
| Показать | `lh ignore` |
| Добавить паттерн | `lh ignore *.log` |
| Открыть в редакторе | `lh ignore --edit` |

### Шаблоны:
- All Languages (Python, Node, Java, C#, Go, Rust, Ruby, PHP)
- Отдельные шаблоны для каждого языка

---

## 🔌 Plugin System

### Описание:
- Расширение LocalHub через плагины
- Плагины имеют доступ ко ВСЕМУ функционалу
- Могут расширять Agent Diary
- UI плагины в боковой панели "Plugins"

### Структура плагина:
```
my-plugin/
├── manifest.json    # Метаданные и permissions
├── main.py          # Точка входа
└── README.md        # Документация
```

### Manifest:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "...",
  "permissions": ["read:history", "subscribe:events"],
  "events": ["file:save", "group:confirm"],
  "entrypoint": "main.py"
}
```

### UI:
| Элемент | Описание |
|---------|----------|
| 🔌 Plugins | Секция в боковой панели |
| TreeView | Список установленных плагинов |
| ПКМ меню | Enable/Disable/Remove |
| Install | Кнопка + из папки |

### CLI:
| Команда | Описание |
|---------|----------|
| `lh plugin` | Список плагинов |
| `lh plugin install <path>` | Установить |
| `lh plugin remove <name>` | Удалить |
| `lh plugin enable <name>` | Включить |
| `lh plugin disable <name>` | Отключить |

### API:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/plugins` | GET | Список |
| `/plugins/install` | POST | Установить |
| `/plugins/{name}` | DELETE | Удалить |
| `/plugins/{name}/enable` | POST | Включить |
| `/plugins/{name}/disable` | POST | Отключить |
| `/plugins/{name}/config` | GET/PUT | Конфигурация |

---

## ⌨️ Горячие клавиши

| Shortcut | Действие |
|----------|----------|
| `Ctrl+Alt+H` | Show Features (все функции) |
| `Ctrl+Alt+S` | Manual Snapshot |
| `Ctrl+Alt+B` | Create Branch |
| `Ctrl+Alt+T` | Show Trash |
| `Ctrl+Alt+Shift+T` | Show Branch Trash |
| `Ctrl+Alt+Shift+G` | Show TM Group Trash |

---

## 💻 CLI Commands

```bash
# Основные
lh init              # Инициализация проекта
lh status            # Статус сервера
lh commit [msg]      # Коммит pending changes
lh branch            # Список локальных веток
lh branch -r         # Список удалённых веток (GitHub)
lh branch -a         # Все ветки (локальные + удалённые)
lh branch <name>     # Создать ветку
lh branch -d <name>  # Удалить ветку (в zombie trash)
lh branch trash      # Показать удалённые ветки
lh branch restore <n> # Восстановить удалённую ветку
lh branch restore --all # Восстановить все удалённые ветки
lh branch empty-trash # Очистить корзину веток

lh switch <name>     # Переключить ветку
lh merge <branch>    # Смержить ветку в текущую
lh merge <branch> --force  # Force merge (перезаписать конфликты)

# TM Groups (коммиты)
lh group             # Список подтверждённых TM Groups
lh group -a          # Все TM Groups (включая zombie)
lh group checkout <id> # Checkout workspace to TM Group
lh group status      # Показать текущий TM Group checkout status
lh group head        # Вернуться на active branch head
lh group -d <id>     # Удалить TM Group (keep snapshots)
lh group -d <id> --with-snapshots # Удалить TM Group + snapshots
lh group trash       # Показать удалённые TM Groups
lh group restore <n> # Восстановить удалённую TM Group
lh group restore --all # Восстановить все удалённые TM Groups
lh group empty-trash # Очистить корзину TM Groups

lh push              # Push to GitHub
lh github            # Настройка GitHub

# Корзина
lh trash             # Показать корзину
lh restore <file>    # Восстановить файл
lh restore --all     # Восстановить все
lh empty-trash       # Очистить корзину

# Stash
lh stash             # Спрятать изменения
lh stash pop         # Вернуть изменения
lh stash list        # Список stash'ей
lh stash drop <n>    # Удалить stash

# Tags
lh tag <name>        # Создать тег
lh tag               # Список тегов
lh tag -d <name>     # Удалить тег

# Cherry-pick
lh cherry-pick <branch> <file>  # Копировать файл из ветки

# Ignore
lh ignore            # Показать .localhubignore
lh ignore <pattern>  # Добавить паттерн
lh ignore --edit     # Открыть в редакторе

# Plugins
lh plugin                    # Список плагинов
lh plugin install <path>     # Установить плагин
lh plugin remove <name>      # Удалить плагин
lh plugin enable <name>      # Включить
lh plugin disable <name>     # Выключить

lh help              # Помощь
```


---

## 📡 API Endpoints

### Основные:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/health` | GET | Статус сервера |
| `/init` | POST | Инициализация проекта |
| `/snapshot` | POST | Создать snapshot |
| `/files` | GET | Список файлов |
| `/files/deleted` | GET | Удалённые файлы |
| `/files/deleted` | DELETE | Очистить корзину |
| `/history` | GET | История файла |
| `/restore` | POST | Восстановить файл |
| `/restore/partial` | POST | Частичное восстановление |
| `/diff` | GET | Сравнить версии |

### Ветки:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/branches` | GET | Список веток |
| `/branches` | POST | Создать ветку |
| `/branches/{id}` | DELETE | Удалить ветку |
| `/branches/{id}/switch` | POST | Переключить |
| `/branches/{id}/merge` | POST | Merge |
| `/branches/{id}/merge/smart` | POST | Smart Merge |
| `/branch-trash` | GET | Список удалённых веток |
| `/branches/{id}/restore` | POST | Restore удалённой ветки |
| `/branch-trash/restore-all` | POST | Restore всех удалённых веток |
| `/branch-trash` | DELETE | Очистить корзину веток |
| `/branches/{id}/export` | POST | Export to ZIP |
| `/import/zip` | POST | Import from ZIP |

### TM Groups:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/groups` | GET | Список TM Groups |
| `/groups?include_deleted=true` | GET | Список TM Groups + zombie |
| `/groups/{id}/checkout` | POST | Checkout workspace to TM Group |
| `/groups/checkout/status` | GET | Текущий detached/head статус |
| `/groups/checkout/clear` | POST | Return to branch head |
| `/groups/{id}` | DELETE | Удалить TM Group (в trash) |
| `/group-trash` | GET | Список удалённых TM Groups |
| `/groups/{id}/restore` | POST | Restore удалённой TM Group |
| `/group-trash/restore-all` | POST | Restore всех удалённых TM Groups |
| `/group-trash` | DELETE | Очистить корзину TM Groups |

### Stash:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/stash` | POST | Создать stash |
| `/stash` | GET | Список stash |
| `/stash/pop` | POST | Pop stash |
| `/stash/{id}` | DELETE | Удалить stash |

### Tags:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/tags` | POST | Создать тег |
| `/tags` | GET | Список тегов |
| `/tags/{name}` | DELETE | Удалить тег |
| `/tags/{name}/checkout` | POST | Checkout по тегу |

### Cherry-pick:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/cherry-pick` | POST | Cherry-pick файла |

### Plugins:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/plugins` | GET | Список плагинов |
| `/plugins/install` | POST | Установить плагин |
| `/plugins/{name}` | DELETE | Удалить плагин |
| `/plugins/{name}/enable` | POST | Включить |
| `/plugins/{name}/disable` | POST | Выключить |
| `/plugins/{name}/config` | GET/PUT | Конфигурация |

### Группы:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/groups` | GET | Список групп |
| `/groups/pending` | GET | Pending changes |
| `/groups/confirm` | POST | Подтвердить |
| `/groups/{id}` | DELETE | Удалить группу |

### Cloud:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/cloud/github/setup` | POST | Настроить GitHub |
| `/cloud/github/sync` | POST | Sync to GitHub |
| `/cloud/github/clone` | POST | Clone from GitHub |

---

## 🆚 Сравнение с Git

| Функция | LocalHub | Git |
|---------|----------|-----|
| Автосохранение | ✅ На каждый Ctrl+S | ❌ Ручной commit |
| Изоляция веток | ✅ Полная (файлы физически) | ❌ Указатели |
| Определение конфликтов | ✅ До merge | ❌ Во время merge |
| Smart Merge | ✅ Выбор per-file | ❌ Нет |
| Корзина | ✅ Полноценная | ❌ Только через reflog |
| Stash | ✅ `lh stash` | ✅ `git stash` |
| Tags | ✅ `lh tag` | ✅ `git tag` |
| Cherry-pick | ✅ `lh cherry-pick` | ✅ `git cherry-pick` |
| AI Agent Log | ✅ Agent Diary | ❌ Нет |
| Документация для AI | ✅ DOCS.md auto-generated | ❌ Нет |
| Восстановление частичное | ✅ Partial Restore | ❌ Только весь файл |
| Terminal triggers | ✅ Before/After command | ❌ Нет |
| External change detection | ✅ Автоматически | ❌ Нет |
| Central backup | ✅ %APPDATA% | ❌ Только .git |
| Export/Import ZIP | ✅ Встроено | ❌ git archive |
| Горячие клавиши | ✅ Ctrl+Alt+H/S/B/T | ❌ Только терминал |
| Визуальный diff | ✅ В редакторе | ❌ Терминал или плагин |

---

## 🔧 Настройки (Settings)

| Настройка | Тип | Default | Описание |
---

## 🔌 Plugin System

### Описание:
- Расширение LocalHub через плагины
- Плагины имеют доступ ко ВСЕМУ функционалу LocalHub
- Каждый плагин может иметь свой UI (отображается в панели Plugins)
- Могут расширять Agent Diary

### Расположение плагинов:
- **Установленные:** `.localhub/plugins/installed/`
- **Конфигурации:** `.localhub/plugins/config/`
- **Реестр:** `.localhub/plugins/registry.json`

### Структура плагина:
```
my-plugin/
├── manifest.json    # Метаданные и permissions
├── main.py          # Точка входа (класс Plugin)
├── ui.html          # UI плагина (опционально)
└── README.md        # Документация
```

### Manifest.json:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "...",
  "author": "...",
  "permissions": ["read:history", "subscribe:events"],
  "events": ["file:save", "group:confirm"],
  "entrypoint": "main.py"
}
```

### UI панель Plugins:
| Элемент | Описание |
|---------|----------|
| 🔌 Plugins | Секция в боковой панели LocalHub |
| Split View | Слева список плагинов, справа UI выбранного |
| Карточки | Название, версия, статус (🟢/⚪), кнопки |
| Кнопки | Enable/Disable, ⚙️ Settings, 🗑️ Remove |
| Install | Кнопка + (установка из папки) |

### CLI:
| Команда | Описание |
|---------|----------|
| `lh plugin` | Список установленных плагинов |
| `lh plugin install <path>` | Установить из локальной папки |
| `lh plugin remove <name>` | Удалить плагин |
| `lh plugin enable <name>` | Включить плагин |
| `lh plugin disable <name>` | Отключить плагин |

### API:
| Endpoint | Method | Описание |
|----------|--------|----------|
| `/plugins` | GET | Список плагинов |
| `/plugins/install` | POST | Установить плагин |
| `/plugins/{name}` | DELETE | Удалить плагин |
| `/plugins/{name}/enable` | POST | Включить |
| `/plugins/{name}/disable` | POST | Отключить |
| `/plugins/{name}/config` | GET/PUT | Конфигурация |
| `/plugins/{name}/ui` | GET | HTML интерфейс плагина |

### Events (для подписки):
| Event | Описание |
|-------|----------|
| `file:save` | Файл сохранён |
| `file:delete` | Файл удалён |
| `group:confirm` | Создан коммит |
| `branch:create` | Создана ветка |
| `branch:switch` | Переключение ветки |
| `branch:delete` | Удалена ветка |
| `branch:merge` | Слияние веток |

### Permissions:
| Permission | Описание |
|------------|----------|
| `read:history` | Чтение истории файлов |
| `read:branches` | Чтение информации о ветках |
| `write:files` | Запись в файлы |
| `subscribe:events` | Подписка на события |

---

## ⚙️ Settings (VS Code)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `localhub.enabled` | bool | true | Включить LocalHub |
| `localhub.debounce` | number | 2000 | Задержка auto-save (ms) |
| `localhub.backup.enabled` | bool | true | Включить backup |
| `localhub.backup.centralPath` | string | "" | Путь к backups |
| `localhub.backup.retentionDays` | number | 30 | Retention (дней) |
| `localhub.backup.autoCleanup` | string | "Never" | Авто-очистка |
| `localhub.trash.retentionDays` | number | 30 | Retention корзины |
| `localhub.github.enabled` | bool | false | Включить GitHub |
| `localhub.github.token` | string | "" | GitHub token (GLOBAL) |
| `localhub.github.owner` | string | "" | GitHub username |
| `localhub.github.repo` | string | "" | Repository name |

---

*LocalHub v2.6 | Полный функционал*


