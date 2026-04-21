# 📚 LocalHub Documentation

## Features & Commands Reference

> **🤖 For AI Agents:** See [API_REFERENCE.md](./API_REFERENCE.md) for exact API formats.
> **🧪 Shadow Sandboxes:** See [SHADOW_SANDBOXES.md](./SHADOW_SANDBOXES.md).
> **🔌 Universal MCP:** See [UNIVERSAL_MCP.md](./UNIVERSAL_MCP.md).

---

# 🔄 Smart Triggers (Auto-Save)

LocalHub automatically saves your files in these situations:

| Trigger | Description | When it fires |
|---------|-------------|---------------|
| **SAVE** | Manual save | When you press `Ctrl+S` |
| **TAB_SWITCH** | Tab change | When you switch between files |
| **EXTERNAL_CHANGE** | External edit | When file is modified outside VS Code |
| **FILE_CREATED** | New file | When you create a new file |
| **BEFORE_CLOSE** | Closing file | Before you close a file tab |
| **TERMINAL** | Terminal command | After terminal commands that may change files |

### Configuration:
```json
{
    "localhub.triggers.onSave": true,
    "localhub.triggers.onTabSwitch": true,
    "localhub.triggers.onExternalChange": true,
    "localhub.triggers.onFileCreated": true
}
```

---

# 🌿 Git-like Branches

LocalHub supports full branch isolation like Git:

| Feature | Description |
|---------|-------------|
| **Create Branch** | Creates a new branch with current state |
| **Switch Branch** | Checkout - restores files, deletes branch-specific files |
| **Merge Branch** | Copies files from source to target branch |
| **Delete Branch** | Moves branch to zombie trash (cannot delete active branch) |
| **Branch Trash** | View deleted branches and restore them |

### Branch Isolation:
- Files created in Branch A are **NOT visible** in Branch B
- Pending changes are **isolated per branch**
- Switching branches **physically deletes/restores** files

### Commands:
- `LocalHub: Create Branch` - Create new branch
- `LocalHub: Switch Branch` - Switch to different branch
- `LocalHub: Merge Branch` - Merge branches (with conflict detection)
- `LocalHub: Export Branch to ZIP` - Export all files to archive
- `LocalHub: Delete Branch` - Delete a branch
- `LocalHub: Show Deleted Branches (Branch Trash)` - View deleted branches

### Branch Trash:
- Deleted branches are kept as **zombie branches**
- History, groups, and branch-local snapshots stay intact
- You can restore the branch later from Branch Trash
- Time Travel Branch Tree can show zombie branches in a faded style

---

# 📦 Export to ZIP

Export entire branch state to a ZIP archive:

| Step | Action |
|------|--------|
| 1 | Right-click on branch |
| 2 | Select "Export Branch to ZIP" |
| 3 | ZIP created in project folder |

**API:** `POST /branches/{id}/export`

---

# 📥 Import from ZIP

Import a ZIP archive into a new branch:

| Step | Action |
|------|--------|
| 1 | Command Palette: "LocalHub: Import Branch from ZIP" |
| 2 | Select ZIP file |
| 3 | Enter branch name |
| 4 | Confirm import |

**Features:**
- Preview file count and size before import
- Creates new branch automatically
- All files become tracked snapshots

### API:
```
POST /import/validate - Preview ZIP contents
POST /import/zip - Import into new branch
```

---

# ⚠️ Merge Conflicts

When merging branches, LocalHub detects conflicts:

**Conflict = Same file modified differently in both branches**

### Conflict Resolution:
1. **View Diff** - See what changed in both branches before deciding
2. **Smart Merge** - Choose action for EACH conflicting file:
   - `Use Source` - Take version from the branch being merged
   - `Keep Target` - Keep current version in active branch
   - `Skip` - Don't change this file
3. **Force Merge** - Overwrite ALL target files with source version
4. **Cancel** - Abort merge entirely

### View Diff Between Branches:
Before merge, you can see exactly what's different:
```
GET /branches/{source_id}/diff?target_branch_id={target_id}&path={file_path}
```

Returns unified diff showing:
- Lines added in source branch
- Lines removed from target branch
- Line counts for both versions

### API:
```
GET /branches/{id}/diff?target_branch_id={id}&path={path}  - Get file diff
POST /branches/{id}/merge?force=true  - Force merge (overwrite)
POST /branches/{id}/selective-merge  - Smart merge (per-file resolution)
```

---


# 📦 TM Groups (Commits)

Group your changes like Git commits:

| Feature | Description |
|---------|-------------|
| **Pending Changes** | Unsaved changes waiting for commit |
| **Confirm (OK)** | Create a named group/commit |
| **Groups List** | View all commits with dates |
| **Delete Group** | Remove a group (keeps snapshots) |

### API:
```
GET /groups/pending - Get pending changes
POST /groups/confirm - Create commit
GET /groups - List all groups
DELETE /groups/{id} - Delete group
```

### TM Group Checkout (Detached Time Travel):

Move the entire workspace to the exact state of any confirmed TM Group, then return to the current branch head.

| Feature | Description |
|---------|-------------|
| **Checkout TM Group** | Restores the whole workspace to the selected confirmed TM Group |
| **Detached Mode** | Shows that workspace is detached from current branch head |
| **Return To Branch Head** | Restores the workspace back to the active branch head |
| **Future Groups Marker** | TM Groups created after the checked-out point stay visible and are marked as future |
| **Checkout Status** | Shows current detached/head state and neighbor groups |

### UI:
- Right-click a TM Group → **Checkout TM Group**
- Right-click a TM Group while detached → **Return To Branch Head**
- Toolbar button in **TM GROUPS**: **Return To Branch Head**
- Checked out group gets a visual marker in the list

### CLI:
```bash
lh group checkout 128   # Checkout workspace to TM Group #128
lh group status         # Show current TM group checkout status
lh group head           # Return workspace to active branch head
```

### API:
```
POST /groups/{id}/checkout - Checkout workspace to TM Group
POST /groups/checkout/clear - Return workspace to branch head
GET /groups/checkout/status - Current detached/head state
```

---

# 🕐 File History

Every file has complete version history:

| Feature | Description |
|---------|-------------|
| **View History** | See all versions with timestamps |
| **Restore** | Restore file to any previous version |
| **Diff** | Compare versions side-by-side |
| **Partial Restore** | Restore only specific lines |

### Commands:
- Click file in "File History" panel
- Right-click version → Restore / Diff

---

# 💾 Backup System

### Local Backup:
- Location: `.localhub/backups/` in project folder
- Content-addressable storage (deduplication)

### Central Backup (Disaster Recovery):
- Location: `%APPDATA%\LocalHub\backups\{project}\`
- Protected from accidental deletion
- Contains `recovery_info.json` for restoration

### API:
```
GET /backup/info - Backup locations and sizes
GET /backup/list - All projects with backups
POST /backup/cleanup?days=30 - Cleanup old backups
```

---

# 🗑️ Cleanup Old Versions

Delete old versions to save disk space:

### How to use:
1. Command Palette: "LocalHub: Cleanup Old Versions"
2. Enter number of days to keep
3. Confirm deletion

**Versions older than N days will be permanently deleted!**

### Settings:
- **Retention Days**: Default number of days to keep (Settings > LocalHub > Backup > Retention Days).
- **Auto Cleanup**: Enable automatic cleanup on startup (Settings > LocalHub > Backup > Auto Cleanup).

---


# ⌨️ Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Ctrl+Alt+H` | Show LocalHub Features |
| `Ctrl+Alt+S` | Manual Snapshot |
| `Ctrl+Alt+B` | Create Branch |

---

# 🔧 Settings

Access via gear icon in LocalHub panel:

| Setting | Description |
|---------|-------------|
| **Backup Path** | Custom path for central backups |
| **Retention Days** | Auto-cleanup backups older than N days |

---

# ☁️ Cloud Sync (GitHub Integration)

Sync your LocalHub snapshots to GitHub.

## Setup Methods:

### 1. Via Command Palette:
- `Ctrl+Shift+P` → "LocalHub: Setup GitHub Integration"
- Enter your GitHub Personal Access Token
- Enter username and repository name

### 2. Via Settings (settings.json):
```json
{
    "localhub.github.enabled": true,
    "localhub.github.owner": "your-username",
    "localhub.github.repo": "your-repo",
    "localhub.github.branch": "main",
    "localhub.github.syncOnConfirm": false
}
```
Note: Token is stored securely in VS Code Secrets.

### 3. Via Panel Button:
- Click ☁️ cloud icon in **Pending Changes** panel
- Follow the prompts

## Getting GitHub Token:
1. Go to **github.com** → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token → Select **repo** scope
4. Copy token (starts with `ghp_`)

## Features:
| Feature | Description |
|---------|-------------|
| **Manual Sync** | Click cloud button to upload |
| **Sync on Confirm** | Auto-upload when confirming groups |
| **Progress Tracking** | See upload progress in status bar |
| **Abort** | Cancel upload anytime |

## Commands:
- `LocalHub: Sync to GitHub` - Upload to GitHub
- `LocalHub: Setup GitHub Integration` - Configure credentials
- `LocalHub: Clone from GitHub` - Download repo to new branch

---

# ⬇️ Clone from GitHub

Download a GitHub repository into a new LocalHub branch.

## How to Use:
1. `Ctrl+Shift+P` → "LocalHub: Clone from GitHub"
2. Enter GitHub token (or use saved token)
3. Enter username/organization
4. Enter repository name
5. Select branch to clone (default: main)
6. Enter local branch name

## API:
```bash
curl -X POST "http://127.0.0.1:19876/cloud/github/clone" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ghp_xxx",
    "repo_owner": "username",
    "repo_name": "repo",
    "branch": "main",
    "target_branch_name": "my-local-branch"
  }'
```

**Response:** `{"ok":true,"downloaded_files":50,"branch_name":"my-local-branch"}`

---

# 🔑 SSH Key Setup

Alternative to Personal Access Tokens - use SSH keys for GitHub auth.

## How to Use:
1. `Ctrl+Shift+P` → "LocalHub: Setup SSH Key"
2. If key exists: Copy or open GitHub settings
3. If no key: Generate new ed25519 key
4. Add public key to GitHub

## Features:
- Auto-detect existing SSH keys
- Copy public key to clipboard
- Open GitHub SSH settings page
- Generate new key if needed

---

# 🚀 SSH Push (Git CLI)

Push files to GitHub using Git CLI (supports SSH authentication).

## How to Use:
1. `Ctrl+Shift+P` → "LocalHub: Push via SSH/Git"
2. Enter remote URL: `git@github.com:user/repo.git`
3. Enter branch: `main`

## API:
```bash
POST /cloud/ssh/push
{"remote_url": "git@github.com:user/repo.git", "branch": "main"}
```

---

# 🔄 Merge Memory (Tracking)

LocalHub remembers which branches have been merged.

## Visual Indicators:
- **Green merge icon** on merged branches
- **"merged"** label in description
- **Tooltip** shows: "Merged into #X" + date/time

## API:
Branches endpoint returns:
```json
{
  "merged_into": 1,
  "merged_at": 1736727788.123,
  "merge_conflicts": "[...]"  // if force merged
}
```

## After Merge:
- System asks: "Delete merged branch?"
- Options: Delete / Keep

---

# 🤖 Agent Diary (Black Box)

Automatic logging of all actions for AI agents and debugging.

## Location:
- `.localhub/agent/` - Session and event logs
- `.localhub/DOCS.md` - Full documentation (READ-ONLY)

## File Types:
| File | Description |
|------|-------------|
| `YYYY-MM-DD_session.md` | Continuous log of file changes |
| `YYYY-MM-DD_event_NNN.md` | Discrete events (commits, merges) |
| `AGENT_PROTOCOL.md` | Instructions for AI agents |

## What's Logged:
- **File Save** → session.md (path, time)
- **Confirm Group** → event_NNN.md (files, comment)
- **Create Branch** → session.md (🌱 BRANCH CREATE)
- **Switch Branch** → session.md (↔️ BRANCH SWITCH)
- **Delete Branch** → session.md (🗑️ BRANCH DELETE)
- **Merge** → event_NNN.md (source, target, conflicts)
- **Terminal Commands** → session.md (💻 TERMINAL ✅/❌)
- **Stash/Tags/Cherry-pick** → session.md
- **GitHub Sync** → session.md (☁️ GITHUB)

## Session Tracking:
| Event | Description |
|-------|-------------|
| **Session Start** | First file change (auto-starts) |
| **Session End** | On Confirm/Commit (auto-ends with stats) |

## Intent Sniffer:
- **Automatically extracts** last message from VS Code
- **Cross-platform**: Windows, macOS, Linux
- **Sources**: Chat history, Terminal history, Interactive
- Written to Session Statistics on Confirm

## For AI Agents:
Read `.localhub/DOCS.md` to understand LocalHub.
Read `.localhub/agent/*.md` to understand project history.

---

# 🗑️ Trash Bin (Deleted Files)

Deleted files are NOT lost! LocalHub keeps their history.

## Access Trash:
- Click 🗑️ icon in **File History** panel
- Or `Ctrl+Shift+P` → "LocalHub: Show Deleted Files"

## Features:
| Feature | Description |
|---------|-------------|
| **View Deleted** | See all deleted files |
| **Restore** | Restore any file from trash |
| **Empty Trash** | Permanently delete all history |

## Commands:
- `LocalHub: Show Deleted Files (Trash)` - View deleted files
- `LocalHub: Empty Trash` - Clear all deleted file history

## API:
- `GET /files/deleted` - List deleted files
- `DELETE /files/deleted` - Empty trash

---

# 🚫 .localhubignore

Ignore files from tracking (like .gitignore for LocalHub).

## Create Ignore File:
- Click 👁️‍🗨️ (eye-closed) button in **Tracked Files** panel
- Or `Ctrl+Shift+P` → "LocalHub: Create .localhubignore"

## Templates:
| Template | Includes |
|----------|----------|
| **All Languages** | Python, Node, Java, C#, Go, Rust, Ruby, PHP |
| **Python** | `__pycache__`, `.pyc`, `venv`, `.pytest_cache` |
| **Node.js** | `node_modules`, `dist`, `.next`, `yarn.lock` |
| **Java/Kotlin** | `target/`, `.class`, `.jar`, `.gradle/` |
| **C#/.NET** | `bin/`, `obj/`, `.dll`, `.vs/` |
| **Go** | `vendor/`, `go.sum` |
| **Rust** | `target/`, `Cargo.lock` |
| **Ruby** | `vendor/`, `.bundle/`, `Gemfile.lock` |
| **PHP** | `vendor/`, `composer.lock` |

## Add File to Ignore:
- Right-click file in **Pending Changes** → "Add to .localhubignore"

---

# 💻 CLI Commands

Run from terminal (requires extension running):

```bash
lh init           # Initialize project - snapshot ALL files
lh status         # Server status + cloud sync
lh branch         # List all branches
lh branch <name>  # Create new branch
lh branch trash   # Show deleted branches
lh branch restore <name>  # Restore deleted branch
lh branch empty-trash     # Empty branch trash
lh group          # List confirmed TM groups
lh group -d <n>   # Delete TM group (keep snapshots)
lh group -d <n> --with-snapshots  # Delete TM group + snapshots
lh group trash    # Show deleted TM groups
lh group restore <n>  # Restore deleted TM group
lh group restore --all  # Restore all deleted TM groups
lh group empty-trash    # Empty TM group trash
lh group checkout <n>   # Checkout workspace to TM Group
lh group status         # Show current TM group checkout status
lh group head           # Return workspace to active branch head
lh switch <name>  # Switch to branch (by name or ID)
lh push           # Push to GitHub (needs GITHUB_TOKEN)
lh github         # Show GitHub setup instructions

# Trash commands
lh trash          # Show deleted files (Trash)
lh restore <file> # Restore deleted file by name
lh restore --all  # Restore ALL deleted files
lh empty-trash    # Empty trash (delete history permanently)

# Stash commands  
lh stash          # Stash pending changes
lh stash pop      # Apply and remove stash
lh stash list     # List stashes
lh stash drop <n> # Delete stash N

# Tags
lh tag <name>     # Create tag (e.g. lh tag v1.0)
lh tag            # List all tags
lh tag -d <name>  # Delete tag

# Cherry-pick
lh cherry-pick <branch> <file>  # Copy file from another branch

# Plugins
lh plugin                    # List installed plugins
lh plugin install <path>     # Install from folder
lh plugin remove <name>      # Remove plugin
lh plugin enable <name>      # Enable
lh plugin disable <name>     # Disable

lh help           # Show all commands
```

## Environment Variables (for push):
```powershell
$env:GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
$env:GITHUB_OWNER="your-username"
$env:GITHUB_REPO="your-repo"
```

---

# 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server status |
| `/init` | POST | Initialize project |
| `/snapshot` | POST | Create snapshot |
| `/files` | GET | List tracked files |
| `/history` | GET | File version history |
| `/restore` | POST | Restore file version |
| `/diff` | GET | Compare versions |
| `/branches` | GET/POST | List/create branches |
| `/branches/{id}/switch` | POST | Switch branch |
| `/branches/{id}/merge` | POST | Merge branches |
| `/groups/pending` | GET | Pending changes |
| `/groups/confirm` | POST | Create commit |
| `/backup/info` | GET | Backup info |
| `/search` | GET | Search in history |
| `/plugins` | GET | List plugins |
| `/plugins/install` | POST | Install plugin |
| `/plugins/{name}` | DELETE | Remove plugin |
| `/plugins/{name}/enable` | POST | Enable plugin |
| `/plugins/{name}/disable` | POST | Disable plugin |
| `/plugins/{name}/config` | GET/PUT | Plugin config |
| `/plugins/{name}/ui` | GET | Plugin UI HTML |
| `/agent/session` | GET | Session statistics |
| `/agent/session/start` | POST | Start new session |
| `/agent/session/end` | POST | End session |
| `/agent/terminal` | POST | Log terminal command |

---

# 🚫 Excluded Files

These files/folders are never tracked:

- `__pycache__/`
- `*.pyc`
- `node_modules/`
- `.git/`
- `.localhub/`
- `venv/`, `.venv/`, `.env`

---

---

# File Relationships (Graph)

Interactive graph showing which files change together — discover hidden dependencies in your codebase.

## How It Works:
- Every time you **confirm a group** (OK in Pending Changes), LocalHub records which files were committed together
- Files edited within the same **5-minute window** are also linked (temporal proximity)
- The graph visualizes these co-change patterns using Cytoscape.js

## Visual Elements:
| Element | Meaning |
|---------|---------|
| **Circle (node)** | A tracked file |
| **Green solid line** | Files from the same confirmed group |
| **Orange dashed line** | Files edited close in time (temporal proximity) |
| **Node size** | More edits = bigger circle |
| **Line thickness** | More co-changes = thicker line |

## Toolbar Controls:
| Control | Description |
|---------|-------------|
| **Layout** | Force (physics) / Circle / Grid / Tree |
| **Period** | Analyze last 7d / 30d / 90d / 1y |
| **Refresh** | Reload data from server |

## Interactions:
- **Click node** — shows details panel with frequent co-changes
- **Double-click node** — opens the file in editor
- **Change period** — automatically reloads graph

## Auto-Update:
- Graph refreshes automatically when you confirm a group

## Commands:
- Focus panel: click "Relationships" in sidebar
- `LocalHub: Refresh Graph` — reload graph data

## API:
```
GET /graph/relationships?session=vscode&days=30&min_cochanges=2
GET /graph/neighbors?path=src/file.ts&session=vscode&min_cochanges=2
```

---

# Nexus Vision 3D (Inside 3D Grid)

`3D Grid` now has two modes instead of one flat visual mode:

- **Classic** - the original cosmic playground: shape presets, palette switcher, physics, speed, zoom, explode and implode.
- **Nexus 3D** - the same scene, but with LocalHub state, live code signals, and a right-side inspection panel.

## What Nexus 3D Uses

- **Tracked files** - current LocalHub file universe
- **Pending Changes** - files waiting for confirm
- **Starred history** - protected anchor versions
- **Activity heatmap** - how hot a file is across recent history
- **Relationship graph** - co-change links between files
- **Live symbols** - `DocumentSymbolProvider`
- **Live diagnostics** - VS Code / LSP diagnostics
- **Cached symbol fallback** - latest snapshot metadata if the live provider is silent

## Visual States

| Signal | Meaning |
|--------|---------|
| **Blue base / outline** | File is currently in Pending Changes |
| **Gold halo** | File has a starred, protected version in LocalHub history |
| **Yellow -> orange -> red heat** | File changes frequently in recent history |
| **Red aura** | Live diagnostics contain at least one error |
| **Warning badge in panel** | Warnings exist, but no separate scene aura is used |

## Right Panel

When you click a sphere in `Nexus 3D`, the scene keeps the same layout shell, but the panel switches from pure decoration to file inspection:

- full file path
- LocalHub status
- graph weight / connections
- last LocalHub change
- current scan state
- symbols: classes, functions, methods
- issues: errors and warnings
- `Open File`
- `Rescan`
- jump to exact issue line

## Interaction Rhythm

- **Mode switch** - use the `Classic / Nexus 3D` block at the top of `3D Grid`
- **Click sphere** - highlight the node and its links, open the right panel
- **Hover sphere** - raises the file in the lazy scan queue
- **Rescan** - asks for fresh symbols and diagnostics
- **Open File / Issue click** - jumps back into the text editor

## Important Boundary

`Nexus 3D` does **not** replace the old `3D Grid`.
It lives **inside** it as a second mode.
`Classic` stays decorative. `Nexus 3D` stays semantic.

---

# Symbol Timeline

Track the history of a specific function, class, or method across all snapshots.

## How to Use:
1. Open a file in the editor
2. `Ctrl+Shift+P` → `LocalHub: Symbol Timeline`
3. Select a function/class from the list
4. View version history for that symbol

## Supported Symbol Types:
| Type | Icon |
|------|------|
| Function | $(symbol-method) |
| Class | $(symbol-class) |
| Method | $(symbol-method) |
| Constructor | $(symbol-field) |
| Interface | $(symbol-field) |
| Enum | $(symbol-field) |

## Requirements:
- A **language server** must be active for the file type:
  - **Python**: Pylance extension (`ms-python.vscode-pylance`)
  - **TypeScript/JavaScript**: Built-in (no extra install needed)
  - **Other languages**: Install the relevant language extension

## What You See:
Each timeline entry shows:
- **Version number** (v1, v2, ...)
- **Timestamp** (when snapshot was taken)
- **Reason** (save, tab switch, external change, etc.)
- **Line range** (which lines the symbol occupied)

## API:
```
GET /symbols/timeline?path=src/file.ts&symbol_name=myFunction&session=vscode
```

---

# Global Watcher

Multi-project file monitoring daemon that tracks changes across all your projects.

## Features:
| Feature | Description |
|---------|-------------|
| **Watch Folders** | Add any folder to monitor |
| **Tracked Files** | All files with context menu |
| **File History** | Version history per file with Diff/View/Restore |
| **Exclude Patterns** | 153+ default patterns |
| **Purge Ignored** | Mass cleanup of ignored files |
| **Cloud Sync** | Google Drive, OneDrive, Dropbox, Yandex Disk |
| **Backup** | Backup database and blobs |
| **Export** | Export project with full history to ZIP |

## Storage:
- Config: `~/.localhub_global/config.json`
- Database: `~/.localhub_global/gw_storage.db`
- Blobs: `~/.localhub_global/blobs/`
- Server port: 19900+

## Commands:
- `LocalHub: Open Global Watcher` — open the full panel
- `LocalHub: Start Global Watcher` — start the daemon
- `LocalHub: Stop Global Watcher` — stop the daemon

---

*LocalHub v2.7 | Documentation*
