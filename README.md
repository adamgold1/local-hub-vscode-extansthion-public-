# LocalHub — Time Machine for Code

**Automatic local file versioning. No Git commands, no commits — everything in the background.**

LocalHub is a complete "Time Machine" for your code. Every significant action automatically creates a file snapshot. Branches, groups, diff navigator, AI analytics, plugins, cloud sync, global file monitoring — all out of the box.

![Version](https://img.shields.io/badge/version-3.0.1-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-blue)
![Standalone IDE](https://img.shields.io/badge/Standalone%20IDE-supported-purple)

🌐 **Website:** [standaloneaistorm.com](https://standaloneaistorm.com)

![Version](https://img.shields.io/badge/version-3.0.1-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-blue)
![Standalone IDE](https://img.shields.io/badge/Standalone%20IDE-supported-purple)
![Python](https://img.shields.io/badge/Python-3.9%2B-green)

---

## Screenshots

<p align="center">
  <img src="./assets/screenshot-sidebar.png" width="100%" alt="LocalHub Sidebar — File History, TM Groups, Branches" />
  <br/><em>LocalHub Sidebar: File History, TM Groups, Branches — all inside VS Code</em>
</p>

<p align="center">
  <img src="./assets/screenshot-watcher.png" width="100%" alt="LocalHub Global Watcher" />
  <br/><em>Global Watcher: 18,439 snapshots across 10 monitored folders, 235MB stored</em>
</p>


---

## Table of Contents

- [Features](#features)
- [Shadow Sandboxes](./docs/SHADOW_SANDBOXES.md)
- [Universal MCP](./docs/UNIVERSAL_MCP.md)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [LocalHub — Functionality](#localhub--functionality)
  - [Automatic Snapshots](#automatic-snapshots)
  - [File History](#file-history)
  - [Recovery](#recovery)
  - [Change Groups (TM Groups)](#change-groups-tm-groups)
  - [LHL Mode — Auto-grouping](#lhl-mode--auto-grouping)
  - [Branches](#branches)
  - [Zombie Branches and Zombie Commits](#zombie-branches-and-zombie-commits)
  - [Tree Diff — Change Visualization](#tree-diff--change-visualization)
  - [Diff Navigator — Interactive Review](#diff-navigator--interactive-review)
  - [Rejected Blocks Trash](#rejected-blocks-trash)
  - [Blame and Bisect](#blame-and-bisect)
  - [Surgical File Management](#surgical-file-management)
  - [Deleted Files (Trash)](#deleted-files-trash)
  - [Backup](#backup)
  - [GitHub Synchronization](#github-synchronization)
  - [Git Integration](#git-integration)
  - [Storm Code Integration](#storm-code-integration)
  - [Built-in LH Console](#built-in-lh-console)
  - [Plugins](#plugins)
  - [Agent Diary — AI Log](#agent-diary--ai-log)
  - [AI Deletion Protection](#ai-deletion-protection)
- [Smart Features — AI Analytics](#smart-features--ai-analytics)
- [Visualizations](#visualizations)
- [Global Watcher — Global Monitoring](#global-watcher--global-monitoring)
- [Panels and Interface](#panels-and-interface)
- [Settings](#settings)
- [Hotkeys](#hotkeys)
- [CLI](#cli)
- [Technologies](#technologies)
- [Author](#author)

---

## Features

### Core
- **Automatic Snapshots** — 7 smart triggers (save, tab switch, editing, focus loss, idle, external changes, deletion)
- **Deduplication** — identical content stored once (SHA-256 hashing)
- **Branches** — parallel versioning lines with merge, cherry-pick, export/import
- **Zombie Branches** — full control over deleted branches and commits with recovery capability
- **Change Groups** — commit analogue with auto-tagging and AI description generation
- **Group Tag Search** — manual assignment of custom text tags with quick search
- **Diff Navigator** — interactive change review with Accept/Reject for each block
- **Rejected Blocks Trash** — saving all rejected code pieces for later recovery
- **Blame** — who and when changed each line (like `git blame`)
- **Bisect** — binary search for bug version (like `git bisect`)
- **Surgical Management** — remove any file from branch or commit via UI

### Monitoring
- **Global Watcher** — background OS-level file monitoring, works even without IDE
- **Seamless Symbiosis** — automatic data transfer between global watcher and local hub
- **Cloud Synchronization** — Google Drive, OneDrive, Dropbox, Yandex Disk or custom API
- **Backup** — centralized backup with rotation

### AI and Analytics
- **8 Smart Analyzers** — predictions, heatmap, refactoring, change velocity, dependencies, clusters, analytics
- **Agent Diary** — automatic logging of AI agent actions
- **Storm Code Integration** — automatic commits based on AI agent responses
- **Trash Protection** — AI cannot delete files from trash

### Visualizations
- **3D Grid** — three-dimensional project visualization
- **Time Machine** — time travel through project states
- **Code Replay** — coding session playback as video
- **Branch Tree** — visual branch tree
- **Group Change Trees** — change visualization for entire file groups (accordion and classic modes)
- **Dependency Graph** — interactive file relationship graph (Nexus Vision)
- **Symbol Timeline** — function and class timeline

### Extensibility
- **Plugin System** — install, enable/disable, configure, marketplace
- **CLI** — command line for terminal work
- **Built-in LH Console** — full terminal inside the program
- **150+ API Endpoints** — full programmatic access to all functionality
- **Shadow Sandboxes** — isolated working copies for AI and human review: create/status/diff/checkout/return/merge/destroy
- **Universal MCP** — standard project-level `.vscode/mcp.json` bootstrap for MCP clients

---

## Installation

### Requirements
- **VS Code** 1.85+ or any VS Code-based IDE
- **Python** 3.9+ with pip

### From VSIX
```bash
# Download .vsix file
code --install-extension localhub-3.0.1.vsix --force
```

### From Source (Development)
```bash
git clone <repo>
cd localhub-vscode
npm install
npm run compile
# F5 to run in debug mode
```

Python dependencies are installed automatically on first run.

---

## Quick Start

1. Open project in VS Code
2. LocalHub automatically starts daemon server
3. Start working — snapshots are created automatically
4. **LocalHub** sidebar shows history, files, groups, branches
5. `Ctrl+Alt+S` — manual snapshot
6. `Ctrl+Alt+H` — show all features
7. `Ctrl+Alt+L` — open built-in LH console

---

## LocalHub — Functionality

### Automatic Snapshots

7 smart triggers automatically create file snapshots:

| Trigger | Description |
|---------|-------------|
| **File Save** | Ctrl+S or autosave тЖТ snapshot `auto:save` |
| **Tab Switch** | Snapshot of old file (`tab_switch`) and new (`tab_focus`) |
| **File Open** | Explorer click тЖТ `explorer_click` |
| **Text Editing** | After 2 sec pause тЖТ detailed reason: `added:"code"`, `deleted:15chars`, `replaced:"text"` |
| **Focus Loss** | IDE minimize тЖТ snapshot of open file |
| **Idle** | Configurable idle interval (default 5 min) |
| **External Changes** | AI agents, terminal, other editors тЖТ `external:change` |

Each snapshot records detailed reason — shows not just "file changed", but what exactly happened.

### File History

- Complete history of all versions in sidebar
- History search with filters (file, date, reason, branch)
- **Starred Files** — version fixation with star for complete deletion protection
- **Context Jump** — jump from starred version directly to corresponding TM group
- Stars show TM group binding — can see entire project state at that moment
- Version description editing
- Delete unnecessary versions

### Recovery

- **Full Recovery** — rollback file to any version in one click
- **Partial Recovery** — select specific blocks for recovery
- **Diff** — compare any version with current file
- Safety snapshot automatically created before recovery

### Change Groups (TM Groups)

Groups are commit analogues. Set of related changes confirmed together.

- **Group Confirmation** — collect accumulated changes into group
- **Smart Confirm** — smart confirmation with automatic analysis
- **AI Description Generation** — automatic summary creation via AI
- **Auto-tagging** — 15+ tag types: `new-function`, `bugfix`, `refactor`, `api-change`, `ui-change`, `ai-generated` etc.
- **Manual Tags** — assign custom text tags for each group
- **Tag Search** — quick search by automatic and manual tags
- **Tag Filtering** — find groups by change type
- **Re-tagging** — recalculate tags for all groups

### LHL Mode — Auto-grouping

Automatic group creation without manual confirmation:

- **By Timeout** — group created after N minutes of inactivity (default 10 min)
- **By Count** — group created after N saves (default 10)
- **Name Template** — `{count}`, `{time}`, `{date}`, `{files}` for name generation

### Branches

Parallel versioning lines, like in Git:

- **Branch Creation** — fork from current state
- **Switching** — instant switch between branches
- **Merge** — branch merging with conflict detection
- **Selective Merge** — choose which files to merge
- **Smart Merge** — smart merge with preview
- **Cherry-Pick** — select individual changes from another branch
- **Export/Import** — export branch to ZIP and import back
- **Stash** — postpone current changes and return later

### Zombie Branches and Zombie Commits

Full control over deleted data:

- **Zombie Branches** — deleted branches don't disappear, but become "zombies"
- **Branch Recovery** — restore any deleted branch in one click
- **Zombie Commits** — deleted commit groups saved in special trash
- **Group Recovery** — restore entire commit group with all files
- **Commit Deletion** — ability to delete commits with content preservation or complete destruction
- **Deletion History** — complete log of all deletions with rollback capability

### Tree Diff — Change Visualization

Advanced diff visualization with semantic analysis:

- **Version Chain** — v1 тЖТ v2 тЖТ v3 тЖТ ... тЖТ vN in one view
- **Group Change Trees** — unique change visualization for entire file group
- **Accordion Mode** — compact view with click expansion
- **Classic View** — traditional change tree with beautiful design
- **Semantic Analysis** — shows "function `getUser()` added", not just "lines 15-20"
- **Language Support** — Python, JavaScript, TypeScript, Go, Rust, Java, C#, PHP, Ruby
- **10 Icon Themes** — Vivid, Minimal, Neon, Pastel, Earth, Aurora, Sunset, Ocean, Candy, Matrix
- **Configurable Context** — number of lines around changes (0-20)
- **Modes** — Collapsed, Step-by-step Chain, Summary

### Diff Navigator — Interactive Review

Navigator for step-by-step change review (like code review in Git):

- **Navigation** — тЧА Previous / тЦ╢ Next block
- **Accept/Reject** — accept or reject each change block
- **Apply Decisions** — surgical application of selected blocks only
- **Rejected Trash** — all rejected blocks saved for later recovery
- Hotkeys in editor panel

### Rejected Blocks Trash

Unique system for saving rejected code:

- **Auto-save** — all rejected blocks automatically go to trash
- **Categorization** — blocks grouped by files and review sessions
- **Recovery** — any rejected block can be restored
- **Search** — quick search by rejected block content
- **Rejection History** — full log with date, time and context
- **Retention Period** — configurable period (default 30 days)

### Blame and Bisect

Git-like analysis tools:

- **Blame** — for each file line: which version appeared, when, why
- **Bisect** — binary search for bug version:
  1. Specify "version X is good, version Y is bad"
  2. System shows middle version
  3. You check — repeat until finding exact version

### Surgical File Management

Direct file management via visual interface:

- **Remove from Branch** — kick any file from branch via context menu
- **Remove from Commit** — remove file from already created commit
- **Instant Exclusion Transfer** — send file to `.localhubignore` directly from UI
- **Stop Tracking** — file stops being tracked, but history preserved
- **Mass Operations** — select multiple files for group actions
- **Visual Mode** — all operations available via drag & drop

### Deleted Files (Trash)

- All deleted files saved to trash
- View deleted file history
- Restore one file or all at once
- Configurable retention period (default 30 days)
- Trash cleanup

### Backup

- **Centralized Backup** — copy snapshots to separate folder (external drive, NAS, cloud)
- **Rotation** — automatic deletion of backups older than N days
- **Restore from Backup** — complete project restoration

### GitHub Synchronization

- Upload project to GitHub via Personal Access Token
- Clone from GitHub
- Auto-sync on group confirmation
- SSH Push for advanced users
- Sync branch configuration

### Git Integration

- **Auto Git Commit** — automatic `git commit` on TM Group confirmation
- **Auto Push** — automatic `git push` after commit
- **Configurable Prefix** for commit messages

### Storm Code Integration

Automatic commits based on AI agent work:

- **Response Tracking** — system monitors agent responses in Storm Code
- **Trigger Words** — "Done", "Completed", "Finished", "Ready"
- **Auto-commit** — automatically creates commit when trigger detected
- **AI Description** — agent response used as official commit description
- **Task Linking** — commit automatically linked to task in Storm Code
- **Agent History** — all agent commits available in separate panel

### Built-in LH Console

Full terminal inside the program:

- **Quick Access** — `Ctrl+Alt+L` to open console
- **All LH Commands** — available without `lh` prefix
- **Auto-completion** — intelligent hints for commands and files
- **Command History** — navigation with up/down arrows
- **Color Highlighting** — syntax highlighting for output
- **UI Integration** — command results displayed in panels
- **Macros** — create custom command aliases

### Plugins

Extensible plugin system:

- Install plugins from folder or marketplace
- Enable/disable without deletion
- Configure each plugin via UI
- Update checking
- Plugins react to events (file save, group confirmation, etc.)

### Agent Diary — AI Log

Automatic logging of AI agent actions:

- Record all saves, commits, branch operations
- Terminal command logging
- Diary files in `.localhub/agent/` — readable Markdown
- Next AI agent can use diary as "memory"
- Configurable log rotation

### AI Deletion Protection

- AI agents **cannot** clear trash, delete files from trash or erase history
- Only user via UI can perform destructive operations
- Log of all deletion attempts

---

## Smart Features — AI Analytics

8 smart analyzers based on change history:

| Analyzer | Description |
|----------|-------------|
| **Predictive Suggestions** | Predict files you'll likely change |
| **Timeline View** | Visual project change timeline |
| **Activity Heatmap** | Heatmap — which files change most often |
| **Refactoring Hints** | Refactoring recommendations based on change patterns |
| **Change Velocity** | Change speed over time — when project develops faster |
| **Dependency Overlay** | Dependency analysis — static imports vs. co-changes |
| **Smart Clusters** | Automatic detection of logical file groups |
| **Analytics Dashboard** | Overall project health statistics |

---

## Visualizations

| Visualization | Description |
|--------------|-------------|
| **3D Grid** | Three-dimensional project structure visualization |
| **Time Machine** | Time travel — view project state at any moment |
| **Code Replay** | Coding session playback as accelerated video |
| **Branch Tree** | Visual branch tree with hierarchy and history |
| **Dependency Graph** | Interactive file relationship graph (co-changes) |
| **Nexus Vision** | Advanced graph with clusters, filters and animation |
| **Symbol Timeline** | Function and class timeline |
| **Group Trees** | Change visualization for entire file group |

---

## Global Watcher — Global Monitoring

Global Watcher — separate system for OS-level file monitoring. Works independently of VS Code — files tracked while daemon runs.

### Features

- **Monitor Any Folders** — not just open project, but any computer folders
- **IDE Independence** — works while daemon process runs
- **Global and Local Folders** — global visible from any project, local only from current
- **150+ Default Exclusions** — node_modules, .git, __pycache__, etc.
- **Support .localhubignore** — own file ignore system in each folder
- **Seamless Symbiosis** — automatic transfer of current picture to local hub when editor opens

### History and Recovery

- Complete version history for each tracked file
- View, diff, restore any version
- Track deleted files
- Configurable storage (days, max versions)

### Cloud Synchronization

- **Folder Mode** — sync via Google Drive, OneDrive, Dropbox, Yandex Disk (auto-detect)
- **API Mode** — sync via HTTP API
- **Instant or Periodic** synchronization
- Status and progress in panel

### Project Export

- Export folder to ZIP with latest file versions
- Optional — with complete history (all versions)

### Management

Three daemon process management levels:

| Level | Description | Buttons |
|-------|-------------|---------|
| **Main Daemon** | Entire Python process | Start, Stop, Restart |
| **LocalHub Daemon** | Project server | Start, Stop, Restart |
| **Global Watcher** | Monitoring module | Start, Stop, Restart |

### Settings Panel

5 tabs in full panel:

1. **Overview** — statistics, daemon status
2. **Folders** — manage watched folders (global + local)
3. **History** — files, versions, recovery, deleted files
4. **Cloud Sync** — cloud synchronization (service setup, sync now)
5. **Settings** — debounce, exclusions, rotation, backup

---

## Panels and Interface

### LocalHub Sidebar (11 sections)

| Panel | Description |
|-------|-------------|
| **File History** | All versions of selected file with star marks |
| **Tracked Files** | All files with history in project |
| **Pending Changes** | Ungrouped changes |
| **TM Groups** | Confirmed groups with tags and search |
| **Branches** | Versioning branches |
| **Zombie Branches** | Deleted branches trash |
| **Zombie Commits** | Deleted commits trash |
| **Rejected Blocks** | Rejected code blocks trash |
| **Deleted Files** | Trash — deleted files |
| **Dashboard** | Project statistics and metrics |
| **Relationships** | File relationship graph |
| **Smart Features** | AI analyzers |

### Global Watcher Sidebar

| Panel | Description |
|-------|-------------|
| **Overview** | Status, statistics, daemon management |
| **Watch Folders** | List of monitored folders |

### Built-in Console

| Element | Description |
|---------|-------------|
| **Command Line** | Input field with auto-completion |
| **Output** | Colored result output |
| **History** | Executed command history |
| **Macros** | List of saved macros |

### Settings Panel (11 tabs)

| Tab | Content |
|-----|---------|
| **General** | Main settings, LHL mode, ignore, daemon management |
| **Global Watcher** | Enable GW, folders, storage parameters, symbiosis |
| **Backup** | Centralized backup, trash |
| **Git Sync** | Automatic git commit/push |
| **GitHub** | Token, repo, auto-sync |
| **Storm Code** | AI agent integration, trigger words |
| **Console** | Built-in console settings, macros |
| **Advanced** | Python path, port, marketplace, Agent Diary |
| **Tree Diff** | Icon theme, semantic analysis, context, modes |
| **Plugins** | Plugin management |
| **About** | About, statistics |

---

## Settings

### General

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.enabled` | `true` | Enable LocalHub |
| `localhub.autoSave` | `true` | Automatic snapshots |
| `localhub.debounceMs` | `2000` | Delay before snapshot (ms) |
| `localhub.maxVersionsPerFile` | `100` | Max versions per file |
| `localhub.idleCheckpointMinutes` | `5` | Idle snapshot (0 = off) |

### LHL Mode

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.lhlMode` | `false` | Auto-grouping |
| `localhub.lhl.timeoutMinutes` | `10` | Inactivity timeout |
| `localhub.lhl.threshold` | `10` | Count threshold |
| `localhub.lhl.namePattern` | — | Group name template |

### Global Watcher

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.enableGlobalWatcher` | `true` | Enable global monitoring |
| `localhub.globalWatchPaths` | `[]` | Global folders |
| `localhub.localWatchPaths` | `[]` | Local folders |
| `localhub.excludePatterns` | 150+ items | Exclusion patterns |
| `localhub.seamlessSync` | `true` | Seamless symbiosis with local hub |

### Backup and Trash

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.backup.enabled` | `true` | Central backup |
| `localhub.backup.centralPath` | — | Backup folder |
| `localhub.backup.retentionDays` | `30` | Backup rotation (0 = forever) |
| `localhub.trash.retentionDays` | `30` | Deleted files retention |
| `localhub.zombies.retentionDays` | `90` | Zombie branches and commits retention |
| `localhub.rejected.retentionDays` | `30` | Rejected blocks retention |

### Storm Code Integration

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.stormCode.enabled` | `false` | Enable integration |
| `localhub.stormCode.triggers` | `["Done", "Completed", "Ready"]` | Trigger words |
| `localhub.stormCode.autoCommit` | `true` | Automatic commits |
| `localhub.stormCode.useAgentResponse` | `true` | Use response as description |

### Built-in Console

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.console.enabled` | `true` | Enable console |
| `localhub.console.historySize` | `1000` | Command history size |
| `localhub.console.autoComplete` | `true` | Auto-completion |
| `localhub.console.colorOutput` | `true` | Colored output |

### GitHub

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.github.enabled` | `false` | Enable GitHub sync |
| `localhub.github.token` | — | Personal Access Token |
| `localhub.github.owner` | — | Username |
| `localhub.github.repo` | — | Repository |
| `localhub.github.branch` | `main` | Branch |
| `localhub.github.syncOnConfirm` | `false` | Auto-sync on confirmation |

### Git

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.git.syncOnConfirm` | `false` | Auto git commit |
| `localhub.git.autoPush` | `false` | Auto git push |
| `localhub.git.commitPrefix` | — | Commit prefix |

### Tree Diff

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.treeDiff.semanticAnalysis` | `true` | Semantic code analysis |
| `localhub.treeDiff.contextLines` | `3` | Context lines (0-20) |
| `localhub.treeDiff.reviewMode` | `true` | Accept/Reject buttons |
| `localhub.treeDiff.groupMode` | `accordion` | Group mode (accordion/classic) |
| `localhub.icons.theme` | `vivid` | Icon theme (10 options) |

### Advanced

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.pythonPath` | `python` | Python path |
| `localhub.serverPort` | `19876` | Server port |
| `localhub.agentDiary.enabled` | `true` | AI agent diary |
| `localhub.marketplaceUrl` | — | Plugin marketplace URL |
| `localhub.customTags` | `[]` | List of custom tags |

---

## Hotkeys

| Combination | Action |
|------------|--------|
| `Ctrl+Alt+H` | Show all features |
| `Ctrl+Alt+S` | Create snapshot |
| `Ctrl+Alt+B` | Create branch |
| `Ctrl+Alt+T` | Show trash |
| `Ctrl+Alt+Shift+T` | Show branch trash |
| `Ctrl+Alt+Shift+G` | Show TM group trash |
| `Ctrl+Alt+Shift+R` | Show rejected blocks trash |
| `Ctrl+Alt+R` | Show backups |
| `Ctrl+Alt+Shift+R` | Restore from backup |
| `Ctrl+Alt+L` | Open built-in console |
| `Ctrl+Alt+X` | Surgical file removal |
| `Ctrl+Alt+I` | Add file to exclusions |

---

## CLI

Command line for terminal work (installed in `~/bin/lh.py`):

```bash
lh status          # Project status
lh log [file]      # Project/file history
lh diff <file>     # Diff with last version
lh restore <file>  # Restore file
lh branch          # Branch list
lh branch trash    # Deleted branch trash
lh group           # TM group list
lh group trash     # Deleted TM group trash
lh rejected        # Rejected blocks trash
lh surgery <file>  # Surgical file removal
lh ignore <file>   # Add file to exclusions
lh tag <group>     # Add tag to group
lh search <tag>    # Search by tags
lh push            # Push to GitHub
```

### Built-in Console

All commands also available in built-in console without `lh` prefix:

```bash
status             # Project status
log [file]         # History
diff <file>        # Compare
restore <file>     # Recovery
# ... and all other commands
```

---

## Technologies

| Component | Technology |
|-----------|------------|
| IDE Extension | TypeScript, VS Code Extension API |
| Server | Python, FastAPI, Uvicorn |
| Database | SQLite |
| File Storage | Content-addressable storage (SHA-256) |
| File Monitoring | watchdog (Python) + VS Code FileSystemWatcher |
| Graph Visualization | Cytoscape.js |
| 3D Visualization | Three.js |
| Built-in Console | xterm.js + node-pty |
| IDE Support | VS Code and any VS Code-based IDE |

---

## Author

**Islam Dev**

> "Every change is a save point. Never lose your code."
```


---

# LocalHub — Машина Времени для Кода

**Автоматическое локальное версионирование файлов. Без Git команд, без коммитов — всё в фоне.**

LocalHub — это полноценная "Машина Времени" для вашего кода. Каждое значимое действие автоматически создаёт снимок файла. Ветки, группы, diff-навигатор, AI-аналитика, плагины, облачный синк, глобальный мониторинг файлов — всё из коробки.

🌐 **Сайт:** [standaloneaistorm.com](https://standaloneaistorm.com)

![Version](https://img.shields.io/badge/version-3.0.1-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-blue)
![Standalone IDE](https://img.shields.io/badge/Standalone%20IDE-supported-purple)
![Python](https://img.shields.io/badge/Python-3.9%2B-green)

---

## Скриншоты

<p align="center">
  <img src="./assets/screenshot-sidebar.png" width="100%" alt="LocalHub Sidebar" />
  <br/><em>Сайдбар LocalHub: История файлов, TM Группы, Ветки — прямо внутри VS Code</em>
</p>

<p align="center">
  <img src="./assets/screenshot-watcher.png" width="100%" alt="LocalHub Global Watcher" />
  <br/><em>Global Watcher: 18,439 снимков кода, 10 папок на мониторинге, 235MB</em>
</p>

---

## Оглавление
- [Возможности](#возможности)
- [Shadow Sandboxes](./docs/SHADOW_SANDBOXES.md)
- [Universal MCP](./docs/UNIVERSAL_MCP.md)
- [Установка](#установка)
- [Быстрый старт](#быстрый-старт)
- [LocalHub — Функционал](#localhub--функционал)
- [Smart Features — AI-аналитика](#smart-features--ai-аналитика)
- [Global Watcher — Глобальный мониторинг](#global-watcher--глобальный-мониторинг)
- [Панели и интерфейс](#панели-и-интерфейс)
- [Настройки](#настройки)
- [Горячие клавиши](#горячие-клавиши)
- [CLI](#cli-1)
- [Технологии](#технологии)
- [Автор](#автор)

---

## Возможности

### Ядро
- **Автоматические снимки** — 7 умных триггеров (сохранение, переключение табов, редактирование, потеря фокуса, idle, внешние изменения, удаление)
- **Дедупликация** — одинаковый контент хранится один раз (SHA-256 хэширование)
- **Ветки** — параллельные линии версионирования с merge, cherry-pick, export/import
- **Зомби-ветки** — полный контроль над удалёнными ветками и коммитами с возможностью восстановления
- **Группы изменений** — аналог коммитов с автотегированием и AI-генерацией описаний
- **Diff-навигатор** — интерактивный обзор изменений с Accept/Reject на каждый блок
- **Корзина отклоненных блоков** — сохранение всех rejected кусков кода для последующего восстановления
- **Blame и Bisect** — кто и когда изменил каждую строку (как `git blame`), бинарный поиск версии с багом (как `git bisect`)
- **Хирургическое управление** — удаление любого файла из ветки или коммита через UI

### Мониторинг
- **Global Watcher** — фоновый мониторинг файлов на уровне ОС, работает даже без IDE
- **Бесшовный симбиоз** — автоматическая передача данных между глобальным наблюдателем и локальным хабом
- **Облачная синхронизация** — Google Drive, OneDrive, Dropbox, Yandex Disk или свой API
- **Резервное копирование** — централизованный бэкап с ротацией

### AI и аналитика
- **8 умных анализаторов** — предсказания, тепловая карта, рефакторинг, скорость изменений, зависимости, кластеры, аналитика
- **Agent Diary** — автологирование действий AI агентов
- **Storm Code интеграция** — автоматические коммиты на основе ответов AI агентов
- **Защита корзины** — AI не может удалить файлы из корзины

### Визуализации
- **3D Grid** — трёхмерная визуализация проекта
- **Time Machine** — путешествие во времени по состояниям проекта
- **Code Replay** — воспроизведение сессии кодирования как видео
- **Branch Tree** — визуальное дерево веток
- **Групповые деревья изменений** — визуализация правок для всей группы файлов
- **Граф зависимостей** — интерактивный граф связей файлов (Nexus Vision)

### Расширяемость
- **Система плагинов** — установка, включение/отключение, конфигурация, маркетплейс
- **CLI** — командная строка для работы из терминала
- **Встроенная консоль LH** — полноценный терминал внутри программы
- **150+ API эндпоинтов** — полный программный доступ ко всему функционалу

---

## Установка

### Требования
- **VS Code** 1.85+ или любая IDE на базе VS Code
- **Python** 3.9+ с pip

### Из VSIX
```bash
code --install-extension localhub-3.0.1.vsix --force
```

---

## Быстрый старт

1. Откройте проект в VS Code
2. LocalHub автоматически запустит daemon-сервер
3. Начните работать — снимки создаются автоматически
4. Сайдбар **LocalHub** показывает историю, файлы, группы, ветки
5. `Ctrl+Alt+S` — ручной снимок
6. `Ctrl+Alt+H` — показать все возможности
7. `Ctrl+Alt+L` — открыть встроенную консоль LH

---

## Автор
**Islam Dev** — [standaloneaistorm.com](https://standaloneaistorm.com)
> "Каждое изменение — это точка сохранения. Никогда не теряй свой код."
