# LocalHub тАФ Time Machine for Code

**Automatic local file versioning. No Git commands, no commits тАФ everything in the background.**

LocalHub is a complete "Time Machine" for your code. Every significant action automatically creates a file snapshot. Branches, groups, diff navigator, AI analytics, plugins, cloud sync, global file monitoring тАФ all out of the box.

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
  <img src="./assets/screenshot-watcher.png" width="100%" alt="LocalHub Global Watcher — 18,439 snapshots" />
  <br/><em>Global Watcher: 18,439 snapshots across 10 monitored folders, 235MB stored</em>
</p>



---

## Table of Contents

- [Features](#features)
- [Shadow Sandboxes](./docs/SHADOW_SANDBOXES.md)
- [Universal MCP](./docs/UNIVERSAL_MCP.md)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [LocalHub тАФ Functionality](#localhub--functionality)
  - [Automatic Snapshots](#automatic-snapshots)
  - [File History](#file-history)
  - [Recovery](#recovery)
  - [Change Groups (TM Groups)](#change-groups-tm-groups)
  - [LHL Mode тАФ Auto-grouping](#lhl-mode--auto-grouping)
  - [Branches](#branches)
  - [Zombie Branches and Zombie Commits](#zombie-branches-and-zombie-commits)
  - [Tree Diff тАФ Change Visualization](#tree-diff--change-visualization)
  - [Diff Navigator тАФ Interactive Review](#diff-navigator--interactive-review)
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
  - [Agent Diary тАФ AI Log](#agent-diary--ai-log)
  - [AI Deletion Protection](#ai-deletion-protection)
- [Smart Features тАФ AI Analytics](#smart-features--ai-analytics)
- [Visualizations](#visualizations)
- [Global Watcher тАФ Global Monitoring](#global-watcher--global-monitoring)
- [Panels and Interface](#panels-and-interface)
- [Settings](#settings)
- [Hotkeys](#hotkeys)
- [CLI](#cli)
- [Technologies](#technologies)
- [Author](#author)

---

## Features

### Core
- **Automatic Snapshots** тАФ 7 smart triggers (save, tab switch, editing, focus loss, idle, external changes, deletion)
- **Deduplication** тАФ identical content stored once (SHA-256 hashing)
- **Branches** тАФ parallel versioning lines with merge, cherry-pick, export/import
- **Zombie Branches** тАФ full control over deleted branches and commits with recovery capability
- **Change Groups** тАФ commit analogue with auto-tagging and AI description generation
- **Group Tag Search** тАФ manual assignment of custom text tags with quick search
- **Diff Navigator** тАФ interactive change review with Accept/Reject for each block
- **Rejected Blocks Trash** тАФ saving all rejected code pieces for later recovery
- **Blame** тАФ who and when changed each line (like `git blame`)
- **Bisect** тАФ binary search for bug version (like `git bisect`)
- **Surgical Management** тАФ remove any file from branch or commit via UI

### Monitoring
- **Global Watcher** тАФ background OS-level file monitoring, works even without IDE
- **Seamless Symbiosis** тАФ automatic data transfer between global watcher and local hub
- **Cloud Synchronization** тАФ Google Drive, OneDrive, Dropbox, Yandex Disk or custom API
- **Backup** тАФ centralized backup with rotation

### AI and Analytics
- **8 Smart Analyzers** тАФ predictions, heatmap, refactoring, change velocity, dependencies, clusters, analytics
- **Agent Diary** тАФ automatic logging of AI agent actions
- **Storm Code Integration** тАФ automatic commits based on AI agent responses
- **Trash Protection** тАФ AI cannot delete files from trash

### Visualizations
- **3D Grid** тАФ three-dimensional project visualization
- **Time Machine** тАФ time travel through project states
- **Code Replay** тАФ coding session playback as video
- **Branch Tree** тАФ visual branch tree
- **Group Change Trees** тАФ change visualization for entire file groups (accordion and classic modes)
- **Dependency Graph** тАФ interactive file relationship graph (Nexus Vision)
- **Symbol Timeline** тАФ function and class timeline

### Extensibility
- **Plugin System** тАФ install, enable/disable, configure, marketplace
- **CLI** тАФ command line for terminal work
- **Built-in LH Console** тАФ full terminal inside the program
- **150+ API Endpoints** тАФ full programmatic access to all functionality
- **Shadow Sandboxes** тАФ isolated working copies for AI and human review: create/status/diff/checkout/return/merge/destroy
- **Universal MCP** тАФ standard project-level `.vscode/mcp.json` bootstrap for MCP clients

---

## Installation

### Requirements
- **VS Code** 1.85+ or any VS Code-based IDE
- **Python** 3.9+ with pip

### From VSIX
```bash
# Download .vsix file
code --install-extension localhub-3.0.1.vsix --force

### From Source (Development)
```bash
git clone <repo>
cd localhub-vscode
npm install
npm run compile
# F5 to run in debug mode

Python dependencies are installed automatically on first run.

---

## Quick Start

1. Open project in VS Code
2. LocalHub automatically starts daemon server
3. Start working тАФ snapshots are created automatically
4. **LocalHub** sidebar shows history, files, groups, branches
5. `Ctrl+Alt+S` тАФ manual snapshot
6. `Ctrl+Alt+H` тАФ show all features
7. `Ctrl+Alt+L` тАФ open built-in LH console

---

## LocalHub тАФ Functionality

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

Each snapshot records detailed reason тАФ shows not just "file changed", but what exactly happened.

### File History

- Complete history of all versions in sidebar
- History search with filters (file, date, reason, branch)
- **Starred Files** тАФ version fixation with star for complete deletion protection
- **Context Jump** тАФ jump from starred version directly to corresponding TM group
- Stars show TM group binding тАФ can see entire project state at that moment
- Version description editing
- Delete unnecessary versions

### Recovery

- **Full Recovery** тАФ rollback file to any version in one click
- **Partial Recovery** тАФ select specific blocks for recovery
- **Diff** тАФ compare any version with current file
- Safety snapshot automatically created before recovery

### Change Groups (TM Groups)

Groups are commit analogues. Set of related changes confirmed together.

- **Group Confirmation** тАФ collect accumulated changes into group
- **Smart Confirm** тАФ smart confirmation with automatic analysis
- **AI Description Generation** тАФ automatic summary creation via AI
- **Auto-tagging** тАФ 15+ tag types: `new-function`, `bugfix`, `refactor`, `api-change`, `ui-change`, `ai-generated` etc.
- **Manual Tags** тАФ assign custom text tags for each group
- **Tag Search** тАФ quick search by automatic and manual tags
- **Tag Filtering** тАФ find groups by change type
- **Re-tagging** тАФ recalculate tags for all groups

### LHL Mode тАФ Auto-grouping

Automatic group creation without manual confirmation:

- **By Timeout** тАФ group created after N minutes of inactivity (default 10 min)
- **By Count** тАФ group created after N saves (default 10)
- **Name Template** тАФ `{count}`, `{time}`, `{date}`, `{files}` for name generation

### Branches

Parallel versioning lines, like in Git:

- **Branch Creation** тАФ fork from current state
- **Switching** тАФ instant switch between branches
- **Merge** тАФ branch merging with conflict detection
- **Selective Merge** тАФ choose which files to merge
- **Smart Merge** тАФ smart merge with preview
- **Cherry-Pick** тАФ select individual changes from another branch
- **Export/Import** тАФ export branch to ZIP and import back
- **Stash** тАФ postpone current changes and return later

### Zombie Branches and Zombie Commits

Full control over deleted data:

- **Zombie Branches** тАФ deleted branches don't disappear, but become "zombies"
- **Branch Recovery** тАФ restore any deleted branch in one click
- **Zombie Commits** тАФ deleted commit groups saved in special trash
- **Group Recovery** тАФ restore entire commit group with all files
- **Commit Deletion** тАФ ability to delete commits with content preservation or complete destruction
- **Deletion History** тАФ complete log of all deletions with rollback capability

### Tree Diff тАФ Change Visualization

Advanced diff visualization with semantic analysis:

- **Version Chain** тАФ v1 тЖТ v2 тЖТ v3 тЖТ ... тЖТ vN in one view
- **Group Change Trees** тАФ unique change visualization for entire file group
- **Accordion Mode** тАФ compact view with click expansion
- **Classic View** тАФ traditional change tree with beautiful design
- **Semantic Analysis** тАФ shows "function `getUser()` added", not just "lines 15-20"
- **Language Support** тАФ Python, JavaScript, TypeScript, Go, Rust, Java, C#, PHP, Ruby
- **10 Icon Themes** тАФ Vivid, Minimal, Neon, Pastel, Earth, Aurora, Sunset, Ocean, Candy, Matrix
- **Configurable Context** тАФ number of lines around changes (0-20)
- **Modes** тАФ Collapsed, Step-by-step Chain, Summary

### Diff Navigator тАФ Interactive Review

Navigator for step-by-step change review (like code review in Git):

- **Navigation** тАФ тЧА Previous / тЦ╢ Next block
- **Accept/Reject** тАФ accept or reject each change block
- **Apply Decisions** тАФ surgical application of selected blocks only
- **Rejected Trash** тАФ all rejected blocks saved for later recovery
- Hotkeys in editor panel

### Rejected Blocks Trash

Unique system for saving rejected code:

- **Auto-save** тАФ all rejected blocks automatically go to trash
- **Categorization** тАФ blocks grouped by files and review sessions
- **Recovery** тАФ any rejected block can be restored
- **Search** тАФ quick search by rejected block content
- **Rejection History** тАФ full log with date, time and context
- **Retention Period** тАФ configurable period (default 30 days)

### Blame and Bisect

Git-like analysis tools:

- **Blame** тАФ for each file line: which version appeared, when, why
- **Bisect** тАФ binary search for bug version:
  1. Specify "version X is good, version Y is bad"
  2. System shows middle version
  3. You check тАФ repeat until finding exact version

### Surgical File Management

Direct file management via visual interface:

- **Remove from Branch** тАФ kick any file from branch via context menu
- **Remove from Commit** тАФ remove file from already created commit
- **Instant Exclusion Transfer** тАФ send file to `.localhubignore` directly from UI
- **Stop Tracking** тАФ file stops being tracked, but history preserved
- **Mass Operations** тАФ select multiple files for group actions
- **Visual Mode** тАФ all operations available via drag & drop

### Deleted Files (Trash)

- All deleted files saved to trash
- View deleted file history
- Restore one file or all at once
- Configurable retention period (default 30 days)
- Trash cleanup

### Backup

- **Centralized Backup** тАФ copy snapshots to separate folder (external drive, NAS, cloud)
- **Rotation** тАФ automatic deletion of backups older than N days
- **Restore from Backup** тАФ complete project restoration

### GitHub Synchronization

- Upload project to GitHub via Personal Access Token
- Clone from GitHub
- Auto-sync on group confirmation
- SSH Push for advanced users
- Sync branch configuration

### Git Integration

- **Auto Git Commit** тАФ automatic `git commit` on TM Group confirmation
- **Auto Push** тАФ automatic `git push` after commit
- **Configurable Prefix** for commit messages

### Storm Code Integration

Automatic commits based on AI agent work:

- **Response Tracking** тАФ system monitors agent responses in Storm Code
- **Trigger Words** тАФ "Done", "Completed", "Finished", "Ready"
- **Auto-commit** тАФ automatically creates commit when trigger detected
- **AI Description** тАФ agent response used as official commit description
- **Task Linking** тАФ commit automatically linked to task in Storm Code
- **Agent History** тАФ all agent commits available in separate panel

### Built-in LH Console

Full terminal inside the program:

- **Quick Access** тАФ `Ctrl+Alt+L` to open console
- **All LH Commands** тАФ available without `lh` prefix
- **Auto-completion** тАФ intelligent hints for commands and files
- **Command History** тАФ navigation with up/down arrows
- **Color Highlighting** тАФ syntax highlighting for output
- **UI Integration** тАФ command results displayed in panels
- **Macros** тАФ create custom command aliases

### Plugins

Extensible plugin system:

- Install plugins from folder or marketplace
- Enable/disable without deletion
- Configure each plugin via UI
- Update checking
- Plugins react to events (file save, group confirmation, etc.)

### Agent Diary тАФ AI Log

Automatic logging of AI agent actions:

- Record all saves, commits, branch operations
- Terminal command logging
- Diary files in `.localhub/agent/` тАФ readable Markdown
- Next AI agent can use diary as "memory"
- Configurable log rotation

### AI Deletion Protection

- AI agents **cannot** clear trash, delete files from trash or erase history
- Only user via UI can perform destructive operations
- Log of all deletion attempts

---

## Smart Features тАФ AI Analytics

8 smart analyzers based on change history:

| Analyzer | Description |
|----------|-------------|
| **Predictive Suggestions** | Predict files you'll likely change |
| **Timeline View** | Visual project change timeline |
| **Activity Heatmap** | Heatmap тАФ which files change most often |
| **Refactoring Hints** | Refactoring recommendations based on change patterns |
| **Change Velocity** | Change speed over time тАФ when project develops faster |
| **Dependency Overlay** | Dependency analysis тАФ static imports vs. co-changes |
| **Smart Clusters** | Automatic detection of logical file groups |
| **Analytics Dashboard** | Overall project health statistics |

---

## Visualizations

| Visualization | Description |
|--------------|-------------|
| **3D Grid** | Three-dimensional project structure visualization |
| **Time Machine** | Time travel тАФ view project state at any moment |
| **Code Replay** | Coding session playback as accelerated video |
| **Branch Tree** | Visual branch tree with hierarchy and history |
| **Dependency Graph** | Interactive file relationship graph (co-changes) |
| **Nexus Vision** | Advanced graph with clusters, filters and animation |
| **Symbol Timeline** | Function and class timeline |
| **Group Trees** | Change visualization for entire file group |

---

## Global Watcher тАФ Global Monitoring

Global Watcher тАФ separate system for OS-level file monitoring. Works independently of VS Code тАФ files tracked while daemon runs.

### Features

- **Monitor Any Folders** тАФ not just open project, but any computer folders
- **IDE Independence** тАФ works while daemon process runs
- **Global and Local Folders** тАФ global visible from any project, local only from current
- **150+ Default Exclusions** тАФ node_modules, .git, __pycache__, etc.
- **Support .localhubignore** тАФ own file ignore system in each folder
- **Seamless Symbiosis** тАФ automatic transfer of current picture to local hub when editor opens

### History and Recovery

- Complete version history for each tracked file
- View, diff, restore any version
- Track deleted files
- Configurable storage (days, max versions)

### Cloud Synchronization

- **Folder Mode** тАФ sync via Google Drive, OneDrive, Dropbox, Yandex Disk (auto-detect)
- **API Mode** тАФ sync via HTTP API
- **Instant or Periodic** synchronization
- Status and progress in panel

### Project Export

- Export folder to ZIP with latest file versions
- Optional тАФ with complete history (all versions)

### Management

Three daemon process management levels:

| Level | Description | Buttons |
|-------|-------------|---------|
| **Main Daemon** | Entire Python process | Start, Stop, Restart |
| **LocalHub Daemon** | Project server | Start, Stop, Restart |
| **Global Watcher** | Monitoring module | Start, Stop, Restart |

### Settings Panel

5 tabs in full panel:

1. **Overview** тАФ statistics, daemon status
2. **Folders** тАФ manage watched folders (global + local)
3. **History** тАФ files, versions, recovery, deleted files
4. **Cloud Sync** тАФ cloud synchronization (service setup, sync now)
5. **Settings** тАФ debounce, exclusions, rotation, backup

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
| **Deleted Files** | Trash тАФ deleted files |
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
| `localhub.lhl.namePattern` | тАФ | Group name template |

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
| `localhub.backup.centralPath` | тАФ | Backup folder |
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
| `localhub.github.token` | тАФ | Personal Access Token |
| `localhub.github.owner` | тАФ | Username |
| `localhub.github.repo` | тАФ | Repository |
| `localhub.github.branch` | `main` | Branch |
| `localhub.github.syncOnConfirm` | `false` | Auto-sync on confirmation |

### Git

| Setting | Default | Description |
|---------|---------|-------------|
| `localhub.git.syncOnConfirm` | `false` | Auto git commit |
| `localhub.git.autoPush` | `false` | Auto git push |
| `localhub.git.commitPrefix` | тАФ | Commit prefix |

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
| `localhub.marketplaceUrl` | тАФ | Plugin marketplace URL |
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

### Built-in Console

All commands also available in built-in console without `lh` prefix:

```bash
status             # Project status
log [file]         # History
diff <file>        # Compare
restore <file>     # Recovery
# ... and all other commands

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

## Оглавление

- [Возможности](#возможности)
- [Shadow Sandboxes](./docs/SHADOW_SANDBOXES.md)
- [Universal MCP](./docs/UNIVERSAL_MCP.md)
- [Установка](#установка)
- [Быстрый старт](#быстрый-старт)
- [LocalHub — Функционал](#localhub--функционал)
  - [Автоматические снимки](#автоматические-снимки)
  - [История файлов](#история-файлов)
  - [Восстановление](#восстановление)
  - [Группы изменений (TM Groups)](#группы-изменений-tm-groups)
  - [LHL Mode — Автогруппировка](#lhl-mode--автогруппировка)
  - [Ветки](#ветки)
  - [Зомби-ветки и Зомби-коммиты](#зомби-ветки-и-зомби-коммиты)
  - [Tree Diff — Визуализация изменений](#tree-diff--визуализация-изменений)
  - [Diff Navigator — Интерактивный обзор](#diff-navigator--интерактивный-обзор)
  - [Корзина отклоненных блоков](#корзина-отклоненных-блоков)
  - [Blame и Bisect](#blame-и-bisect)
  - [Хирургическое управление файлами](#хирургическое-управление-файлами)
  - [Удалённые файлы (Корзина)](#удалённые-файлы-корзина)
  - [Резервное копирование](#резервное-копирование)
  - [GitHub синхронизация](#github-синхронизация)
  - [Git интеграция](#git-интеграция)
  - [Storm Code интеграция](#storm-code-интеграция)
  - [Встроенная консоль LH](#встроенная-консоль-lh)
  - [Плагины](#плагины)
  - [Agent Diary — Дневник AI](#agent-diary--дневник-ai)
  - [Защита от AI удаления](#защита-от-ai-удаления)
- [Smart Features — AI-аналитика](#smart-features--ai-аналитика)
- [Визуализации](#визуализации)
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
- **Поиск по тегам групп** — ручное присвоение собственных текстовых тегов с быстрым поиском
- **Diff-навигатор** — интерактивный обзор изменений с Accept/Reject на каждый блок
- **Корзина отклоненных блоков** — сохранение всех rejected кусков кода для последующего восстановления
- **Blame** — кто и когда изменил каждую строку (как `git blame`)
- **Bisect** — бинарный поиск версии с багом (как `git bisect`)
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
- **Symbol Timeline** — временная линия функций и классов

### Расширяемость
- **Система плагинов** — установка, включение/отключение, конфигурация, маркетплейс
- **CLI** — командная строка для работы из терминала
- **Встроенная консоль LH** — полноценный терминал внутри программы
- **150+ API эндпоинтов** — полный программный доступ ко всему функционалу
- **Shadow Sandboxes** — изолированные рабочие копии для AI и human review
- **Universal MCP** — стандартный project-level `.vscode/mcp.json` bootstrap для MCP-клиентов

---

## Установка

### Требования
- **VS Code** 1.85+ или любая IDE на базе VS Code
- **Python** 3.9+ с pip

### Из VSIX
```bash
code --install-extension localhub-3.0.1.vsix --force
```

### Из исходников (разработка)
```bash
git clone <repo>
cd localhub-vscode
npm install
npm run compile
# F5 для запуска в debug режиме
```

Python зависимости устанавливаются автоматически при первом запуске.

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

## LocalHub — Функционал

### Автоматические снимки

7 умных триггеров автоматически создают снимки файлов:

| Триггер | Описание |
|---------|----------|
| **Сохранение файла** | Ctrl+S или автосохранение → снимок `auto:save` |
| **Переключение вкладки** | Снимок старого файла (`tab_switch`) и нового (`tab_focus`) |
| **Открытие файла** | Клик в проводнике → `explorer_click` |
| **Редактирование текста** | После паузы 2 сек → детальная причина: `added:"код"`, `deleted:15chars` |
| **Потеря фокуса** | Сворачивание IDE → снимок открытого файла |
| **Idle** | Настраиваемый интервал простоя (по умолчанию 5 мин) |
| **Внешние изменения** | AI агенты, терминал, другие редакторы → `external:change` |

### История файлов

- Полная история всех версий в сайдбаре
- Поиск по истории с фильтрами (файл, дата, причина, ветка)
- **Отмеченные файлы** — фиксация версии звёздочкой для полной защиты от удаления
- **Context Jump** — переход из отмеченной версии прямо в соответствующую TM группу
- Редактирование описания версии
- Удаление ненужных версий

### Восстановление

- **Полное восстановление** — откат файла к любой версии в один клик
- **Частичное восстановление** — выбор конкретных блоков для восстановления
- **Diff** — сравнение любой версии с текущим файлом
- Перед восстановлением автоматически создаётся страховочный снимок

### Группы изменений (TM Groups)

Группы — аналог коммитов. Набор связанных изменений, подтверждённых вместе.

- **Подтверждение группы** — собрать накопленные изменения в группу
- **Smart Confirm** — умное подтверждение с автоматическим анализом
- **AI-генерация описания** — автоматическое создание саммари через AI
- **Автотегирование** — 15+ типов тегов: `new-function`, `bugfix`, `refactor`, `api-change`, `ui-change`, `ai-generated` и др.
- **Ручные теги** — присвоение своих текстовых тегов каждой группе
- **Поиск по тегам** — быстрый поиск по автоматическим и ручным тегам

### LHL Mode — Автогруппировка

Автоматическое создание групп без ручного подтверждения:

- **По таймауту** — группа создаётся после N минут бездействия (по умолчанию 10 мин)
- **По количеству** — группа создаётся после N сохранений (по умолчанию 10)
- **Шаблон имени** — `{count}`, `{time}`, `{date}`, `{files}` для генерации имени

### Ветки

Параллельные линии версионирования, как в Git:

- **Создание ветки** — форк от текущего состояния
- **Переключение** — мгновенное переключение между ветками
- **Merge** — слияние веток с определением конфликтов
- **Selective Merge** — выбор файлов для слияния
- **Smart Merge** — умное слияние с предпросмотром
- **Cherry-Pick** — выбор отдельных изменений из другой ветки
- **Export/Import** — экспорт ветки в ZIP и обратный импорт
- **Stash** — отложить текущие изменения и вернуться позже

### Зомби-ветки и Зомби-коммиты

Полный контроль над удалёнными данными:

- **Зомби-ветки** — удалённые ветки не исчезают, а становятся "зомби"
- **Восстановление ветки** — восстановить любую удалённую ветку в один клик
- **Зомби-коммиты** — удалённые группы коммитов сохраняются в специальной корзине
- **Восстановление группы** — восстановить целую группу коммитов со всеми файлами

### Tree Diff — Визуализация изменений

Продвинутая визуализация diff с семантическим анализом:

- **Цепочка версий** — v1 → v2 → v3 → ... → vN в одном виде
- **Accordion Mode** — компактный вид с раскрытием по клику
- **Семантический анализ** — показывает "функция `getUser()` добавлена", а не просто "строки 15-20"
- **Поддержка языков** — Python, JavaScript, TypeScript, Go, Rust, Java, C#, PHP, Ruby
- **10 тем иконок** — Vivid, Minimal, Neon, Pastel, Earth, Aurora, Sunset, Ocean, Candy, Matrix

### Diff Navigator — Интерактивный обзор

Навигатор для пошагового обзора изменений (как code review в Git):

- **Навигация** — ◀ Предыдущий / ▶ Следующий блок
- **Accept/Reject** — принять или отклонить каждый блок изменений
- **Применение решений** — хирургическое применение только выбранных блоков
- **Корзина отклонённых** — все rejected блоки сохраняются для последующего восстановления

### Корзина отклоненных блоков

- **Автосохранение** — все rejected блоки автоматически попадают в корзину
- **Категоризация** — блоки группируются по файлам и сессиям обзора
- **Восстановление** — любой rejected блок можно восстановить
- **Поиск** — быстрый поиск по содержимому rejected блока

### Blame и Bisect

Инструменты анализа, как в Git:

- **Blame** — для каждой строки файла: в какой версии появилась, когда, почему
- **Bisect** — бинарный поиск версии с багом:
  1. Укажите "версия X хорошая, версия Y плохая"
  2. Система показывает среднюю версию
  3. Проверяете — повторяете до нахождения точной версии

### Хирургическое управление файлами

- **Удаление из ветки** — выбросить любой файл из ветки через контекстное меню
- **Удаление из коммита** — убрать файл из уже созданного коммита
- **Быстрое исключение** — отправить файл в `.localhubignore` прямо из UI
- **Остановка отслеживания** — файл прекращает отслеживаться, но история сохраняется
- **Массовые операции** — выбор нескольких файлов для групповых действий

### Удалённые файлы (Корзина)

- Все удалённые файлы сохраняются в корзину
- Просмотр истории удалённого файла
- Восстановление одного файла или всех сразу
- Настраиваемый срок хранения (по умолчанию 30 дней)

### Резервное копирование

- **Централизованный бэкап** — копирование снимков в отдельную папку (внешний диск, NAS, облако)
- **Ротация** — автоматическое удаление бэкапов старше N дней
- **Восстановление из бэкапа** — полное восстановление проекта

### GitHub синхронизация

- Загрузка проекта на GitHub через Personal Access Token
- Клонирование с GitHub
- Автосинк при подтверждении группы
- SSH Push для продвинутых пользователей

### Git интеграция

- **Auto Git Commit** — автоматический `git commit` при подтверждении TM Group
- **Auto Push** — автоматический `git push` после коммита
- **Настраиваемый префикс** для сообщений коммита

### Storm Code интеграция

Автоматические коммиты на основе работы AI агента:

- **Отслеживание ответов** — система следит за ответами агента в Storm Code
- **Триггерные слова** — "Done", "Completed", "Finished", "Ready"
- **Авто-коммит** — автоматически создаёт коммит при обнаружении триггера
- **AI-описание** — ответ агента используется как официальное описание коммита
- **Привязка к задаче** — коммит автоматически привязывается к задаче в Storm Code

### Встроенная консоль LH

Полноценный терминал внутри программы:

- **Быстрый доступ** — `Ctrl+Alt+L` для открытия консоли
- **Все LH команды** — доступны без префикса `lh`
- **Автодополнение** — умные подсказки для команд и файлов
- **История команд** — навигация стрелками вверх/вниз
- **Цветная подсветка** — синтаксическая подсветка вывода
- **Макросы** — создание собственных алиасов команд

### Плагины

Расширяемая система плагинов:

- Установка плагинов из папки или маркетплейса
- Включение/отключение без удаления
- Настройка каждого плагина через UI
- Проверка обновлений
- Плагины реагируют на события (сохранение файла, подтверждение группы и т.д.)

### Agent Diary — Дневник AI

Автоматическое логирование действий AI агентов:

- Запись всех сохранений, коммитов, операций с ветками
- Логирование команд в терминале
- Файлы дневника в `.localhub/agent/` — читаемый Markdown
- Следующий AI агент может использовать дневник как "память"
- Настраиваемая ротация логов

### Защита от AI удаления

- AI агенты **не могут** очистить корзину, удалить файлы из корзины или стереть историю
- Только пользователь через UI может выполнять деструктивные операции
- Лог всех попыток удаления

---

## Smart Features — AI-аналитика

8 умных анализаторов на основе истории изменений:

| Анализатор | Описание |
|------------|----------|
| **Предиктивные подсказки** | Предсказание файлов, которые вы, вероятно, измените |
| **Timeline View** | Визуальная временная линия изменений проекта |
| **Activity Heatmap** | Тепловая карта — какие файлы меняются чаще всего |
| **Refactoring Hints** | Рекомендации по рефакторингу на основе паттернов изменений |
| **Change Velocity** | Скорость изменений во времени |
| **Dependency Overlay** | Анализ зависимостей — статические импорты vs. совместные изменения |
| **Smart Clusters** | Автоматическое обнаружение логических групп файлов |
| **Analytics Dashboard** | Общая статистика здоровья проекта |

---

## Визуализации

| Визуализация | Описание |
|--------------|----------|
| **3D Grid** | Трёхмерная визуализация структуры проекта |
| **Time Machine** | Путешествие во времени — просмотр состояния проекта в любой момент |
| **Code Replay** | Воспроизведение сессии кодирования как ускоренного видео |
| **Branch Tree** | Визуальное дерево веток с иерархией и историей |
| **Dependency Graph** | Интерактивный граф связей файлов (совместные изменения) |
| **Nexus Vision** | Продвинутый граф с кластерами, фильтрами и анимацией |
| **Symbol Timeline** | Временная линия функций и классов |
| **Group Trees** | Визуализация изменений для всей группы файлов |

---

## Global Watcher — Глобальный мониторинг

Global Watcher — отдельная система для мониторинга файлов на уровне ОС. Работает независимо от VS Code — файлы отслеживаются пока запущен daemon.

### Возможности

- **Мониторинг любых папок** — не только открытый проект, но и любые папки компьютера
- **Независимость от IDE** — работает пока запущен daemon процесс
- **Глобальные и локальные папки** — глобальные видны из любого проекта, локальные только из текущего
- **150+ исключений по умолчанию** — node_modules, .git, __pycache__ и т.д.
- **Поддержка .localhubignore** — своя система игнорирования файлов в каждой папке
- **Бесшовный симбиоз** — автоматическая передача текущей картины в local hub при открытии редактора

### История и восстановление

- Полная история версий для каждого отслеживаемого файла
- Просмотр, diff, восстановление любой версии
- Отслеживание удалённых файлов
- Настраиваемое хранение (дни, максимум версий)

### Облачная синхронизация

- **Режим папки** — синк через Google Drive, OneDrive, Dropbox, Yandex Disk (авто-определение)
- **API режим** — синк через HTTP API
- **Мгновенная или периодическая** синхронизация
- Статус и прогресс в панели

### Управление

Три уровня управления daemon процессом:

| Уровень | Описание | Кнопки |
|---------|----------|--------|
| **Main Daemon** | Весь Python процесс | Старт, Стоп, Рестарт |
| **LocalHub Daemon** | Сервер проекта | Старт, Стоп, Рестарт |
| **Global Watcher** | Модуль мониторинга | Старт, Стоп, Рестарт |

---

## Панели и интерфейс

### Сайдбар LocalHub (11 секций)

| Панель | Описание |
|--------|----------|
| **File History** | Все версии выбранного файла со звёздочками |
| **Tracked Files** | Все файлы с историей в проекте |
| **Pending Changes** | Несгруппированные изменения |
| **TM Groups** | Подтверждённые группы с тегами и поиском |
| **Branches** | Ветки версионирования |
| **Zombie Branches** | Корзина удалённых веток |
| **Zombie Commits** | Корзина удалённых коммитов |
| **Rejected Blocks** | Корзина rejected блоков кода |
| **Deleted Files** | Корзина — удалённые файлы |
| **Dashboard** | Статистика и метрики проекта |
| **Smart Features** | AI анализаторы |

### Настройки (11 вкладок)

| Вкладка | Содержимое |
|---------|------------|
| **General** | Основные настройки, LHL режим, игнор, управление daemon |
| **Global Watcher** | Включение GW, папки, параметры хранения, симбиоз |
| **Backup** | Централизованный бэкап, корзина |
| **Git Sync** | Автоматический git commit/push |
| **GitHub** | Токен, репо, автосинк |
| **Storm Code** | Интеграция AI агента, триггерные слова |
| **Console** | Настройки встроенной консоли, макросы |
| **Advanced** | Путь Python, порт, маркетплейс, Agent Diary |
| **Tree Diff** | Тема иконок, семантический анализ, контекст, режимы |
| **Plugins** | Управление плагинами |
| **About** | О программе, статистика |

---

## Горячие клавиши

| Комбинация | Действие |
|-----------|----------|
| `Ctrl+Alt+H` | Показать все возможности |
| `Ctrl+Alt+S` | Создать снимок |
| `Ctrl+Alt+B` | Создать ветку |
| `Ctrl+Alt+T` | Показать корзину |
| `Ctrl+Alt+Shift+T` | Показать корзину веток |
| `Ctrl+Alt+Shift+G` | Показать корзину TM групп |
| `Ctrl+Alt+Shift+R` | Показать корзину отклонённых блоков |
| `Ctrl+Alt+R` | Показать бэкапы |
| `Ctrl+Alt+L` | Открыть встроенную консоль |
| `Ctrl+Alt+X` | Хирургическое удаление файла |
| `Ctrl+Alt+I` | Добавить файл в исключения |

---

## CLI-1

Командная строка для работы из терминала:

```bash
lh status          # Статус проекта
lh log [file]      # История проекта/файла
lh diff <file>     # Diff с последней версией
lh restore <file>  # Восстановить файл
lh branch          # Список веток
lh branch trash    # Корзина удалённых веток
lh group           # Список TM групп
lh group trash     # Корзина удалённых TM групп
lh rejected        # Корзина rejected блоков
lh surgery <file>  # Хирургическое удаление файла
lh ignore <file>   # Добавить файл в исключения
lh tag <group>     # Добавить тег к группе
lh search <tag>    # Поиск по тегам
lh push            # Push на GitHub
```

Все команды также доступны во встроенной консоли без префикса `lh`.

---

## Технологии

| Компонент | Технология |
|-----------|------------|
| IDE расширение | TypeScript, VS Code Extension API |
| Сервер | Python, FastAPI, Uvicorn |
| База данных | SQLite |
| Хранилище файлов | Content-addressable storage (SHA-256) |
| Мониторинг файлов | watchdog (Python) + VS Code FileSystemWatcher |
| Граф визуализация | Cytoscape.js |
| 3D визуализация | Three.js |
| Встроенная консоль | xterm.js + node-pty |
| Поддержка IDE | VS Code и любая IDE на базе VS Code |

---

## Автор

**Islam Dev** — [standaloneaistorm.com](https://standaloneaistorm.com)

> «Каждое изменение — это точка сохранения. Никогда не теряй свой код.»
