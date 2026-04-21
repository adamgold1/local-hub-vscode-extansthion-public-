# 🧪 Техническое Задание: Crash Test LocalHub vs Git

> Цель: Проверить какой инструмент эффективнее для AI агентов

---

## 📋 Задание для AI Агента

**Проект:** Создать TODO-приложение на Python с Flask

**Требования:**
1. Backend на Flask с REST API
2. SQLite база данных
3. CRUD операции для задач
4. Веб-интерфейс (HTML/CSS/JS)
5. Тесты

---

## 🔄 Сценарий тестирования

### Этап 1: Инициализация (10 минут)

**LocalHub:**
```bash
# Открыть VS Code в папке проекта
# LocalHub автоматически запустится
lh init
```

**Git:**
```bash
git init
git add .
git commit -m "Initial commit"
```

---

### Этап 2: Разработка основы (30 минут)

**Задачи:**
1. Создать `app.py` с Flask приложением
2. Создать `models.py` с SQLAlchemy моделями
3. Создать `templates/index.html`
4. Создать `static/style.css`

**Метрики:**
- Сколько команд потребовалось для сохранения?
- Были ли потеряны изменения?
- Как легко откатиться к предыдущей версии?

---

### Этап 3: Ветвление (15 минут)

**Задача:** Создать ветку `feature/auth` для авторизации

**LocalHub:**
```bash
lh branch feature-auth
lh switch feature-auth
# Работаем...
```

**Git:**
```bash
git checkout -b feature/auth
# Работаем...
git add .
git commit -m "Auth feature"
```

**Метрики:**
- Изолированы ли файлы между ветками?
- Можно ли видеть файлы другой ветки?

---

### Этап 4: Конфликтная ситуация (20 минут)

**Задача:**
1. В main ветке изменить `app.py` (добавить endpoint)
2. В feature-auth изменить `app.py` (добавить auth)
3. Смержить

**LocalHub:**
```bash
lh switch main
# Редактируем app.py
lh switch feature-auth
# Редактируем app.py
# Merge через UI — видим конфликты ДО merge
# Smart Merge — выбираем что оставить
```

**Git:**
```bash
git checkout main
# Редактируем app.py
git add . && git commit -m "New endpoint"
git checkout feature/auth
# Редактируем app.py
git add . && git commit -m "Auth"
git checkout main
git merge feature/auth
# КОНФЛИКТ — редактируем вручную
git add . && git commit -m "Resolve conflict"
```

**Метрики:**
- Когда узнали о конфликте?
- Как легко было разрешить?
- Потеряны ли изменения?

---

### Этап 5: Удаление файла (10 минут)

**Задача:** Случайно удалить важный файл и восстановить

**LocalHub:**
```bash
# Удалить models.py
rm models.py
# Восстановить
lh trash
lh restore models.py
```

**Git:**
```bash
# Удалить models.py
rm models.py
# Восстановить (если закоммичено)
git checkout HEAD -- models.py
# Если не закоммичено — ПОТЕРЯНО
```

**Метрики:**
- Как быстро восстановили?
- Все ли версии доступны?

---

### Этап 6: Внешние изменения (15 минут)

**Задача:** Другой процесс (терминал, AI) изменяет файл

**LocalHub:**
```bash
# В терминале
echo "# New comment" >> app.py
# LocalHub автоматически создаёт snapshot
# Видим в истории EXTERNAL_CHANGE
```

**Git:**
```bash
# В терминале
echo "# New comment" >> app.py
# Git не знает об изменении
# Нужно вручную: git add . && git commit
```

**Метрики:**
- Сохранены ли внешние изменения автоматически?
- Можно ли увидеть когда они были?

---

### Этап 7: Экспорт/Импорт (10 минут)

**Задача:** Экспортировать ветку в ZIP и импортировать

**LocalHub:**
```bash
# ПКМ на ветке → Export to ZIP
# Command Palette → Import from ZIP
```

**Git:**
```bash
git archive --format=zip HEAD -o branch.zip
# Импорт — распаковать и git init заново
```

---

### Этап 8: Stash (10 минут)

**Задача:** Спрятать изменения, переключиться, вернуть

**LocalHub:**
```bash
# Внести изменения в app.py
lh stash              # Спрятать
lh switch main        # Переключиться
# Исправить баг
lh switch feature-auth
lh stash pop          # Вернуть изменения
```

**Git:**
```bash
# Внести изменения в app.py
git stash              # Спрятать
git checkout main      # Переключиться
# Исправить баг
git checkout feature/auth
git stash pop          # Вернуть
```

**Метрики:**
- Сохранились ли все изменения?
- Сколько команд потребовалось?

---

### Этап 9: Tags (5 минут)

**Задача:** Создать тег для релиза

**LocalHub:**
```bash
lh tag v1.0           # Создать тег
lh tag                # Список тегов
```

**Git:**
```bash
git tag v1.0          # Создать тег
git tag               # Список
```

**Метрики:**
- Одинаково ли работает?

---

### Этап 10: Cherry-pick (10 минут)

**Задача:** Взять один файл из другой ветки

**LocalHub:**
```bash
lh cherry-pick feature-auth utils.py
# Файл скопирован, snapshot создан
```

**Git:**
```bash
# Нет прямого аналога для одного файла
git checkout feature/auth -- utils.py
git add utils.py
git commit -m "Cherry-pick utils.py"
```

**Метрики:**
- Какой способ проще?
- Сколько команд?

---

### Этап 11: Ignore (5 минут)

**Задача:** Добавить паттерн в ignore

**LocalHub:**
```bash
lh ignore __pycache__
lh ignore *.pyc
lh ignore             # Показать содержимое
```

**Git:**
```bash
echo "__pycache__" >> .gitignore
echo "*.pyc" >> .gitignore
cat .gitignore
```

**Метрики:**
- Какой способ проще?

---

## 📊 Таблица результатов

| Критерий | LocalHub | Git | Победитель |
|----------|----------|-----|------------|
| Время инициализации | | | |
| Количество команд | | | |
| Автоматизация | | | |
| Определение конфликтов | | | |
| Разрешение конфликтов | | | |
| Восстановление удалённых | | | |
| Отслеживание внешних изменений | | | |
| Stash | | | |
| Tags | | | |
| Cherry-pick | | | |
| Ignore management | | | |
| Понятность для AI | | | |
| Документация для AI | | | |
| Общее время выполнения | | | |

---

## 🤖 Специфика для AI агентов

### LocalHub преимущества:
1. **DOCS.md** — агент сразу понимает систему
2. **Agent Diary** — логирование всех действий (restore, stash, trash, tag, cherry-pick, github)
3. **Авто-snapshot** — не нужно помнить о commit
4. **API доступ** — полное управление через REST
5. **Trash** — восстановление ошибок
6. **Stash** — спрятать изменения (`lh stash`)
7. **Tags** — метки версий (`lh tag`)
8. **Cherry-pick** — взять файл из ветки (`lh cherry-pick`)
9. **Ignore** — управление `.localhubignore` (`lh ignore`)

### Git преимущества:
1. **Распространённость** — все IDE поддерживают
2. **Remote** — GitHub/GitLab интеграция
3. **Stash** — временное сохранение изменений (теперь есть в LocalHub)
4. **Tags** — метки (теперь есть в LocalHub)
5. **Rebase** — перезапись истории
6. **Submodules** — вложенные репозитории

---

## 🎯 Ожидаемые результаты

### Для LocalHub:
- Меньше команд
- Автоматическое сохранение
- Легче конфликты
- Восстановление удалённых
- AI-friendly документация
- Stash, Tags, Cherry-pick — как в Git
- Agent Diary — полное логирование для AI

### Для Git:
- Больше контроля
- Remote репозитории
- Стандартный инструмент
- Больше документации онлайн

---

## 📝 Чек-лист для агента

### После каждого этапа записать:
- [ ] Количество выполненных команд
- [ ] Время выполнения
- [ ] Ошибки/проблемы
- [ ] Потерянные данные
- [ ] Субъективная оценка сложности (1-10)

---

## 📋 Полный список CLI команд LocalHub

```bash
# Основные
lh init              # Инициализация
lh status            # Статус
lh branch            # Список веток
lh branch <name>     # Создать ветку
lh switch <name>     # Переключить

# Корзина
lh trash             # Показать удалённые
lh restore <file>    # Восстановить
lh restore --all     # Восстановить все
lh empty-trash       # Очистить

# Stash
lh stash             # Спрятать
lh stash pop         # Вернуть
lh stash list        # Список
lh stash drop <n>    # Удалить

# Tags
lh tag <name>        # Создать
lh tag               # Список
lh tag -d <name>     # Удалить

# Cherry-pick
lh cherry-pick <branch> <file>

# Ignore
lh ignore            # Показать
lh ignore <pattern>  # Добавить
lh ignore --edit     # Редактировать

# GitHub
lh push              # Push to GitHub
lh github            # Настройка

lh help              # Помощь
```

---

*LocalHub v2.5 | Crash Test Specification*
