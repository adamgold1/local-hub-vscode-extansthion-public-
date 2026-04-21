# 🚀 LocalHub v2.5 - Release Notes

Полная синхронизация, GitHub Cloud, SSH и Merge Tracking.

---

## ☁️ 1. GitHub Cloud Sync (Синхронизация)

### ✅ Функционал:
- **Upload (Push):** Загрузка текущей ветки на GitHub.
- **Download (Clone):** Скачивание репозитория с GitHub в новую ветку.
- **Token Support:** Поддержка Personal Access Token (PAT).
- **Progress Tracking:** Отображение прогресса (файлы/байты) в статус баре.

### 🧪 Тестирование (UI):
1. Открой панель **Pending Changes**.
2. Нажми кнопку ☁️ (Sync).
3. Если токена нет — введи (или настрой через `Setup GitHub Integration`).
4. Выбери репозиторий и ветку.
5. Смотри на статус бар — должен крутиться спиннер.
6. Проверь GitHub — файлы должны появиться.

### 🧪 Тестирование (CLI):
```powershell
# Настройка (один раз)
$env:GITHUB_TOKEN="ghp_твой_токен"
$env:GITHUB_OWNER="твое_имя"
$env:GITHUB_REPO="тест_репо"

# Push
lh push
```

---

## ⬇️ 2. Clone from GitHub

### ✅ Функционал:
- Скачивание ЛЮБОГО публичного (или приватного с токеном) репозитория.
- Создание новой ветки в LocalHub с содержимым.

### 🧪 Тестирование:
1. Кнопка `⬇️` (Clone) в панели **Pending Changes** (рядом с облаком).
2. Или `Ctrl+Shift+P` -> `LocalHub: Clone from GitHub`.
3. Введи данные (owner, repo, branch).
4. Проверь список веток — должна появиться новая.

---

## 🔑 3. SSH Key Setup (Ключи)

### ✅ Функционал:
- Генерация Ed25519 ключей (стандарт GitHub).
- Копирование публичного ключа.
- Открытие страницы настроек GitHub.

### 🧪 Тестирование:
1. `Ctrl+Shift+P` -> `LocalHub: Setup SSH Key`.
2. Если ключа нет -> "Generate New".
3. Если ключ есть -> "Copy Public Key".
4. Вставь ключ на GitHub (откроется браузер).

---

## 🔄 4. Smart Merge & Tracking (Слияние)

### ✅ Функционал:
- **Память слияния:** База данных помнит, какая ветка куда влилась.
- **UI индикация:**
  - В панели **Branches** (Sidebar): Иконка слияния и статус "merged".
  - В **Dashboard** (Webview): Иконка 🔗 и зеленый бейдж MERGED.
  - В **Tooltip**: Надпись "Merged into #X".

### 🧪 Тестирование (Скрипт):
Запусти проверочный скрипт:
```powershell
python tests/verify_merge.py
```
**Ожидание:** "✅ SUCCESS! Database remembered the merge."

---

## 📂 5. .localhubignore

### ✅ Функционал:
- Игнорирование мусора (node_modules, venv, etc).
- Готовые шаблоны для всех языков (Python, Node, Java, Go, PHP...).

### 🧪 Тестирование:
1. Кнопка 👁️‍🗨️ в панели **Tracked Files**.
2. Выбери шаблон (например, "All Languages").
3. Появится файл `.localhubignore`.
4. Проверь **Pending Changes** — мусор должен исчезнуть.

---

## 💻 6. CLI (Терминал)

### ✅ Функционал:
Полный набор команд в терминале.

### 🧪 Тестирование:
```powershell
lh status       # Статус сервера
lh branch       # Список веток (с merged статусом!)
lh branch test  # Создать ветку
lh switch test  # Переключить
lh switch main  # Вернуться
lh push         # Отправить на GitHub
lh github       # Инструкция
```

---

## ❓ Что делать если не работает?

1. **Сервер не обновился:** Нажми `F5` в VS Code или перезагрузи окно (`Reload Window`).
2. **CLI ошибка:** Обнови глобальный скрипт (мы это уже сделали автоматически).
3. **SSH ошибка:** Убедись, что `ssh-keygen` доступен в системе (обычно есть в Windows/Linux).
