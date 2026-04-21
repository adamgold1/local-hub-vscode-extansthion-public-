# Генерация коммит-сообщений: полная документация

> Как работает кнопка ✨ (Generate Summary / Generate Commit Message)
> для LocalHub и для Git, цепочка вызовов, промпты, настройки.

---

## Оглавление

1. [Общая архитектура](#1-общая-архитектура)
2. [Провод Git (SCM)](#2-провод-git-scm)
3. [Провод LocalHub (Pending)](#3-провод-localhub-pending)
4. [Общий движок: CommitMessageGenerator](#4-общий-движок-commitmessagegenerator)
5. [Промпт COMMIT_MESSAGE](#5-промпт-commit_message)
6. [Цепочка fallback'ов в LocalHub](#6-цепочка-fallbackов-в-localhub)
7. [Настройки в UI Storm Code](#7-настройки-в-ui-storm-code)
8. [Custom Instructions и Rules](#8-custom-instructions-и-rules)
9. [Что отправляется AI](#9-что-отправляется-ai)
10. [Схема вызовов (визуальная)](#10-схема-вызовов-визуальная)
11. [Ключевые файлы и строки](#11-ключевые-файлы-и-строки)
12. [FAQ](#12-faq)

---

## 1. Общая архитектура

Два **разных провода** (точки входа), но **один движок** генерации.

```
Git SCM panel ─── кнопка ✨ ──> storm-code.vsc.generateCommitMessage
                                        │
                                        ▼
                                CommitMessageGenerator
                                   (один класс)
                                        ▲
                                        │
LocalHub Pending ─ кнопка ✨ ──> localhub.generateSummary
                                        │
                                        ▼
                              storm-code.generateLocalhubCommit
```

- **Провод** = разные команды, разные точки входа, разные данные
- **Движок** = один и тот же `CommitMessageGenerator`
- **Промпт** = один и тот же `COMMIT_MESSAGE` template
- **Настройки** = одни, применяются к обоим

---

## 2. Провод Git (SCM)

### Кнопка
Расположена в Git Source Control panel (стандартная VS Code SCM).

### Команда
`storm-code.vsc.generateCommitMessage`

### Зарегистрирована в
`stormcode.storm-code/package.json` строка 250:
```json
{
  "command": "storm-code.vsc.generateCommitMessage",
  "title": "Generate Commit Message"
}
```

### Привязана к меню
- `scm/title` — title bar Git SCM панели (строка 432)
- `scm/input` — поле ввода Git SCM (строка 438)

### Что делает
1. Получает `git diff --staged` (staged changes)
2. Строит `gitContext` — текстовый блок с диффом
3. Вызывает `CommitMessageGenerator.generateMessage({ gitContext })`
4. Результат записывает в `repository.inputBox.value` (Git SCM input box)

### Данные
- Источник: `git diff` (через VS Code Git API)
- Формат: стандартный unified diff

---

## 3. Провод LocalHub (Pending)

### Кнопка
Расположена в LocalHub Pending Changes panel (WebviewView).

### Команда (LocalHub сторона)
`localhub.generateSummary`

### Зарегистрирована в
`localhub-vscode/src/extension.ts` строка ~3355:
```typescript
vscode.commands.registerCommand('localhub.generateSummary', async () => { ... })
```

### Что делает LocalHub
1. Вызывает `api.getPendingChanges()` — получает список pending файлов из Python сервера
2. Строит `autoMessage` — fallback из имён файлов и номеров версий
3. Собирает **диффы из LocalHub** через `api.getDiff(file.path, file.latest_version)` (до 5 файлов, до 8000 символов)
4. Вызывает Storm Code: `vscode.commands.executeCommand('storm-code.generateLocalhubCommit', { diffs, pending })`
5. Если Storm Code вернул текст — ставит в WebView input поле
6. Если Storm Code недоступен — использует `autoMessage`

### Команда (Storm Code сторона)
`storm-code.generateLocalhubCommit`

### Зарегистрирована в
`stormcode.storm-code/dist/extension.js` строка 677403:
```javascript
generateLocalhubCommit: async (data3 = {}) => { ... }
```

**НЕ зарегистрирована в package.json** — это внутренняя команда, не видна в Command Palette.

### Что делает Storm Code при вызове от LocalHub
1. Извлекает `data3.diffs` (диффы от LocalHub) и `data3.pending` (список файлов)
2. Определяет `workspacePath`
3. Пробует основной путь → fallback "same-template" → fallback "legacy"
4. Возвращает сгенерированную строку обратно LocalHub

---

## 4. Общий движок: CommitMessageGenerator

### Файл
`stormcode.storm-code/dist/extension.js` строка 667888
(исходник: `services/commit-message/CommitMessageGenerator.ts`)

### Класс
```javascript
CommitMessageGenerator {
  providerSettingsManager;     // доступ к API конфигурациям
  previousGitContext;          // для "generate different" при повторном нажатии
  previousCommitMessage;       // предыдущее сообщение

  generateMessage({ gitContext, onProgress }) → string
  buildPrompt(gitContext, options) → string
  callAIForCommitMessage(gitContext, onProgress) → string
}
```

### Используется в обоих проводах
- **Git**: напрямую через `storm-code.vsc.generateCommitMessage`
- **LocalHub**: через fallback "same-template" (строка 677150):
  ```javascript
  const messageGenerator = new CommitMessageGenerator(providerSettingsManager);
  const gitContext = buildLocalhubGitContext(data3, workspacePath);
  const message = await messageGenerator.generateMessage({ gitContext });
  ```

### buildPrompt()
Строка 667927. Вызывает:
```javascript
const customInstructions = await addCustomInstructions("", "", "", "commit", {
  language: "en",
  localRulesToggleState: void 0,
  globalRulesToggleState: void 0
});
```
Это подтягивает custom rules из файлов `.kilocoderules-commit` и папки `.kilocode/rules-commit/`.

---

## 5. Промпт COMMIT_MESSAGE

### Где хранится шаблон
`stormcode.storm-code/dist/extension.js` строка 55791
(исходник: `shared/support-prompt.ts` → `supportPromptConfigs.COMMIT_MESSAGE`)

### Полный текст шаблона по умолчанию

```
# Conventional Commit Message Generator

## System Instructions
You are an expert Git commit message generator that creates conventional
commit messages based on staged changes. Analyze the provided git diff
output and generate appropriate conventional commit messages following
the specification.

${customInstructions}

## CRITICAL: Commit Message Output Rules
- DO NOT include any memory bank status indicators
- DO NOT include any task-specific formatting
- ONLY Generate a clean conventional commit message

${gitContext}

## Conventional Commits Format
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]

### Core Types
- feat: New feature (MINOR version bump)
- fix: Bug fix (PATCH version bump)

### Additional Types
- docs, style, refactor, perf, test, build, ci, chore, revert

### Description Rules
- Imperative mood ("add" not "added")
- Lowercase first letter
- No period at end
- Max 50 characters

### Body Guidelines
- Explain "what" and "why", not "how"
- Wrap at 72 characters

Return ONLY the commit message, nothing else.
```

### Переменные в шаблоне
- `${customInstructions}` — пользовательские инструкции из Settings + rules файлов
- `${gitContext}` — дифф (из Git или из LocalHub, в зависимости от провода)

### Можно ли редактировать
**ДА.** Через UI Storm Code: Settings → Prompts → Support Prompts → COMMIT_MESSAGE.
Изменённый промпт сохраняется в `customSupportPrompts` в глобальном состоянии Storm Code.
При вызове: `supportPrompt.get(customSupportPrompts, "COMMIT_MESSAGE")` — если есть кастомный, используется он, иначе дефолтный.

---

## 6. Цепочка fallback'ов в LocalHub

Когда LocalHub вызывает `storm-code.generateLocalhubCommit`, внутри Storm Code происходит каскад из трёх попыток:

### Попытка 1: Основной pipeline
Строка 677426:
```javascript
result = await vscode.commands.executeCommand(
  "storm-code.jetbrains.generateCommitMessage",  // ← тот же движок что для Git
  [workspacePath, selectedFiles]
);
```
Вызывает **ту же команду** что и для JetBrains IDE. Передаёт workspace + файлы.
Таймаут: 45 секунд (`LOCALHUB_PIPELINE_TIMEOUT_MS`).

### Попытка 2: Same-template fallback
Строка 677147:
```javascript
const messageGenerator = new CommitMessageGenerator(providerSettingsManager);
const gitContext = buildLocalhubGitContext(data3, workspacePath);
const message = await messageGenerator.generateMessage({ gitContext });
```
Создаёт `CommitMessageGenerator` напрямую и передаёт LocalHub данные через `buildLocalhubGitContext()`.

### Попытка 3: Legacy fallback
Строка 677166:
```javascript
const fallback = await runLocalhubLegacyFallbackGeneration(data3, outputChannel);
```
Использует упрощённый захардкоженный промпт `buildLocalhubFallbackPrompt()`:
```
You are an expert Git commit message generator.
Analyze the diff below and write a conventional commit message.
...
```

### Попытка 4: autoMessage (LocalHub сторона)
Если все три попытки Storm Code провалились, LocalHub использует свой `autoMessage`:
```
3 files (15 changes): server.py (v3→v11, 9 changes), api.ts (v1→v5, 4 changes)...
```
Это чисто текстовое описание без AI.

---

## 7. Настройки в UI Storm Code

### Как открыть
1. Storm Code sidebar → ⚙️ (шестерёнка) в title bar
2. Или: `Ctrl+Shift+P` → `Storm Code: Settings`
3. Перейти в раздел **Prompts** → **Support Prompts**

### Что можно настроить

| Настройка | Где в UI | Что делает |
|-----------|----------|------------|
| **Промпт COMMIT_MESSAGE** | Support Prompts → COMMIT_MESSAGE | Текст промпта для генерации коммит-сообщений. Textarea, можно редактировать |
| **API Configuration** | Support Prompts → COMMIT_MESSAGE → API Config | Какой API-ключ/модель использовать для генерации коммитов (`commitMessageApiConfigId`) |
| **Промпт ENHANCE** | Support Prompts → ENHANCE | Промпт для улучшения текста (не связан с коммитами) |

### Как работает кастомный промпт
```javascript
// shared/support-prompt.ts
supportPrompt = {
  get: (customSupportPrompts, type) => {
    return customSupportPrompts?.[type] ?? supportPromptConfigs[type].template;
    //     ^^^^^^^^^^^^^^^^^^^^^^^^         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //     кастомный (если есть)            дефолтный (если нет)
  }
}
```

Если ты отредактировал промпт в UI — `customSupportPrompts.COMMIT_MESSAGE` будет содержать твой текст. Если не редактировал — используется дефолтный template.

### Важно
**Один промпт на оба провода.** Редактируешь COMMIT_MESSAGE — меняется и для Git, и для LocalHub.

---

## 8. Custom Instructions и Rules

Помимо промпта COMMIT_MESSAGE, в генерацию подмешиваются дополнительные инструкции.

### Файлы rules
Storm Code ищет в проекте:
- `.kilocode/rules-commit/` — папка с `.md` файлами правил для режима `commit`
- `.kilocoderules-commit` — файл правил для режима `commit`

Если найдены — их содержимое вставляется в `${customInstructions}` внутри промпта.

### Custom Instructions из Settings
Global Instructions и Mode-specific Instructions из настроек Storm Code тоже подмешиваются.

### Порядок приоритета
1. Language Preference (язык ответа)
2. Global Custom Instructions (из Settings)
3. Mode-specific Instructions (из Settings)
4. Rules файлы (`.kilocode/rules-commit/` или `.kilocoderules-commit`)

---

## 9. Что отправляется AI

### Для Git
```
[промпт COMMIT_MESSAGE с ${customInstructions}]

## Git Context for Commit Message Generation

### Full Diff of Selected Changes
```diff
[git diff --staged]
```

### Change Summary
```
Modified: src/server.py
Added: src/new-file.ts
```
```

### Для LocalHub
```
[тот же промпт COMMIT_MESSAGE с ${customInstructions}]

## Git Context for Commit Message Generation

### Full Diff of Selected Changes (LocalHub)
```diff
--- python/server.py ---
[дифф из api.getDiff(), до 5 файлов, до 8000 символов]
```

### Change Summary
```
Modified (selected): python/server.py
Modified (selected): src/api.ts
```

### Repository Context
**Source:** `LocalHub selected changes`
```

### Разница в данных

| Аспект | Git | LocalHub |
|--------|-----|----------|
| Дифф | `git diff --staged` | `api.getDiff(path, version)` — дифф между версиями LocalHub |
| Файлы | staged files из Git index | pending files из LocalHub SQLite |
| Лимит | весь staged дифф | до 5 файлов, до 8000 символов |
| Метка | нет | `(LocalHub)`, `(selected)`, `Source: LocalHub selected changes` |

---

## 10. Схема вызовов (визуальная)

```
╔══════════════════════════════════════════════════════════════════════╗
║                        КНОПКА ✨ в Git SCM                          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  [Git SCM Panel] ──✨──> storm-code.vsc.generateCommitMessage        ║
║                              │                                       ║
║                              ▼                                       ║
║                    git diff --staged                                 ║
║                              │                                       ║
║                              ▼                                       ║
║                    CommitMessageGenerator.generateMessage()           ║
║                              │                                       ║
║                              ▼                                       ║
║                    buildPrompt(gitContext)                            ║
║                      ├─ промпт COMMIT_MESSAGE                       ║
║                      ├─ ${customInstructions} (rules, settings)      ║
║                      └─ ${gitContext} (git diff)                     ║
║                              │                                       ║
║                              ▼                                       ║
║                    callAIForCommitMessage() ──> API (модель)         ║
║                              │                                       ║
║                              ▼                                       ║
║                    repository.inputBox.value = result                 ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════════════╗
║                     КНОПКА ✨ в LocalHub Pending                     ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  [Pending Panel] ──✨──> localhub.generateSummary                    ║
║                              │                                       ║
║                    ┌─────────┴─────────┐                             ║
║                    ▼                   ▼                              ║
║          api.getPendingChanges()   api.getDiff() x5                  ║
║          (список файлов)           (диффы LocalHub)                  ║
║                    │                   │                              ║
║                    └─────────┬─────────┘                             ║
║                              ▼                                       ║
║            autoMessage = "3 files (15 changes): ..."                 ║
║                              │                                       ║
║                              ▼                                       ║
║          vscode.commands.executeCommand(                             ║
║            'storm-code.generateLocalhubCommit',                      ║
║            { diffs, pending }                                        ║
║          )                                                           ║
║                              │                                       ║
║              ┌───────────────┼───────────────┐                       ║
║              ▼               ▼               ▼                       ║
║         Попытка 1       Попытка 2       Попытка 3                    ║
║         jetbrains.      CommitMessage   Legacy                       ║
║         generate        Generator       Fallback                     ║
║         CommitMessage   (напрямую)      Prompt                       ║
║              │               │               │                       ║
║              └───────┬───────┘───────┬───────┘                       ║
║                      ▼               ▼                               ║
║               AI результат      или autoMessage                      ║
║                      │                                               ║
║                      ▼                                               ║
║          pendingWebviewProvider.setMessage(result)                    ║
║          (ставит текст в input поле WebView)                         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 11. Ключевые файлы и строки

### LocalHub (наш код)

| Файл | Строка | Что |
|------|--------|-----|
| `src/extension.ts` | ~3355 | `localhub.generateSummary` — команда кнопки ✨ |
| `src/extension.ts` | ~3366 | `api.getPendingChanges()` — получение pending файлов |
| `src/extension.ts` | ~3402 | `api.getDiff()` — сбор диффов из LocalHub |
| `src/extension.ts` | ~3410 | `executeCommand('storm-code.generateLocalhubCommit')` — вызов Storm Code |
| `src/extension.ts` | ~3425 | `aiMessage \|\| autoMessage` — fallback на autoMessage |
| `src/pending-webview-provider.ts` | — | WebView с кнопкой ✨ и input полем |

### Storm Code (чужой код, read-only)

| Файл | Строка | Что |
|------|--------|-----|
| `dist/extension.js` | 55791 | `supportPromptConfigs.COMMIT_MESSAGE` — шаблон промпта |
| `dist/extension.js` | 55866 | `supportPrompt.get()` — выбор кастомного или дефолтного промпта |
| `dist/extension.js` | 56358 | `addCustomInstructions()` — подмешивание rules и instructions |
| `dist/extension.js` | 667888 | `CommitMessageGenerator` class — движок генерации |
| `dist/extension.js` | 667927 | `buildPrompt()` — сборка финального промпта |
| `dist/extension.js` | 676986 | `LOCALHUB_COMMIT_MESSAGE_COMMAND` = `"storm-code.jetbrains.generateCommitMessage"` |
| `dist/extension.js` | 677091 | `buildLocalhubFallbackPrompt()` — legacy fallback промпт |
| `dist/extension.js` | 677115 | `buildLocalhubGitContext()` — формирование контекста из LocalHub данных |
| `dist/extension.js` | 677147 | `runLocalhubTemplateFallbackGeneration()` — same-template fallback |
| `dist/extension.js` | 677166 | `runLocalhubLegacyFallbackGeneration()` — legacy fallback |
| `dist/extension.js` | 677403 | `generateLocalhubCommit` — точка входа от LocalHub |
| `package.json` | 250 | `storm-code.vsc.generateCommitMessage` — команда для Git |
| `package.json` | 432, 438 | Привязка к `scm/title` и `scm/input` |

### WebView UI Storm Code

| Файл | Что |
|------|-----|
| `webview-ui/build/assets/index.js` | Компонент `z8` — настройка API для COMMIT_MESSAGE |
| `webview-ui/build/assets/index.js` | Support Prompts секция — редактирование промптов |
| `webview-ui/build/assets/chunk-CrLIRoIC.js` | Локализации для COMMIT_MESSAGE label |

---

## 12. FAQ

### LocalHub работает без Storm Code?
**ДА.** Если Storm Code не установлен, кнопка ✨ сгенерирует `autoMessage` — текстовое описание из имён файлов и версий, без AI.

### LocalHub работает без Git?
**ДА.** LocalHub полностью независим от Git. Все данные берутся из LocalHub SQLite базы.

### Можно ли использовать разные промпты для Git и LocalHub?
**НЕТ.** Промпт `COMMIT_MESSAGE` один. Оба провода используют один и тот же шаблон.

### Можно ли использовать разные API-модели для Git и LocalHub?
**ДА.** В настройках есть `commitMessageApiConfigId` — можно выбрать другую модель для генерации коммитов (применяется к обоим).

### Где хранятся кастомные промпты?
В глобальном состоянии Storm Code (`customSupportPrompts`). Сохраняется через `vscode.postMessage({ type: "customSupportPrompts", ... })`.

### Кнопка ✓ (Confirm) связана с ✨?
**НЕТ.** ✓ = `localhub.confirmGroup` — подтверждает pending группу. ✨ = генерирует текст сообщения. Это два разных действия. ✨ заполняет текстовое поле, ✓ подтверждает группу с этим текстом.

---

*Документ создан 2026-03-06. Версия Storm Code: 4.131.2.*
