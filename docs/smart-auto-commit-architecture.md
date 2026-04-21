# Smart Auto-Commit: Архитектура универсального адаптера AI-агентов

> Модуль для автоматического создания коммитов в LocalHub
> на основе завершения задач AI-агентами (Storm Code, Roo Code, и др.)

---

## Оглавление

1. [Концепция](#1-концепция)
2. [Публичный API Storm Code / Roo Code](#2-публичный-api-storm-code--roo-code)
3. [Полная схема событий](#3-полная-схема-событий)
4. [Формат сообщений (ClineMessage)](#4-формат-сообщений-clinemessage)
5. [Ключевые события для перехвата](#5-ключевые-события-для-перехвата)
6. [Архитектура универсального адаптера](#6-архитектура-универсального-адаптера)
7. [Хранение чатов (файловая система)](#7-хранение-чатов-файловая-система)
8. [Точка интеграции: attempt_completion](#8-точка-интеграции-attempt_completion)
9. [UI: настройки в LHL Mode (Autopilot)](#9-ui-настройки-в-lhl-mode-autopilot)
10. [План реализации](#10-план-реализации)
11. [Где оставить комментарии в Storm Code](#11-где-оставить-комментарии-в-storm-code)

---

## 1. Концепция

**Идея:** Когда AI-агент (Storm Code, Roo Code, любой совместимый) завершает задачу,
его финальное сообщение автоматически становится описанием коммита в LocalHub.
LocalHub сам делает `confirmGroup()` с этим текстом.

**Требования:**
- Тумблер включения/выключения в настройках LHL Mode
- Не ломать Storm Code (только читаем API, не модифицируем)
- Универсальный адаптер — поддержка любых AI-расширений через единый интерфейс
- Парсер/фильтр текста — очистка мусора из AI-ответов перед коммитом

---

## 2. Публичный API Storm Code / Roo Code

### Как получить API

Storm Code (и Roo Code) из `activate()` возвращает объект `API extends EventEmitter`.
Это **официальный публичный API**, задокументированный в `@roo-code/types`.

```typescript
// Официальный способ подключения (из документации Roo Code)
import { RooCodeAPI } from "@roo-code/types"  // npm пакет с типами

// Для Storm Code (твой форк):
const stormExt = vscode.extensions.getExtension('stormcode.storm-code');
// Для Roo Code (оригинал):
// const rooExt = vscode.extensions.getExtension('RooVeterinaryInc.roo-cline');

if (stormExt?.isActive) {
    const api = stormExt.exports;  // ← объект API (EventEmitter)

    // Подписка на события
    api.on('taskCompleted', (taskId, tokenUsage, toolUsage) => { ... });
    api.on('message', ({ taskId, action, message }) => { ... });
}
```

### Зависимость в package.json (опционально)
```json
{
  "extensionDependencies": ["stormcode.storm-code"]
}
```
**НЕ рекомендуется** для LocalHub — мы хотим работать БЕЗ Storm Code тоже.
Лучше подключаться динамически если расширение есть.

### Исходник API класса
`dist/extension.js` строка 886871:
```javascript
// extension/api.ts
var API = class extends EventEmitter {
    constructor(outputChannel, provider, socketPath, enableLogging) { ... }
    // --- Методы ---
    startNewTask({ configuration, text, images, newTab })  // запуск задачи
    resumeTask(taskId)                                       // возобновить задачу
    isTaskInHistory(taskId)                                   // есть ли в истории
    getCurrentTaskStack()                                     // стек текущих задач
    clearCurrentTask(lastMessage)                             // завершить подзадачу
    cancelCurrentTask()                                       // отменить текущую
    cancelTask(taskId)                                        // отменить по ID
    sendMessage(text, images)                                 // отправить сообщение
    pressPrimaryButton()                                      // нажать основную кнопку
    pressSecondaryButton()                                    // нажать вторичную кнопку
    isReady()                                                 // готов ли WebView
}
```

Возвращается из `activate()` в строке 895685:
```javascript
return new API(outputChannel2, provider, socketPath, enableLogging);
```

---

## 3. Полная схема событий

### Жизненный цикл задачи (Task Lifecycle)

```
taskCreated ──> taskStarted ──> [message]* ──> taskCompleted
                                    │                │
                                    │           или taskAborted
                                    │
                            (параллельно):
                            taskActive
                            taskInteractive
                            taskResumable
                            taskIdle
                            taskPaused / taskUnpaused
                            taskFocused / taskUnfocused
                            taskSpawned (подзадачи)
                            taskModeSwitched
                            taskAskResponded
                            taskToolFailed
                            taskTokenUsageUpdated
                            taskUserMessage
```

### Все события (из rooCodeEventsSchema)

| Событие | Payload | Описание |
|---------|---------|----------|
| `taskCreated` | `(taskId: string)` | Задача создана |
| `taskStarted` | `(taskId: string)` | Задача начата |
| **`taskCompleted`** | `(taskId, tokenUsage, toolUsage, { isSubtask })` | **Задача завершена** |
| `taskAborted` | `(taskId: string)` | Задача прервана |
| `taskFocused` | `(taskId: string)` | Задача получила фокус |
| `taskUnfocused` | `(taskId: string)` | Задача потеряла фокус |
| `taskActive` | `(taskId: string)` | Задача активна (выполняется) |
| `taskInteractive` | `(taskId: string)` | Задача ждёт интерактивного ввода |
| `taskResumable` | `(taskId: string)` | Задача может быть возобновлена |
| `taskIdle` | `(taskId: string)` | Задача в ожидании |
| `taskPaused` | `(taskId: string)` | Задача приостановлена |
| `taskUnpaused` | `(taskId: string)` | Задача возобновлена |
| `taskSpawned` | `(parentTaskId, childTaskId)` | Создана подзадача |
| **`message`** | `({ taskId, action, message: ClineMessage })` | **Сообщение в чате** |
| `taskModeSwitched` | `(taskId, mode)` | Переключён режим |
| `taskAskResponded` | `(taskId: string)` | Пользователь ответил на ask |
| `taskUserMessage` | `(taskId: string)` | Пользователь отправил сообщение |
| `taskToolFailed` | `(taskId, tool, error)` | Инструмент завершился с ошибкой |
| `taskTokenUsageUpdated` | `(taskId, tokenUsage)` | Обновление расхода токенов |

### Подписка на события через API (строки 887007-887075)

```javascript
// Внутри API класса — registerListeners():
provider.on("taskCreated", (task) => {
    task.on("taskStarted",   () => this.emit("taskStarted", task.taskId));
    task.on("taskCompleted",  (_, tokenUsage, toolUsage) =>
        this.emit("taskCompleted", task.taskId, tokenUsage, toolUsage, { isSubtask: !!task.parentTaskId }));
    task.on("taskAborted",   () => this.emit("taskAborted", task.taskId));
    task.on("message",       (message) =>
        this.emit("message", { taskId: task.taskId, ...message }));
    // ... все остальные события
    this.emit("taskCreated", task.taskId);
});
```

---

## 4. Формат сообщений (ClineMessage)

### Схема (строка 15230)

```typescript
interface ClineMessage {
    ts: number;                    // timestamp
    type: "ask" | "say";           // тип: вопрос или высказывание
    ask?: ClineAsk;                // подтип ask
    say?: ClineSay;                // подтип say
    text?: string;                 // ТЕКСТ СООБЩЕНИЯ ← то что нам нужно
    images?: string[];             // картинки (base64)
    partial?: boolean;             // true = стрим не закончен
    reasoning?: string;            // reasoning блок
    conversationHistoryIndex?: number;
    checkpoint?: Record<string, unknown>;
    progressStatus?: { icon?: string; text?: string };
    contextCondense?: { cost, prevContextTokens, newContextTokens, summary };
    isProtected?: boolean;
    apiProtocol?: "openai" | "anthropic";
    isAnswered?: boolean;
    metadata?: { kiloCode?: KiloCodeMetaData };
}
```

### Типы ClineAsk (подтипы вопросов)

```
"followup"                    — уточняющий вопрос пользователю
"command"                     — подтверждение выполнения команды
"command_output"              — вывод команды
"completion_result"           — ★ РЕЗУЛЬТАТ ЗАВЕРШЕНИЯ (attempt_completion)
"tool"                        — подтверждение использования инструмента
"api_req_failed"              — API запрос не удался
"resume_task"                 — предложение возобновить задачу
"resume_completed_task"       — предложение возобновить завершённую
"mistake_limit_reached"       — лимит ошибок достигнут
"browser_action_launch"       — запуск браузерного действия
"use_mcp_server"              — использование MCP сервера
"auto_approval_max_req_reached" — лимит авто-подтверждений
"payment_required_prompt"     — требуется оплата (KiloCode)
"invalid_model"               — невалидная модель
"report_bug"                  — отчёт об ошибке
"condense"                    — конденсация контекста
"checkpoint_restore"          — восстановление чекпоинта
```

### Типы ClineSay (подтипы высказываний)

```
"error"                       — ошибка
"api_req_started"             — API запрос начат
"api_req_finished"            — API запрос завершён
"text"                        — ★ ТЕКСТОВОЕ СООБЩЕНИЕ АГЕНТА
"image"                       — изображение
"reasoning"                   — reasoning
"completion_result"           — ★ РЕЗУЛЬТАТ ЗАВЕРШЕНИЯ
"user_feedback"               — обратная связь от пользователя
"command_output"              — вывод команды
"subtask_result"              — результат подзадачи
"condense_context"            — конденсация контекста
... и другие служебные
```

---

## 5. Ключевые события для перехвата

### Что нам нужно ловить

Нам нужны ДВА момента:

#### Момент 1: `message` с `ask === "completion_result"`

Это событие `attempt_completion` — агент считает что ЗАКОНЧИЛ задачу.
В `message.text` лежит **результат работы** (summary что сделано).

```typescript
api.on('message', ({ taskId, action, message }) => {
    if (message.type === 'ask' && message.ask === 'completion_result' && message.text) {
        // message.text = "Я добавил функцию авторизации в server.py..."
        lastCompletionText.set(taskId, message.text);
    }
});
```

#### Момент 2: `taskCompleted`

Задача **окончательно** завершена (пользователь принял результат).

```typescript
api.on('taskCompleted', (taskId, tokenUsage, toolUsage, { isSubtask }) => {
    if (isSubtask) return;  // подзадачи не коммитим отдельно

    const completionText = lastCompletionText.get(taskId);
    if (completionText) {
        // → парсер/фильтр → confirmGroup(cleanedText)
    }
    lastCompletionText.delete(taskId);
});
```

### Почему ДВА события, а не одно

- `taskCompleted` не содержит текст сообщения — только taskId и usage
- `message` с `completion_result` содержит текст, но задача может быть ещё не подтверждена
- **Стратегия**: копим текст из `message`, коммитим при `taskCompleted`

### Альтернатива: `say === "completion_result"`

После того как пользователь **принимает** `ask:completion_result`,
агент может отправить `say:completion_result` с тем же текстом.
Можно использовать как backup.

---

## 6. Архитектура универсального адаптера

### Интерфейс адаптера

```typescript
interface AIAgentAdapter {
    readonly extensionId: string;     // 'stormcode.storm-code'
    readonly name: string;            // 'Storm Code'

    isAvailable(): boolean;           // расширение установлено и активно
    connect(): void;                  // подписаться на события
    disconnect(): void;               // отписаться

    // Callback'и
    onTaskCompleted?: (taskId: string, summaryText: string) => void;
}
```

### Конкретные адаптеры

```typescript
// Адаптер для Storm Code / Roo Code (одна и та же кодовая база)
class RooCodeAdapter implements AIAgentAdapter {
    readonly extensionId = 'stormcode.storm-code';
    readonly name = 'Storm Code';

    private api: any;  // EventEmitter
    private lastCompletion = new Map<string, string>();

    isAvailable(): boolean {
        const ext = vscode.extensions.getExtension(this.extensionId);
        return ext?.isActive ?? false;
    }

    connect(): void {
        const ext = vscode.extensions.getExtension(this.extensionId);
        this.api = ext?.exports;
        if (!this.api) return;

        // Ловим текст завершения
        this.api.on('message', ({ taskId, message }) => {
            if (message.partial) return;  // стрим ещё идёт
            if (message.type === 'ask' && message.ask === 'completion_result' && message.text) {
                this.lastCompletion.set(taskId, message.text);
            }
        });

        // Ловим окончание задачи
        this.api.on('taskCompleted', (taskId, tokenUsage, toolUsage, { isSubtask }) => {
            if (isSubtask) return;
            const text = this.lastCompletion.get(taskId);
            if (text) {
                this.onTaskCompleted?.(taskId, text);
            }
            this.lastCompletion.delete(taskId);
        });
    }
}
```

### Менеджер адаптеров

```typescript
class AIAgentManager {
    private adapters: AIAgentAdapter[] = [];

    register(adapter: AIAgentAdapter): void {
        this.adapters.push(adapter);
    }

    connectAll(): void {
        for (const adapter of this.adapters) {
            if (adapter.isAvailable()) {
                adapter.onTaskCompleted = (taskId, text) => {
                    this.handleTaskCompleted(adapter.name, taskId, text);
                };
                adapter.connect();
            }
        }
    }

    private handleTaskCompleted(agentName: string, taskId: string, rawText: string): void {
        // 1. Парсер/фильтр текста
        const cleanText = this.parseCommitMessage(rawText);
        // 2. Отправить в LocalHub → confirmGroup(cleanText)
        // 3. Лог
    }

    private parseCommitMessage(raw: string): string {
        // Убрать мусор AI (маркеры, цитаты, приветствия и т.д.)
        // Вернуть чистый текст для коммита
        return raw;
    }
}

// Регистрация всех поддерживаемых агентов
const manager = new AIAgentManager();
manager.register(new RooCodeAdapter('stormcode.storm-code', 'Storm Code'));
manager.register(new RooCodeAdapter('RooVeterinaryInc.roo-cline', 'Roo Code'));
// В будущем:
// manager.register(new CopilotChatAdapter());
// manager.register(new ContinueAdapter());
manager.connectAll();
```

### Почему RooCodeAdapter подходит для нескольких расширений

Storm Code — форк Roo Code. У них **одинаковый API** (`class API extends EventEmitter`).
Один адаптер с разным `extensionId` работает для обоих.

---

## 7. Хранение чатов (файловая система)

### Путь к данным

```
%APPDATA%\Code\User\globalStorage\stormcode.storm-code\
├── tasks\
│   ├── {taskId-uuid}\
│   │   ├── api_conversation_history.json   ← разговор с AI API
│   │   └── ui_messages.json                ← сообщения в UI (ClineMessage[])
│   ├── {другой-taskId}\
│   │   └── ...
├── settings\
├── sessions\
├── cache\
└── storm-agent\
```

### ui_messages.json — формат

Массив `ClineMessage[]`. Последний элемент с `ask === "completion_result"` — это финальное сообщение агента.

### Когда использовать файлы (а не EventEmitter)

- **Чтение истории задач** — например "покажи все коммиты сделанные агентом"
- **Fallback** — если пропустили событие (расширение было перезагружено)
- **Доступ к старым чатам** — для ретроспективного анализа

---

## 8. Точка интеграции: attempt_completion

### Что такое attempt_completion

Это **инструмент** агента (tool). Когда AI-агент считает что закончил задачу,
он вызывает `attempt_completion` с параметром `result` — текстовое описание что сделано.

### Цепочка

```
AI-агент решает что закончил
        │
        ▼
attempt_completion(result: "Добавил авторизацию в server.py...")
        │
        ▼
ClineMessage { type: "ask", ask: "completion_result", text: result }
        │
        ▼
Пользователь видит в UI и нажимает "Accept" (или "Reject")
        │
        ├─ Accept → taskCompleted event
        │
        └─ Reject → агент продолжает работу
```

### Что ловим

```
message { ask: "completion_result", text: "..." }  ← ТЕКСТ для коммита
                     +
taskCompleted { taskId }                            ← ПОДТВЕРЖДЕНИЕ завершения
                     =
          autoCommit с чистым текстом
```

---

## 9. UI: настройки в LHL Mode (Autopilot)

### Новый блок в Settings WebView

В секцию **LHL Mode (Autopilot)** добавить:

```
┌────────────────────────────────────────────────────┐
│ ⚡ AI Agent Auto-Commit                            │
│                                                    │
│ Enable AI Auto-Commit         [OFF ─── / ─── ON]  │
│ Auto-confirm group when AI agent completes task    │
│                                                    │
│ Connected Agents:                                  │
│   ✅ Storm Code (active)                           │
│   ⬚ Roo Code (not installed)                      │
│   ⬚ Copilot Chat (not supported)                  │
│                                                    │
│ Text Filter                                        │
│ Clean AI response before using as commit message   │
│   ☑ Remove greetings and filler                    │
│   ☑ Extract first sentence only                    │
│   ☐ Use custom regex filter                        │
│                                                    │
│ ⚠ When ON, pending changes are auto-confirmed     │
│   when a connected AI agent completes its task.    │
│   The agent's completion message becomes the       │
│   group description.                               │
└────────────────────────────────────────────────────┘
```

### Настройки

| Ключ | Тип | Default | Описание |
|------|-----|---------|----------|
| `aiAutoCommit` | bool | false | Включить авто-коммит от AI |
| `aiAutoCommitFilter` | string | "first_sentence" | Режим фильтрации текста |
| `aiAutoCommitAgents` | string[] | ["stormcode.storm-code"] | Список отслеживаемых расширений |

---

## 10. План реализации

### Фаза 1: Базовый перехват (MVP)

1. Создать `src/ai-agent-adapter.ts` — интерфейс адаптера + RooCodeAdapter
2. Создать `src/ai-agent-manager.ts` — менеджер адаптеров
3. В `extension.ts` — инициализация менеджера при активации
4. При `taskCompleted` — вызов `api.confirmGroup(text)`
5. Добавить тумблер в Settings WebView

### Фаза 2: Парсер текста

1. Создать `src/ai-commit-parser.ts` — фильтр/очистка AI-ответов
2. Правила: убрать приветствия, маркеры, оставить суть
3. Опция "только первое предложение"

### Фаза 3: Универсальность

1. Добавить адаптер для Roo Code (тот же класс, другой extensionId)
2. Исследовать API других AI-расширений
3. UI со списком подключённых агентов

### Фаза 4: Семантический детектор (будущее)

1. Анализ паттернов файловых изменений
2. Кросс-файловые триггеры
3. Автогруппировка по "законченной мысли"

---

## 11. Где оставить комментарии в Storm Code

Поскольку Storm Code — твоя программа, нужно оставить маркеры в коде
чтобы при обновлении Roo Code (upstream) знать что LocalHub использует.

### В `extension/api.ts` (исходник, до сборки)

```typescript
// ═══════════════════════════════════════════════════════════════
// LOCALHUB INTEGRATION POINT
// LocalHub extension subscribes to these events via exports API:
//   - 'message' event (to capture completion_result text)
//   - 'taskCompleted' event (to trigger auto-commit)
// DO NOT remove or rename these events without updating LocalHub.
// See: localhub-vscode/docs/smart-auto-commit-architecture.md
// ═══════════════════════════════════════════════════════════════
```

### В `packages/types/src/events.ts`

```typescript
// LOCALHUB: events 'taskCompleted' and 'message' are consumed by
// LocalHub extension for AI auto-commit feature.
// Payload format must remain backward-compatible.
```

### В `packages/types/src/message.ts`

```typescript
// LOCALHUB: 'completion_result' (both ask and say) is used by
// LocalHub to extract the final task summary for auto-commit.
// Field 'text' must contain the human-readable result description.
```

### В `activate()` (строка 895685)

```typescript
// LOCALHUB: The API object returned here is consumed by LocalHub
// extension via vscode.extensions.getExtension('stormcode.storm-code').exports
// It must be an EventEmitter with events defined in rooCodeEventsSchema.
return new API(outputChannel2, provider, socketPath, enableLogging);
```

---

## Ключевые строки в dist/extension.js (справочник)

| Строка | Что | Зачем нам |
|--------|-----|-----------|
| 15141-15163 | `clineAsks` — типы ask | Знать все типы вопросов |
| 15190-15217 | `clineSays` — типы say | Знать все типы высказываний |
| 15230-15251 | `clineMessageSchema` | Формат сообщения |
| 15336-15370 | `rooCodeEventsSchema` | Все события API |
| 886871-887077 | `class API extends EventEmitter` | Публичный API |
| 887008-887075 | `registerListeners()` | Подписка на события task |
| 887015-887023 | `task.on('taskCompleted')` | Событие завершения |
| 887056-887062 | `task.on('message')` | Событие сообщения |
| 895685 | `return new API(...)` | Точка возврата API |

---

*Документ создан 2026-03-06.*
*Основан на: Storm Code 4.131.2 (форк Roo Code), @roo-code/types.*
*Roo Code — открытый исходный код (RooVetGit/Roo-Code на GitHub).*
