# LocalHub Daemon Architecture Contract (RU)

> Статус: **Normative / обязательный контракт**
> 
> Дата фиксации: **2026-02-28**
> 
> Область: `localhub-vscode` runtime (Extension + Tray + Python daemon)

---

## 1. Цель документа

Этот документ фиксирует **неизменяемую архитектуру** работы демона, Control Center, Global Watcher и LocalHub.

Ключевая идея:

1. **Один долгоживущий daemon-процесс** на машину.
2. **UI-панели не имеют права** самовольно убивать daemon при закрытии/перезагрузке IDE.
3. **Окно Control Center не должно выскакивать** на каждый reload VS Code.
4. **Никакого "зоопарка" процессов** при открытии новых окон IDE.

---

## 2. Нормативные инварианты (MUST / MUST NOT)

### 2.1 Daemon (Python)

1. MUST: существовать как единый runtime процесс для всех проектов.
2. MUST: обслуживать и LocalHub, и Global Watcher через общий HTTP API.
3. MUST: использовать PID/порт в `~/.localhub_daemon/daemon.pid`.
4. MUST: запускаться/переиспользоваться через поиск существующего процесса в диапазоне портов.
5. MUST NOT: перезапускаться из-за того, что пользователь просто открыл/закрыл окно Control Center.

### 2.2 Control Center (Electron tray)

1. MUST: быть отдельным UI-процессом, не равным daemon-процессу.
2. MUST: скрываться в трей при закрытии окна (а не убивать daemon).
3. MUST: работать по single-instance модели (второй запуск = сигнал уже существующему).
4. MUST NOT: автоматически появляться в лицо при каждом запуске/reload IDE.
5. MUST NOT: убивать daemon при `Quit` самого Control Center.

### 2.3 VS Code Extension (LocalHub)

1. MUST: на activation подключаться к уже живому daemon, а не плодить новый без необходимости.
2. MUST: при `deactivate()` не выполнять авто-stop daemon.
3. MUST: открывать/скрывать Control Center только по явному действию (кнопка/трей), кроме первого авто-показа.
4. MUST NOT: превращать reload VS Code в lifecycle-операцию daemon-а.

### 2.4 Global Watcher

1. MUST: жить внутри того же daemon (не отдельным сервером).
2. MUST: синхронизировать runtime-статус из daemon API (один источник истины).
3. MUST NOT: иметь отдельный конкурирующий "второй daemon".

---

## 3. Архитектурные графы по подсистемам

## 3.1 Control Center

```text
VS Code Command (localhub.openControlCenter)
        |
        v
ensureTrayApp(context, 'toggle')
        |
        v
[Single Tray Process] <-- requestSingleInstanceLock
        |
        +--> toggle/show BrowserWindow (UI only)
        |
        +--> IPC daemon:start/stop/restart (explicit only)
```

Ответственность:

1. Показать/скрыть UI.
2. Дать оператору кнопки управления daemon/GW.
3. Публиковать статус.

Не ответственность:

1. Пересоздавать daemon на каждый reload IDE.
2. Гасить daemon при закрытии окна.

## 3.2 Global Watcher

```text
Global Watcher UI (sidebar/full panel/control center)
        |
        v
GlobalWatcherManager (TS client)
        |
        v
Daemon endpoints: /gw/*, /settings, /health
        |
        v
Unified Python daemon runtime
```

Ответственность:

1. Мониторинг файловых изменений.
2. Snapshot/statistics/sync status.
3. Единая синхронизация статусов между панелями.

## 3.3 LocalHub (проектный контур)

```text
Editor events / commands
        |
        v
LocalHub API client + DaemonManager
        |
        v
Daemon endpoints: /daemon/*, /history/*, /groups/*, ...
        |
        v
Project storage: <project>/.localhub/*
```

Ответственность:

1. История/группы/ветки/restore.
2. Регистрация текущего проекта в уже живом daemon.

---

## 4. Разрешённый lifecycle

## 4.1 Первый запуск после установки

1. Extension поднимает/переиспользует Tray.
2. Допускается единоразовый auto-show окна Control Center.
3. Daemon поднимается один раз и сохраняет PID/порт.

## 4.2 Обычный запуск VS Code / Reload Window / второе окно IDE

1. Tray стартует в silent-режиме (без pop-up окна).
2. Extension переиспользует существующий daemon.
3. Если daemon уже жив, новый не создаётся.

## 4.3 Клик по статусбар-кнопке или иконке в трее

1. Один клик: показать окно.
2. Второй клик: скрыть окно в трей.
3. Daemon lifecycle не меняется.

## 4.4 Закрытие окна Control Center (крестик)

1. Окно скрывается.
2. Tray жив.
3. Daemon продолжает работать.

## 4.5 Quit Control Center

1. Закрывается только tray UI-процесс.
2. Daemon НЕ убивается автоматически.
3. Daemon остаётся доступен для IDE/CLI до явного stop.

## 4.6 Остановка daemon

Разрешена только явными действиями оператора:

1. Кнопка `Stop/Kill Daemon` в UI.
2. Явная команда, вызывающая `/daemon/shutdown`.

Запрещена как побочный эффект:

1. `deactivate()` extension.
2. Закрытие окна Control Center.
3. Reload VS Code.

---

## 5. Anti-zoo механизмы (защита от дубликатов)

1. Tray single-instance lock (`requestSingleInstanceLock`).
2. Launch lock в extension (`.tray_launch.lock`) против гонок старта.
3. DaemonManager:
   - поиск живого daemon через PID + скан портов;
   - защита от race condition;
   - cleanup duplicate daemons на других портах.
4. GW manager reattach к реальному порту daemon при смене/рестарте.

---

## 6. Источники истины по состоянию

1. Runtime daemon/gw status: только `daemon /health` + `/gw/status`.
2. Reliability mode: сначала daemon `/settings`, fallback на VS Code settings.
3. UI не должен считать себя источником истины без подтверждения daemon API.

---

## 7. Запрещённые архитектурные изменения

Любое из пунктов ниже считается регрессией:

1. Возврат авто-показа Control Center на каждый activation/reload.
2. Возврат авто-stop daemon в `extension.deactivate()`.
3. Привязка "закрыли окно панели => остановили daemon".
4. Введение второго отдельного daemon для GW рядом с основным.
5. Переключение режима/вкладки UI, которое неявно перезапускает daemon без явной команды.

---

## 8. Изменение этого контракта

Изменение правил из разделов 2 и 7 допускается только через RFC:

1. Причина изменения.
2. Какие инварианты меняются.
3. Как предотвращаются race/leak/duplicate процессы.
4. Чек-лист ручных проверок после внедрения.

Без RFC этот контракт считается **замороженным**.

---

## 9. Минимальный smoke-check после любого изменения lifecycle

1. Открыть VS Code -> daemon один, tray один, окно не всплывает повторно.
2. `Developer: Reload Window` -> daemon PID не меняется без явной stop/restart.
3. Открыть второе окно IDE -> не появляется второй daemon.
4. Закрыть окно Control Center -> daemon жив.
5. Quit Control Center -> daemon жив.
6. Нажать explicit Stop -> daemon корректно останавливается.

---

## 10. Ключевые файлы реализации

1. `src/extension.ts`
2. `src/daemon-manager.ts`
3. `src/global-watcher-manager.ts`
4. `localhub-tray/main.js`
5. `localhub-tray/renderer/app.js`
6. `python/daemon_server.py`

