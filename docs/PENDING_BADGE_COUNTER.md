# PENDING CHANGES — Badge Counter

## ЗАПРЕЩЕНО ТРОГАТЬ

Badge counter прошёл полный цикл отладки. **ЗАПРЕЩЕНО** менять, рефакторить,
"улучшать" или трогать логику событий и обновления badge.
Кто сломает — того выебу в жопу.

---

## Как работает badge

Badge — число на секции **PENDING CHANGES** в сайдбаре. Показывает количество
файлов с несохранёнными изменениями (pending) **ТОЛЬКО для текущего проекта**.

Цифра на иконке LU в activity bar — это СУММА badge'ей всех секций в контейнере
(Pending Changes + Global Watcher и т.д.). Это поведение VS Code, не наше.

### Файлы

| Файл | Что делает |
|------|-----------|
| `src/pending-webview-provider.ts` | `setBadge(count)` — устанавливает badge на WebviewView |
| `src/extension.ts` | `updatePendingBadge()` — вызывает API и setBadge. `refreshAllUI()` — обновляет всё |

### Метод setBadge

```typescript
// pending-webview-provider.ts
public setBadge(count: number): void {
    this._pendingBadgeCount = count;
    if (this._view) {
        this._view.badge = count > 0
            ? { value: count, tooltip: `${count} files pending` }
            : undefined;
    }
}
```

- `count > 0` → badge с числом
- `count === 0` → badge убирается (`undefined`)
- `_pendingBadgeCount` — кэш для lazy resolve (WebView может быть ещё не создан)

---

## События, на которые реагирует badge

### 1. EVENT SIGNAL (автоматическое обновление)

**Источник:** Демон пишет в `.localhub/event_signal.txt` при каждом snapshot.

**Цепочка:**
```
daemon writes event_signal.txt
  → fs.watch fires (extension.ts:1837)
    → debounce 500ms
      → refreshAllUI()
        → pendingProvider.refresh()
          → _loadPendingFiles()
            → api.getPendingChanges()
              → setBadge(response.count)
```

**КРИТИЧНО:** Signal watcher создаёт файл если не существует (как Global Watcher).
Без этого fs.watch на Windows бросает ENOENT и watcher никогда не стартует.

### 2. CONFIRM GROUP (ручной коммит)

**Источник:** Пользователь нажал ✓ или Ctrl+Enter.

```
localhub.confirmGroup command (extension.ts:3411)
  → pendingProvider.refresh()
    → _loadPendingFiles() → setBadge()
```

### 3. GENERATE SUMMARY + CONFIRM (AI коммит)

**Источник:** Кнопка ✨ → Storm Code → автоматический confirm.

```
localhub.generateSummary command (extension.ts:3330+)
  → Storm Code pipeline
    → api.confirmGroup()
      → pendingProvider.refresh() → setBadge()
```

### 4. REFRESH GROUPS (кнопка Refresh)

**Источник:** Кнопка 🔄 на title bar секции.

```
localhub.refreshGroups command (extension.ts:3427)
  → pendingProvider.refresh() → setBadge()
```

### 5. REMOVE FROM GROUP

**Источник:** Удаление файла из группы.

```
localhub.removeFromGroup (extension.ts:3490)
  → pendingProvider.refresh() → setBadge()
```

### 6. ADD TO IGNORE / ADD DIR TO IGNORE

**Источник:** Файл или папка добавлены в .localhubignore.

```
localhub.addToIgnore (extension.ts:4688)
localhub.addDirToIgnore (extension.ts:4746)
  → pendingProvider.refresh() → setBadge()
```

### 7. RESTORE VERSION

**Источник:** Восстановление файла из истории.

```
localhub.restoreVersion (extension.ts:2584)
  → pendingProvider.refresh() → setBadge()
```

### 8. START / STOP PROJECT

**Источник:** Старт или остановка мониторинга проекта.

```
localhub.startThisProject (extension.ts:185)
localhub.stopThisProject (extension.ts:2166)
  → pendingProvider.refresh() → setBadge()
```

При Stop: `setBadge(0)` — badge убирается (проект не мониторится).

### 9. SWITCH BRANCH

**Источник:** Переключение ветки LocalHub.

```
localhub.switchBranch (extension.ts:5365, 5603)
  → pendingProvider.refresh() → setBadge()
```

### 10. DELETE SNAPSHOTS

**Источник:** Удаление снапшотов.

```
localhub.deleteSnapshots (extension.ts:3195)
  → pendingProvider.refresh() → setBadge()
```

### 11. INIT PROJECT

**Источник:** Инициализация проекта.

```
localhub.initProject (extension.ts:5396)
  → pendingProvider.refresh() → setBadge()
```

### 12. DAEMON RESTARTED

**Источник:** Демон перезапустился (краш, ручной рестарт).

```
localhub.internal.daemonRestarted (extension.ts:1876)
  → refreshAllUI() → pendingProvider.refresh() → setBadge()
```

### 13. WEBVIEW BECOMES VISIBLE

**Источник:** Пользователь раскрыл секцию Pending Changes.

```
webviewView.onDidChangeVisibility (pending-webview-provider.ts:79)
  → this.refresh() → _loadPendingFiles() → setBadge()
```

### 14. INITIAL ACTIVATION

**Источник:** Расширение активируется при открытии VS Code.

```
resolveWebviewView (pending-webview-provider.ts:87)
  → this.refresh() → _loadPendingFiles() → setBadge()

updatePendingBadge() (extension.ts:1806) — начальное обновление
```

---

## Аналогия с Global Watcher

Project signal watcher сделан **по аналогии** с Global Watcher signal watcher:

| Аспект | Global Watcher | Project Signal |
|--------|---------------|----------------|
| Файл | `~/.localhub_global/event_signal.txt` | `.localhub/event_signal.txt` |
| Создание файла | `if (!exists) writeFileSync('')` | `if (!exists) writeFileSync('')` |
| persistent | default (true) | default (true) |
| eventType check | `eventType === 'change'` | `eventType === 'change'` |
| error handler | `.on('error', () => {})` | `.on('error', () => {})` |
| debounce | нет (сразу emit) | 500ms (demon может писать быстро) |

---

## Что НЕ трогать

1. **`_loadPendingFiles()`** — badge обновляется из того же API ответа что и файл-лист. ОДНИМ вызовом. Не разделять.
2. **Signal watcher** — создание файла перед `fs.watch` ОБЯЗАТЕЛЬНО. Без этого watcher не стартует на Windows.
3. **`setBadge()`** — хранит `_pendingBadgeCount` для deferred apply при lazy resolve WebView.
4. **Все 14 событий выше** — каждое вызывает `pendingProvider.refresh()` → `setBadge()`. Не убирать ни одно.
