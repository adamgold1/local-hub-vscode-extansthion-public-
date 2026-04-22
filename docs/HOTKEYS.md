# ⌨️ LocalHub Hotkeys (Горячие Клавиши)

## Все горячие клавиши VS Code Extension

| Hotkey (Windows/Linux) | Hotkey (macOS) | Command | Description |
|------------------------|----------------|---------|-------------|
| `Ctrl+Alt+R` | `Cmd+Alt+R` | Show Backups | Показать список бэкапов |
| `Ctrl+Alt+Shift+R` | `Cmd+Alt+Shift+R` | Restore from Backup | Восстановить из бэкапа |

---

## Command Palette (Ctrl+Shift+P)

Все команды доступны через Command Palette. Набери `lh` чтобы увидеть все:

### Core Commands (lh:):
- **lh: Status** - Показать статус сервера
- **lh: Repo** - Показать привязанный GitHub repo
- **lh: Branch** - Показать локальные ветки
- **lh: Init Project** - Создать первый снапшот всех файлов
- **lh: Show Backups** - Показать список доступных бэкапов
- **lh: Restore from Backup** - Восстановить проект из бэкапа

### Branch Commands (lh:):
- **lh: Create Branch** - Создать новую ветку
- **lh: Switch Branch** - Переключиться на другую ветку
- **lh: Delete Branch** - Удалить ветку
- **lh: Merge Branch** - Слить ветку
- **lh: Cherry-pick** - Скопировать файл из другой ветки
- **lh: Terminal: List Remote Branches** - Показать удалённые ветки (GitHub)
- **lh: Terminal: List All Branches** - Показать все ветки (локальные + remote)

### Stash Commands (lh:):
- **lh: Stash Changes** - Сохранить изменения в stash
- **lh: Apply Stash** - Применить stash
- **lh: Drop Stash** - Удалить stash
- **lh: List Stashes** - Показать все stash

### Tag Commands (lh:):
- **lh: Create Tag** - Создать тег
- **lh: Delete Tag** - Удалить тег
- **lh: List Tags** - Показать все теги

### GitHub Sync (lh:):
- **lh: Set Repo** - Привязать проект к GitHub репозиторию
- **lh: Setup GitHub** - Настроить GitHub credentials
- **lh: Sync to GitHub** - Синхронизировать с GitHub
- **lh: Monitor GitHub Progress** - Показать прогресс синхронизации

### Trash (lh:):
- **lh: Show Trash** - Показать удалённые файлы
- **lh: Restore from Trash** - Восстановить файл из trash
- **lh: Empty Trash** - Очистить trash полностью
- **lh: Show Deleted Branches (Branch Trash)** - Показать удалённые ветки
- **lh: Show Deleted TM Groups (Group Trash)** - Показать удалённые TM группы
- **lh: Restore Zombie Branch** - Восстановить удалённую ветку
- **lh: Restore Zombie TM Group** - Восстановить удалённую TM группу

### Plugin Commands (lh:):
- **lh: Install Plugin** - Установить плагин из папки
- **lh: Enable Plugin** - Включить плагин
- **lh: Disable Plugin** - Выключить плагин
- **lh: Remove Plugin** - Удалить плагин
- **lh: Refresh Plugins** - Обновить список плагинов


### Groups (TM):
- **LocalHub: Delete Group** - Удалить TM группу
- **LocalHub: Checkout TM Group** - Перейти на выбранную TM группу
- **LocalHub: Return To Branch Head** - Вернуться с TM checkout на active branch head
- **LocalHub: Show TM Group Checkout Status** - Показать текущий detached/head статус

---

## CLI Commands (Terminal)

| Command | Description |
|---------|-------------|
| `lh backup <project>` | Создать/синхронизировать бэкап |
| `lh backup list` | Показать все бэкапы |
| `lh backup restore <project>` | Восстановить проект из бэкапа |
| `lh backup info <project>` | Показать детали бэкапа |
| `lh init` | Инициализировать проект |
| `lh status` | Показать статус |
| `lh commit [msg]` | **Коммит pending changes** |
| `lh branch` | Список локальных веток |
| `lh branch -r` | **Список удалённых веток (GitHub)** |
| `lh branch -a` | **Все ветки (локальные + удалённые)** |
| `lh branch <name>` | Создать ветку |
| `lh branch trash` | Показать удалённые ветки |
| `lh branch restore <n>` | Восстановить удалённую ветку |
| `lh branch restore --all` | Восстановить все удалённые ветки |
| `lh branch empty-trash` | Очистить корзину веток |
| `lh group` | Список подтверждённых TM групп |
| `lh group -a` | Все TM группы (включая zombie) |
| `lh group checkout <n>` | Checkout workspace на TM группу |
| `lh group status` | Показать текущий TM group checkout status |
| `lh group head` | Вернуться на active branch head |
| `lh group -d <n>` | Удалить TM группу (keep snapshots) |
| `lh group -d <n> --with-snapshots` | Удалить TM группу + snapshots |
| `lh group trash` | Показать удалённые TM группы |
| `lh group restore <n>` | Восстановить удалённую TM группу |
| `lh group restore --all` | Восстановить все удалённые TM группы |
| `lh group empty-trash` | Очистить корзину TM групп |

| `lh switch <name>` | Переключиться на ветку |
| `lh merge <branch>` | **Смержить ветку в текущую** |
| `lh merge <branch> --force` | **Force merge (перезаписать конфликты)** |
| `lh push` | Загрузить на GitHub |
| `lh repo` | **Показать привязанный репозиторий** |
| `lh repo <name>` | **Привязать проект к GitHub repo** |
| `lh repo auto` | **Авто-определить из имени папки** |
| `lh trash` | Показать trash |

| `lh restore <file>` | Восстановить файл |
| `lh restore --all` | Восстановить все из trash |
| `lh empty-trash` | Очистить trash |
| `lh stash` | Создать stash |
| `lh stash list` | Показать все stash |
| `lh stash apply <n>` | Применить stash |
| `lh stash drop <n>` | Удалить stash |
| `lh tag <name>` | Создать тег |
| `lh tag -d <name>` | Удалить тег |
| `lh cherry-pick <branch> <file>` | Скопировать файл из ветки |
| `lh ignore` | Показать .localhubignore |
| `lh ignore <pattern>` | Добавить паттерн в ignore |
| `lh ignore --edit` | Редактировать .localhubignore |
| `lh plugin` | Показать плагины |
| `lh plugin install <path>` | Установить плагин |
| `lh plugin remove <name>` | Удалить плагин |
| `lh plugin enable <name>` | Включить плагин |
| `lh plugin disable <name>` | Выключить плагин |
| `lh help` | Показать помощь |

---

## UI Panels (Sidebar)

### LocalHub сайдбар включает:
1. **📦 History** - История изменений файлов
2. **📁 Files** - Все файлы с историей
3. **⏳ Pending Changes** - Неподтверждённые изменения
4. **📚 TM Groups** - Подтверждённые группы (коммиты)
5. **🌿 Branches** - Список веток
6. **🔖 Tags** - Список тегов
7. **🗑️ Trash** - Удалённые файлы
8. **💾 Stash** - Сохранённые изменения
9. **🔌 Plugins** - Установленные плагины

---

## Tips & Tricks

### Быстрый доступ к backup:
1. `Ctrl+Alt+R` → выбрать проект → Show Info
2. `Ctrl+Alt+R` → выбрать проект → Restore

### Быстрая установка плагина:
1. Command Palette → "LocalHub: Install Plugin"
2. Выбрать папку → готово

### Быстрое восстановление:
1. Command Palette → "LocalHub: Restore from Backup"
2. Выбрать проект → Confirm → готово

### TM Group checkout:
1. ПКМ на группу в **TM GROUPS** → `Checkout TM Group`
2. Для возврата: toolbar или ПКМ → `Return To Branch Head`
3. В терминале:
   - `lh group checkout <id>`
   - `lh group status`
   - `lh group head`

---

*LocalHub v2.6 | Все команды и горячие клавиши*
