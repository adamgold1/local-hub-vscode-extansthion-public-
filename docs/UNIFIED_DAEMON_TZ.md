# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Единый Независимый Демон LocalHub

> **Дата:** 2026-02-14
> **Статус:** Исследование завершено, план готов к реализации
> **Цель:** Объединить LocalHub и Global Watcher в один независимый системный демон

---

## 1. ТЕКУЩАЯ АРХИТЕКТУРА (AS-IS)

### 1.1 Компоненты системы

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension                     │
│                                                         │
│  extension.ts          — точка входа, регистрирует      │
│                          команды, провайдеры, триггеры  │
│  daemon-manager.ts     — запускает/находит Python-демон  │
│  global-watcher-       — API-клиент к Global Watcher     │
│    manager.ts            (шлёт HTTP-запросы на /gw/*)    │
│  api.ts                — API-клиент к LocalHub           │
│                          (шлёт HTTP на /* с заголовком   │
│                           X-Project-Root)                │
│  lhl-manager.ts        — авто-группировка по таймеру     │
│                                                         │
│  ┌─── Smart Triggers (extension.ts, строки 4669+) ───┐  │
│  │ onDidSaveTextDocument → api.snapshot()              │  │
│  │ onDidChangeActiveTextEditor → api.snapshot()        │  │
│  │ onDidOpenTextDocument → api.snapshot()              │  │
│  │ onDidChangeTextDocument → api.snapshot() (debounce) │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (port 19876-19895)
                       │ Header: X-Project-Root
                       ▼
┌─────────────────────────────────────────────────────────┐
│              daemon_server.py (ОДИН ПРОЦЕСС)             │
│              FastAPI + Uvicorn                            │
│                                                         │
│  ProjectMiddleware    — извлекает X-Project-Root         │
│  ProjectRegistry      — кеширует LocalHub экземпляры     │
│  contextvars          — _hub_var, _root_var              │
│                                                         │
│  ┌── Модули (регистрируются через register_xxx) ──────┐  │
│  │  local_hub.py       — ядро: snapshot, restore, DB  │  │
│  │  global_watcher.py  — watchdog + GlobalHubStorage  │  │
│  │  global_watcher_routes.py — /gw/* эндпоинты        │  │
│  │  blame.py           — blame файлов                 │  │
│  │  bisect_module.py   — бинарный поиск бага          │  │
│  │  log_module.py      — лог фильтры                  │  │
│  │  trash_protection.py— защита корзины               │  │
│  │  cloud_sync.py      — синхронизация (проект)       │  │
│  │  gw_cloud_sync.py   — синхронизация (GW)           │  │
│  │  agent_diary.py     — агентский дневник            │  │
│  │  auto_tagger.py     — авто-теги групп              │  │
│  │  plugin_manager.py  — плагинная система            │  │
│  │  tree_diff*.py      — дерево изменений             │  │
│  │  features_analyzer.py — анализатор фич             │  │
│  │  graph_analyzer.py  — граф связей                  │  │
│  │  time_travel.py     — машина времени               │  │
│  │  config_manager.py  — конфигурация проекта         │  │
│  │  import_service.py  — импорт ZIPов                 │  │
│  │  context_diff.py    — контекстный diff             │  │
│  │  daemon_integration.py — v3 миграции и роуты       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌── Хранилище ──────────────────────────────────────┐  │
│  │  Проекты: <project>/.localhub/localhub.db + blobs │  │
│  │  GW:      ~/.localhub_global/global_watcher.db    │  │
│  │           ~/.localhub_global/blobs/               │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Файлы и их роли

| Файл | Строк | Роль |
|------|-------|------|
| **Python Backend** | | |
| `daemon_server.py` | 3799 | **Главный сервер демона** — FastAPI, все эндпоинты LocalHub + GW роуты |
| `local_hub.py` | 2335 | **Ядро** — снапшоты, восстановление, SQLite, дедупликация по hash |
| `global_watcher.py` | 1312 | **GlobalWatcher** — watchdog наблюдение + GlobalHubStorage (отдельная БД) |
| `global_watcher_routes.py` | 450 | **GW API** — /gw/* эндпоинты, зарегистрированы в daemon_server |
| `global_watcher_server.py` | 570 | **Устаревший** — самостоятельный сервер GW (НЕ ИСПОЛЬЗУЕТСЯ, всё через daemon_server) |
| `project_registry.py` | 186 | **Реестр проектов** — кеширует LocalHub, CloudSync, PluginManager |
| `daemon_integration.py` | 571 | **v3 интеграция** — миграции, доп. роуты |
| **TypeScript Frontend** | | |
| `extension.ts` | 5077 | **Главный** — активация, Smart Triggers, команды, UI |
| `daemon-manager.ts` | 458 | **Менеджер демона** — запуск/остановка Python-процесса |
| `global-watcher-manager.ts` | 590 | **Клиент GW** — HTTP-запросы к /gw/*, signal watch |
| `api.ts` | 1092 | **API-клиент** — HTTP-запросы к LocalHub эндпоинтам |
| `lhl-manager.ts` | 225 | **LHL** — авто-группировка по timeout/threshold |
| `global-watcher-panel.ts` | ~2400 | **UI GW** — WebView панель Global Watcher |

### 1.3 Текущая проблема (PAIN POINT)

```
СЕЙЧАС: Кто создаёт снапшоты проекта?
═══════════════════════════════════════

VS Code (extension.ts, строки 4669-4780):
  → onDidSaveTextDocument → api.snapshot()
  → onDidChangeTextDocument → api.snapshot() (с debounce)
  → onDidChangeActiveTextEditor → api.snapshot()
  → onDidOpenTextDocument → api.snapshot()

VS Code КОМАНДУЕТ демону "Сохрани!" →  Демон послушно сохраняет

Проблема: Если VS Code тормозит/зависает → снапшоты НЕ создаются!
         Если Antigravity тупит → VS Code не успевает послать команду
         Демон СЛЕПОЙ — он не видит файлы сам
```

```
СЕЙЧАС: Кто создаёт снапшоты GW?
═══════════════════════════════════

Python (global_watcher.py):
  → watchdog Observer следит за папками
  → WatcherHandler._handle_event → GlobalWatcherDaemon._on_file_change
  → GlobalHubStorage.snapshot_file()

Демон САМ видит изменения → сам сохраняет

Преимущество: Работает НЕЗАВИСИМО от VS Code!
```

---

## 2. ЦЕЛЕВАЯ АРХИТЕКТУРА (TO-BE)

### 2.1 Общая схема

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension                     │
│                   (ТОЛЬКО UI + УВЕДОМЛЕНИЯ)               │
│                                                         │
│  extension.ts         — UI провайдеры, команды           │
│  daemon-manager.ts    — запуск/подключение к демону       │
│  api.ts               — HTTP-клиент (без изменений)      │
│                                                         │
│  ✅ TreeViews, WebViews — показывают данные               │
│  ✅ Команды — restore, confirm, diff, star               │
│  ❌ Smart Triggers — УДАЛЕНЫ (демон следит сам)           │
│  ❌ onDidSave snapshot — УДАЛЕНО                         │
│                                                         │
│  Новое:                                                  │
│  ✅ WebSocket/Signal подписка на обновления               │
│  ✅ Автоматический refresh UI при получении сигнала       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (port 19876)
                       │ + WebSocket /ws/events (опционально)
                       ▼
┌─────────────────────────────────────────────────────────┐
│         UNIFIED DAEMON (daemon_server.py)                 │
│         FastAPI + Uvicorn + Watchdog                     │
│         ОДИН ПРОЦЕСС, ПОЛНОСТЬЮ НЕЗАВИСИМЫЙ              │
│                                                         │
│  ┌── Новый компонент: ProjectWatcher ─────────────────┐  │
│  │                                                     │  │
│  │  Когда проект зарегистрирован (registerProject):    │  │
│  │  1. Создаётся WatcherHandler для папки проекта      │  │
│  │  2. watchdog слушает изменения файлов               │  │
│  │  3. При изменении → local_hub.snapshot_file()       │  │
│  │  4. Шлёт сигнал VS Code (через signal file)         │  │
│  │                                                     │  │
│  │  ✅ Работает без VS Code                            │  │
│  │  ✅ Использует тот же WatcherHandler из GW          │  │
│  │  ✅ Debounce через тот же механизм                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌── Существующие компоненты (без изменений) ─────────┐  │
│  │  /snapshot, /history, /restore, /groups/*           │  │
│  │  /gw/* (Global Watcher API)                        │  │
│  │  /blame, /bisect, /log, /trash/*                   │  │
│  │  /cloud/*, /plugins/*                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌── Единое хранилище ────────────────────────────────┐  │
│  │  Проекты: <project>/.localhub/ (без изменений)     │  │
│  │  GW:      ~/.localhub_global/ (без изменений)      │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Что меняется, что остаётся

| Компонент | Статус | Действие |
|-----------|--------|----------|
| **daemon_server.py** | 🟡 Модификация | Добавить `ProjectWatcher` — watchdog для папок проектов |
| **local_hub.py** | ✅ Без изменений | Ядро остаётся как есть |
| **global_watcher.py** | ✅ Без изменений | `WatcherHandler` используется повторно для проектов |
| **global_watcher_routes.py** | ✅ Без изменений | GW API остаётся |
| **global_watcher_server.py** | 🔴 Удалить | Устаревший, не используется |
| **project_registry.py** | 🟡 Модификация | Добавить запуск/остановку watchdog при register/unregister |
| **extension.ts** | 🟡 Модификация | Удалить Smart Triggers, добавить signal-подписку |
| **daemon-manager.ts** | ✅ Без изменений | Запуск демона работает |
| **api.ts** | ✅ Без изменений | HTTP-клиент не трогаем |
| **lhl-manager.ts** | ✅ Без изменений | Авто-группировка работает через API коммитов |

---

## 3. ДЕТАЛЬНЫЙ ПЛАН РЕАЛИЗАЦИИ

### Фаза 1: `ProjectWatcher` в daemon_server.py

**Файл:** `python/project_watcher.py` (новый)

```python
"""
ProjectWatcher — автоматическое наблюдение за файлами проекта.
Использует тот же WatcherHandler из global_watcher.py.
При изменении файла → вызывает local_hub.snapshot_file().
"""

class ProjectWatcher:
    """
    Один экземпляр на один зарегистрированный проект.
    
    Жизненный цикл:
    1. register_project() → ProjectWatcher.start(project_root)
    2. watchdog видит изменение → _on_file_change()
    3. _on_file_change() → hub.snapshot_file()
    4. unregister_project() → ProjectWatcher.stop()
    """
    
    def __init__(self, project_root: str, hub: LocalHub):
        self.project_root = project_root
        self.hub = hub
        self.watcher = None  # GlobalWatcher экземпляр
        self.session = "vscode"  # Совпадает с текущим
    
    def start(self):
        """Запустить watchdog для папки проекта."""
        # Используем WatcherHandler из global_watcher.py
        # с exclude-паттернами из проекта (.localhubignore)
        pass
    
    def stop(self):
        """Остановить watchdog."""
        pass
    
    def _on_file_change(self, path: str, reason: str):
        """
        Коллбэк при изменении файла.
        Вызывает hub.snapshot_file() напрямую.
        """
        # 1. Проверить _should_ignore_file()
        # 2. hub.snapshot_file(session, path, reason)
        # 3. Записать сигнал (для уведомления VS Code)
        pass
```

**Что переиспользуется из global_watcher.py:**
- `WatcherHandler` — обработчик событий с debounce
- `DEFAULT_EXCLUDE_PATTERNS` — базовые исключения
- `WatcherHandler._is_excluded()` — проверка путей
- `WatcherHandler._load_localhubignore()` — чтение .localhubignore

### Фаза 2: Интеграция в `project_registry.py`

```python
# Добавить в ProjectRegistry:

class ProjectRegistry:
    def __init__(self):
        # ... существующие поля ...
        self._watchers: Dict[str, ProjectWatcher] = {}  # НОВОЕ
    
    def get(self, project_root, ...):
        # ... существующая логика ...
        # ДОБАВИТЬ: автозапуск ProjectWatcher
        if key not in self._watchers:
            watcher = ProjectWatcher(project_root, hub)
            watcher.start()
            self._watchers[key] = watcher
        return hub
    
    def unregister(self, project_root):
        # ... существующая логика ...
        # ДОБАВИТЬ: остановка ProjectWatcher
        watcher = self._watchers.pop(key, None)
        if watcher:
            watcher.stop()
```

### Фаза 3: Удаление Smart Triggers из extension.ts

**Что удаляется (строки ~4669-4780):**
```typescript
// УДАЛИТЬ: setupSmartTriggers() и всё внутри:
//   - onDidSaveTextDocument → api.snapshot()
//   - onDidChangeActiveTextEditor → api.snapshot()
//   - onDidOpenTextDocument → api.snapshot()
//   - onDidChangeTextDocument → api.snapshot()
//   - createSnapshot() helper
```

**Что заменяет:**
```typescript
// Демон сам создаёт снапшоты → VS Code только слушает сигнал

// Уже есть: globalWatcherManager.startSignalWatch()
// Добавить аналогичный PROJECT signal watch:

function startProjectSignalWatch(projectRoot: string) {
    const signalFile = path.join(projectRoot, '.localhub', 'event_signal.txt');
    fs.watch(signalFile, () => {
        // Демон сообщил об изменении → обновить UI
        refreshAllUI();
    });
}
```

**Что остаётся без изменений:**
- Все команды (`localhub.restore`, `localhub.confirmGroup`, etc.)
- Все TreeView/WebView провайдеры
- API-клиент (`api.ts`)
- Ручной `localhub.snapshot` (команда пользователя через палитру)

### Фаза 4: Signal-уведомления

**В `project_watcher.py`:**
```python
def _on_file_change(self, path: str, reason: str):
    # ... snapshot ...
    
    # Записать сигнал для VS Code
    signal_file = os.path.join(self.project_root, '.localhub', 'event_signal.txt')
    with open(signal_file, 'w') as f:
        f.write(f"{time.time()}|{path}|{reason}\n")
```

**Механизм уже работает для GW:**
- `GlobalWatcherDaemon._emit_snapshot_signal()` записывает в `~/.localhub_global/event_signal.txt`
- `GlobalWatcherManager.startSignalWatch()` слушает через `fs.watch()`
- При получении сигнала → `gwSidebarProvider.refresh()`, badge обновляется

Тот же подход применяем для проектного watchdog.

---

## 4. РИСКИ И МИТИГАЦИЯ

| Риск | Вероятность | Влияние | Митигация |
|------|------------|---------|-----------|
| watchdog видит .localhub/* файлы (БД, blobs) | Высокая | Снапшот самих снапшотов | `_is_excluded()` уже исключает `.localhub` |
| watchdog не реагирует на файлы с бинарным контентом | Средняя | Пропуск изменений | Те же exclude-паттерны что в GW |
| Двойной снапшот (и демон, и VS Code пока не убрали триггеры) | Средняя | Лишние записи | `local_hub.py` дедуплицирует по `content_hash` |
| Потеря метаданных (reason "tab_switch", "text_changed") | Средняя | Менее информативная история | watchdog будет давать "auto:watcher", но ручные команды сохранят контекст |
| Нагрузка watchdog на больших проектах | Низкая | Тормоза | GW уже работает с большими папками, тот же механизм |

---

## 5. ЭТАПЫ ВЫПОЛНЕНИЯ

### Этап 1: Поехали (минимум)
1. ✏️ Создать `python/project_watcher.py`
2. ✏️ Модифицировать `python/project_registry.py` — при `get()` запускать watcher
3. ✏️ Модифицировать `python/daemon_server.py` — emit сигнал при проектном снапшоте
4. 🧪 Тест: изменить файл НЕ из VS Code (notepad) → проверить что снапшот создался

### Этап 2: Отвязка VS Code
5. ✏️ Удалить `setupSmartTriggers()` из `extension.ts`
6. ✏️ Добавить project signal watch в `extension.ts`
7. 🧪 Тест: VS Code показывает обновления БЕЗ отправки api.snapshot()

### Этап 3: Уборка
8. 🗑️ Удалить `global_watcher_server.py` (устаревший самостоятельный сервер)
9. 📝 Обновить документацию

---

## 6. ОТВЕТЫ НА ВОПРОСЫ

### **"daemon_server.py — это демон LocalHub или Global Watcher?"**
> **Ответ: Оба.** Это ЕДИНЫЙ демон. Он обслуживает и проекты (LocalHub), и глобальное наблюдение (Global Watcher). GW живёт внутри него как набор роутов `/gw/*`.

### **"Какой файл отвечает за демон LocalHub?"**
> **`daemon_server.py`** — главный сервер. Он использует `local_hub.py` как ядро для каждого проекта через `ProjectRegistry`.

### **"Можно ли сделать один демон вместо двух?"**
> **Уже сделано!** `daemon_server.py` уже содержит и LocalHub, и Global Watcher. Файл `global_watcher_server.py` — устаревший артефакт, его можно удалить.

### **"Будет ли тормозить UI как у Global Watcher?"**
> **Нет.** Тормоза GW были в его WebView-панели (заново рисует HTML при каждом клике). LocalHub использует TreeView (нативные элементы VS Code), которые обновляются мгновенно. Backend (демон) одинаково быстрый в обоих случаях.

### **"Что будет выигрышем?"**
> 1. **Надёжность** — снапшоты создаются даже при зависании VS Code
> 2. **Производительность** — нет лишних HTTP-запросов от Smart Triggers (сейчас каждое нажатие клавиши → HTTP → snapshot → HTTP-ответ)
> 3. **Простота** — один процесс, одна точка контроля
> 4. **Ловит ВСЁ** — внешние редакторы, терминальные команды, git checkout — всё фиксируется
