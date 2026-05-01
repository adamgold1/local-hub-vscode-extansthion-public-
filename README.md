# LocalHub - Time Machine for Code

LocalHub is automatic local version history for VS Code and VS Code-based IDEs.
It keeps snapshots of your files in the background, shows what changed, and lets you recover code without manually creating Git commits.

![Version](https://img.shields.io/badge/version-3.0.6-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-blue)
![Python](https://img.shields.io/badge/Python-3.9%2B-green)
![Status](https://img.shields.io/badge/status-preview-orange)

## What It Does

- Automatic file snapshots on save, editing pauses, tab switches, focus loss, idle time, external changes, and deletion.
- File history with diff, restore, starred versions, version descriptions, and deleted-file recovery.
- TM Groups: commit-like groups for related local changes, with tags and optional AI descriptions.
- Branch-style local timelines with recovery for deleted branches and deleted groups.
- Diff Navigator with accept/reject decisions for individual code blocks.
- Rejected Blocks Trash so discarded code can be recovered later.
- Global Watcher for background OS-level file monitoring outside the IDE.
- Backup, cloud sync options, Git/GitHub integration, CLI, built-in console, plugins, and API endpoints.
- AI-focused safeguards including Agent Diary and deletion protection for trash/history.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/adamgold1/local-hub-vscode-extansthion-public-/main/assets/screenshot-sidebar.png" width="100%" alt="LocalHub sidebar with file history, TM Groups, and branches" />
  <br/><em>LocalHub sidebar: file history, TM Groups, branches, trash, dashboard, and graph tools inside VS Code.</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/adamgold1/local-hub-vscode-extansthion-public-/main/assets/screenshot-watcher.png" width="100%" alt="LocalHub Global Watcher dashboard" />
  <br/><em>Global Watcher: background monitoring for folders, snapshots, storage, and daemon status.</em>
</p>

## Installation

### From Visual Studio Marketplace

Open VS Code Quick Open with `Ctrl+P`, paste this command, and press Enter:

```text
ext install IslamChomaev.localhub-time-machine
```

### From VSIX

```powershell
code --install-extension localhub-time-machine-3.0.6-win32-x64-IslamChomaev-autotray.vsix --force
```

### Requirements

- VS Code 1.85+ or a VS Code-based IDE.
- Python 3.9+ with `pip`.

Python dependencies are installed automatically on first run.

## Quick Start

1. Install the extension.
2. Open a project folder in VS Code.
3. Start editing files.
4. LocalHub creates snapshots automatically in the background.
5. Use the LocalHub sidebar to inspect history, diffs, groups, branches, trash, and recovery tools.

Useful shortcuts:

| Shortcut | Action |
| --- | --- |
| `Ctrl+Alt+S` | Create manual snapshot |
| `Ctrl+Alt+H` | Open feature hub |
| `Ctrl+Alt+L` | Open built-in LH console |
| `Ctrl+Alt+B` | Create branch |
| `Ctrl+Alt+T` | Open trash |

## Preview Build

This Marketplace package is marked as Preview while the lightweight Control Center auto-download flow is being finalized.

The VSIX does not bundle the heavy Control Center runtime. On first launch, LocalHub checks whether the runtime is present and downloads `localhub-tray-runtime-win32-x64.zip` automatically when needed.

Core extension features remain inside the VS Code extension: snapshots, history, TM Groups, branches, diff tools, AI features, Global Watcher bridge, MCP, CLI, plugins, and UI panels.

## LocalHub Functionality

### History and Recovery

- Create automatic and manual snapshots.
- Compare any version with the current file.
- Restore a full file or selected blocks.
- Keep deleted files in trash with configurable retention.
- Star important versions to protect them from cleanup.

### TM Groups

- Confirm related changes as one group.
- Add automatic and manual tags.
- Search groups by tag or description.
- Generate AI summaries when configured.
- Recover deleted groups from Zombie Commits.

### Branches

- Create local timeline branches.
- Switch between branches.
- Merge or selectively bring changes across branches.
- Keep deleted branches recoverable as Zombie Branches.
- Export and import branch state.

### Diff Navigator

- Review changed blocks one by one.
- Accept or reject individual blocks.
- Apply only selected decisions.
- Save rejected code in Rejected Blocks Trash for later recovery.

### Global Watcher

- Monitor selected folders even when the IDE is not active.
- Transfer global watcher data into LocalHub project history.
- Show watched folders, snapshot count, storage usage, and daemon status.

### AI and Automation

- Agent Diary logs AI-agent activity into readable project notes.
- AI deletion protection prevents agents from erasing trash/history.
- Storm Code integration can create LocalHub/Git commits from agent completion signals.
- Smart analytics include activity heatmaps, dependency views, change velocity, and clustering.

### CLI

```bash
lh status
lh log [file]
lh diff <file>
lh restore <file>
lh branch
lh branch trash
lh group
lh group trash
lh rejected
lh surgery <file>
lh ignore <file>
lh tag <group>
lh search <tag>
lh push
```

---

# LocalHub - Машина времени для кода

LocalHub - это автоматическая локальная история версий для VS Code и IDE на базе VS Code.
Расширение сохраняет снимки файлов в фоне, показывает изменения и помогает вернуть код без ручных Git-коммитов.

## Что умеет LocalHub

- Автоматически создает снимки файлов при сохранении, паузе в редактировании, переключении вкладок, потере фокуса, простое, внешних изменениях и удалении.
- Показывает историю файла, diff, восстановление, избранные версии, описания версий и корзину удаленных файлов.
- Собирает связанные изменения в TM Groups - локальные группы, похожие на коммиты.
- Поддерживает локальные ветки истории, Zombie Branches и Zombie Commits для восстановления удаленных веток и групп.
- Дает Diff Navigator: можно принять или отклонить отдельные блоки изменений.
- Хранит отклоненные куски кода в Rejected Blocks Trash.
- Следит за папками через Global Watcher даже вне активной IDE.
- Поддерживает бэкап, облачную синхронизацию, Git/GitHub, CLI, встроенную консоль, плагины и API.
- Защищает историю и корзину от случайного удаления AI-агентами.

## Установка

В VS Code нажмите `Ctrl+P`, вставьте команду и нажмите Enter:

```text
ext install IslamChomaev.localhub-time-machine
```

Или установите VSIX локально:

```powershell
code --install-extension localhub-time-machine-3.0.6-win32-x64-IslamChomaev-autotray.vsix --force
```

Требования:

- VS Code 1.85+ или IDE на базе VS Code.
- Python 3.9+ с `pip`.

Python-зависимости устанавливаются автоматически при первом запуске.

## Быстрый старт

1. Установите расширение.
2. Откройте проект в VS Code.
3. Работайте с файлами как обычно.
4. LocalHub будет создавать снимки автоматически.
5. В сайдбаре LocalHub можно смотреть историю, diff, группы, ветки, корзину и восстановление.

## Основные разделы

- История файлов и восстановление.
- TM Groups для связанных изменений.
- Ветки и восстановление удаленных веток.
- Diff Navigator и корзина отклоненных блоков.
- Global Watcher для фонового мониторинга папок.
- Agent Diary, AI-защита, аналитика, CLI и плагины.

## Author

Islam Dev

> Every change is a save point. Never lose your code.

## Links

- Visual Studio Marketplace: https://marketplace.visualstudio.com/items?itemName=IslamChomaev.localhub-time-machine
- Direct VSIX download: https://marketplace.visualstudio.com/_apis/public/gallery/publishers/IslamChomaev/vsextensions/localhub-time-machine/3.0.6/vspackage
- Public VSIX mirror: https://github.com/adamgold1/local-hub-vscode-extansthion-public-/raw/main/localhub-time-machine-3.0.6-win32-x64-IslamChomaev-autotray.vsix
- Public release repository: https://github.com/adamgold1/local-hub-vscode-extansthion-public-
- Website: https://standaloneaistorm.com
- Storm Code Companion: https://github.com/adamgold1/Storm_Code.-PUBLIC
- Shadow Sandboxes docs: ./docs/SHADOW_SANDBOXES.md
- Universal MCP docs: ./docs/UNIVERSAL_MCP.md
- Control Center runtime: https://github.com/adamgold1/local-hub-vscode-extansthion-public-/raw/main/localhub-tray-runtime-win32-x64.zip
