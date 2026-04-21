# LocalHub Plugin Development Guide

> Complete reference for building LocalHub plugins. Version 3.0

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Plugin Structure](#plugin-structure)
3. [Manifest Reference](#manifest-reference)
4. [Plugin Class (main.py)](#plugin-class)
5. [Events Reference](#events-reference)
6. [Permissions](#permissions)
7. [Config Schema](#config-schema)
8. [Plugin UI](#plugin-ui)
9. [API Reference](#api-reference)
   - [Health & Status](#health--status)
   - [Snapshots & History](#snapshots--history)
   - [Files & Search](#files--search)
   - [Content & Diffs](#content--diffs)
   - [Groups (Time Machine)](#groups-time-machine)
   - [Branches](#branches)
   - [Tags](#tags)
   - [Stash](#stash)
   - [Blame & Bisect](#blame--bisect)
   - [Tree Diff](#tree-diff)
   - [Time Travel & Replay](#time-travel--replay)
   - [Features & Analytics](#features--analytics)
   - [Work Tracking](#work-tracking)
   - [Ignore Patterns](#ignore-patterns)
   - [Backup & Restore](#backup--restore)
   - [Import / Export](#import--export)
   - [GitHub & Cloud Sync](#github--cloud-sync)
   - [Global Watcher](#global-watcher)
   - [Plugin Management](#plugin-management)
10. [VS Code Commands](#vs-code-commands)
11. [Data Storage](#data-storage)
12. [Marketplace](#marketplace)
13. [Examples](#examples)
14. [Debugging](#debugging)
15. [Best Practices](#best-practices)

---

## Quick Start

### 1. Create plugin folder

```
my-plugin/
├── manifest.json    # Required — plugin metadata
├── main.py          # Required — plugin code
├── ui.html          # Optional — panel UI (static)
└── README.md        # Recommended — description
```

### 2. Write manifest.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What my plugin does",
  "author": "Your Name",
  "entrypoint": "main.py",
  "permissions": [
    "read:history",
    "subscribe:events"
  ],
  "events": [
    "file:save",
    "group:confirm"
  ],
  "config_schema": {
    "option_name": {
      "type": "string",
      "default": "value",
      "description": "Option description"
    }
  }
}
```

### 3. Write main.py

```python
class Plugin:
    def __init__(self, config: dict = None):
        self.config = config or {}
        # config["_server_url"] — LocalHub server URL
        # config["_project_root"] — current project path
        # config["_global"] — global settings dict
        print(f"[MyPlugin] Initialized")

    def on_file_save(self, data: dict):
        """Called when file is saved"""
        path = data.get("path")
        version = data.get("version")
        print(f"[MyPlugin] File saved: {path} v{version}")

    def on_group_confirm(self, data: dict):
        """Called when TM group is confirmed"""
        name = data.get("name")
        files = data.get("files", [])
        print(f"[MyPlugin] Group confirmed: {name} ({len(files)} files)")

    def render_ui(self) -> str:
        """Return HTML for plugin panel (dynamic)"""
        return "<div>My Plugin UI</div>"
```

### 4. Install

Copy the folder to your project's `.localhub/plugins/` directory:

```
your-project/
└── .localhub/
    └── plugins/
        └── my-plugin/
            ├── manifest.json
            └── main.py
```

Reload the IDE — the plugin loads automatically.

---

## Plugin Structure

```
my-plugin/
├── manifest.json       # Required: metadata, permissions, events, config
├── main.py             # Required: Plugin class with event handlers
├── ui.html             # Optional: static HTML shown in plugin panel
├── README.md           # Optional: description for marketplace
└── (any other files)   # Your plugin can include any additional files
```

Plugins are stored per-project in `.localhub/plugins/`.
Plugin data (databases, caches) should go in `.localhub/plugins/data/<plugin-name>/`.
Plugin config is stored automatically in `.localhub/plugins/config/<plugin-name>.json`.

---

## Manifest Reference

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Short description of what your plugin does",
  "author": "Author Name",
  "entrypoint": "main.py",
  "permissions": ["read:history", "subscribe:events"],
  "events": ["file:save", "group:confirm"],
  "config_schema": {}
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique plugin identifier (lowercase, hyphens OK) |
| `version` | string | Yes | Semver version (e.g. `1.0.0`) |
| `description` | string | Yes | What the plugin does (shown in UI) |
| `author` | string | Yes | Author name |
| `entrypoint` | string | Yes | Python file to load (usually `main.py`) |
| `permissions` | string[] | Yes | List of permissions the plugin needs |
| `events` | string[] | Yes | Events the plugin subscribes to |
| `config_schema` | object | No | User-configurable settings (see [Config Schema](#config-schema)) |

---

## Plugin Class

Your `main.py` must export a `Plugin` class:

```python
class Plugin:
    def __init__(self, config: dict = None):
        self.config = config or {}

        # Available in config automatically:
        self.server_url = self.config.get("_server_url", "http://127.0.0.1:19876")
        self.project_root = self.config.get("_project_root", "")
        self.global_settings = self.config.get("_global", {})

        # Reference to PluginManager (set automatically after init)
        # self._plugin_manager — available after loading
```

### Special config keys injected by LocalHub

| Key | Type | Description |
|-----|------|-------------|
| `_server_url` | string | LocalHub server URL (e.g. `http://127.0.0.1:19876`) |
| `_project_root` | string | Absolute path to the current project |
| `_global` | dict | Global IDE settings (GitHub config, marketplace URL, etc.) |

### Accessing the API from Python

```python
import urllib.request
import json

class Plugin:
    def __init__(self, config: dict = None):
        self.config = config or {}
        self.server = self.config.get("_server_url", "http://127.0.0.1:19876")
        self.project = self.config.get("_project_root", "")

    def api(self, endpoint, method="GET", data=None):
        """Call any LocalHub API endpoint"""
        url = f"{self.server}{endpoint}"
        req = urllib.request.Request(url)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Project-Root", self.project)

        if data:
            req.data = json.dumps(data).encode()
            req.method = method

        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
```

> **Important**: Always include `X-Project-Root` header — the server uses it to identify which project to operate on.

---

## Events Reference

Plugins receive events by defining handler methods. Name your methods `on_{event}` with `:` replaced by `_`.

### Available Events

| Event | Trigger | Handler Method |
|-------|---------|----------------|
| `file:save` | File snapshot created | `on_file_save(data)` |
| `file:restore` | File restored from history | `on_file_restore(data)` |
| `group:confirm` | TM group confirmed (OK) | `on_group_confirm(data)` |
| `branch:create` | New branch created | `on_branch_create(data)` |
| `branch:switch` | Switched to another branch | `on_branch_switch(data)` |
| `branch:delete` | Branch deleted | `on_branch_delete(data)` |
| `branch:merge` | Branches merged | `on_branch_merge(data)` |

### Event Data Payloads

**`file:save`**
```json
{
  "path": "src/app.py",
  "version": 5,
  "reason": "auto-save"
}
```

**`file:restore`**
```json
{
  "path": "src/app.py",
  "version": 3
}
```

**`group:confirm`**
```json
{
  "name": "Added login feature",
  "group_id": 42,
  "files": ["src/auth.py", "src/login.html"],
  "file_count": 2
}
```

**`branch:create`**
```json
{
  "name": "feature/auth",
  "branch_id": 7,
  "files_count": 15
}
```

**`branch:switch`**
```json
{
  "from_branch": "main",
  "to_branch": "feature/auth",
  "branch_id": 7
}
```

**`branch:delete`**
```json
{
  "name": "feature/old",
  "branch_id": 3
}
```

**`branch:merge`**
```json
{
  "source": "feature/auth",
  "target": "main",
  "merged_files": 5,
  "force": false
}
```

### Example: Handling multiple events

```python
class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        self.save_count = 0
        self.group_count = 0

    def on_file_save(self, data):
        self.save_count += 1
        print(f"[Stats] Total saves: {self.save_count}")

    def on_group_confirm(self, data):
        self.group_count += 1
        name = data.get("name", "Unnamed")
        files = data.get("files", [])
        print(f"[Stats] Group #{self.group_count}: {name} ({len(files)} files)")

    def on_branch_merge(self, data):
        source = data.get("source")
        target = data.get("target")
        print(f"[Stats] Merged {source} -> {target}")
```

---

## Permissions

Declare the permissions your plugin needs in `manifest.json`:

| Permission | Description |
|------------|-------------|
| `read:history` | Read file history, snapshots, versions |
| `read:branches` | Read branch information |
| `read:groups` | Read TM groups/commits |
| `read:pending` | Read pending (uncommitted) changes |
| `read:trash` | Read deleted files (trash) |
| `read:config` | Read project settings |
| `write:snapshot` | Create file snapshots |
| `write:branches` | Create/delete branches |
| `write:groups` | Confirm/delete groups |
| `subscribe:events` | Receive real-time events |
| `execute:git` | Run git commands |
| `execute:commands` | Execute CLI commands |
| `storage:local` | Store data locally in plugin data folder |

---

## Config Schema

Define user-configurable settings in `manifest.json`. These appear in the Settings panel > Plugins tab.

### Supported types

```json
{
  "config_schema": {
    "enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable the feature"
    },
    "threshold": {
      "type": "number",
      "default": 10,
      "description": "Number of changes before auto-commit"
    },
    "prefix": {
      "type": "string",
      "default": "[Auto]",
      "description": "Prefix for commit messages"
    }
  }
}
```

| Type | UI Control | Example |
|------|-----------|---------|
| `boolean` | Toggle switch | `true` / `false` |
| `number` | Number input | `10`, `30`, `100` |
| `string` | Text input | `"[Auto]"`, `"main"` |

### Accessing config in code

```python
class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        # User settings from config_schema
        self.threshold = self.config.get("threshold", 10)
        self.prefix = self.config.get("prefix", "[Auto]")
        self.enabled = self.config.get("enabled", True)
```

---

## Plugin UI

Plugins can provide a visual panel in two ways:

### Option 1: Static HTML (ui.html)

Create a `ui.html` file in your plugin folder:

```html
<div style="padding: 20px; font-family: var(--vscode-font-family); color: var(--vscode-foreground);">
    <h2>My Plugin Dashboard</h2>
    <div id="status">Loading...</div>

    <script>
        // Access LocalHub API
        const SERVER = 'http://127.0.0.1:19876';
        const PROJECT = ''; // Set your project root

        async function loadData() {
            const resp = await fetch(`${SERVER}/stats`, {
                headers: { 'X-Project-Root': PROJECT }
            });
            const data = await resp.json();
            document.getElementById('status').textContent = JSON.stringify(data, null, 2);
        }

        loadData();
    </script>
</div>
```

### Option 2: Dynamic UI (render_ui method)

Return HTML from `render_ui()` in your Plugin class:

```python
class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        self.events_log = []

    def on_file_save(self, data):
        self.events_log.append(f"Saved: {data.get('path')}")

    def render_ui(self) -> str:
        rows = "".join(f"<li>{e}</li>" for e in self.events_log[-20:])
        return f"""
        <div style="padding: 20px;">
            <h2>Event Log</h2>
            <ul>{rows or '<li>No events yet</li>'}</ul>
        </div>
        """
```

### VS Code CSS Variables

Use these for consistent theming:

| Variable | Description |
|----------|-------------|
| `--vscode-foreground` | Text color |
| `--vscode-editor-background` | Background color |
| `--vscode-button-background` | Button background |
| `--vscode-button-foreground` | Button text color |
| `--vscode-input-background` | Input field background |
| `--vscode-input-foreground` | Input field text |
| `--vscode-font-family` | Editor font |
| `--vscode-font-size` | Editor font size |

---

## API Reference

All endpoints accept `X-Project-Root` header to identify the project.
Base URL: `http://127.0.0.1:{PORT}` (default port 19876, or use `config["_server_url"]`).

### Helper function for plugins

```python
import urllib.request, json

def api(server, project, endpoint, method="GET", data=None):
    url = f"{server}{endpoint}"
    req = urllib.request.Request(url)
    req.add_header("Content-Type", "application/json")
    req.add_header("X-Project-Root", project)
    if data:
        req.data = json.dumps(data).encode()
        req.method = method
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)
```

---

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/status` | Detailed server status (version, uptime, project info) |

```python
# Check server health
health = self.api("/health")
# => {"status": "ok", "version": "3.0.1"}

# Get detailed status
status = self.api("/status")
# => {"project": "...", "branch": "main", "files_tracked": 42, ...}
```

---

### Snapshots & History

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/snapshot` | Create snapshot for a single file |
| POST | `/snapshot/batch` | Create snapshots for multiple files |
| POST | `/init` | Initialize project (snapshot ALL files) |
| GET | `/history` | Get file change history |
| GET | `/history/detailed` | Get detailed file history with content |
| POST | `/star/toggle` | Toggle star on a snapshot |
| POST | `/star` | Star a snapshot |
| POST | `/unstar` | Unstar a snapshot |
| GET | `/starred` | Get all starred snapshots |
| POST | `/snapshot/reason` | Update snapshot description |
| DELETE | `/snapshot` | Delete specific snapshot |
| DELETE | `/file-history` | Delete all history for a file |
| GET | `/stats` | Get session statistics |
| POST | `/retention` | Run retention cleanup policy |

```python
# Create snapshot
self.api("/snapshot", "POST", {
    "path": "src/app.py",
    "reason": "Before refactoring"
})

# Get history for a file (query param)
history = self.api("/history?path=src/app.py")

# Get detailed history
detailed = self.api("/history/detailed?path=src/app.py")

# Toggle star
self.api("/star/toggle", "POST", {"path": "src/app.py", "version": 5})

# Delete specific version
self.api("/snapshot", "DELETE", {"path": "src/app.py", "version": 3})

# Get stats
stats = self.api("/stats")
# => {"total_files": 42, "total_snapshots": 256, "session_saves": 12, ...}
```

---

### Files & Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List all tracked files with history |
| GET | `/files/deleted` | Get deleted files (trash) |
| DELETE | `/files/deleted` | Empty trash (delete all history of deleted files) |
| POST | `/files/deleted/restore-all` | Restore all deleted files |
| GET | `/search` | Search file history |

```python
# List all tracked files
files = self.api("/files")

# Get deleted files (trash)
trash = self.api("/files/deleted")

# Search history
results = self.api("/search?q=login&path=src/")
```

---

### Content & Diffs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/content` | Get file content at specific version |
| GET | `/content/branch` | Get file content from a branch |
| GET | `/diff` | Get diff between two versions |
| GET | `/diff/context` | Get diff with context lines |
| GET | `/hunks` | Get change hunks (chunks) |
| POST | `/restore` | Restore file from snapshot |
| POST | `/restore/partial` | Restore only specific lines |

```python
# Get file content at version 3
content = self.api("/content?path=src/app.py&version=3")

# Get diff between versions
diff = self.api("/diff?path=src/app.py&v1=3&v2=5")

# Get diff with context
diff = self.api("/diff/context?path=src/app.py&v1=3&v2=5&context=3")

# Get hunks
hunks = self.api("/hunks?path=src/app.py&version=5")

# Restore file to version 3
self.api("/restore", "POST", {"path": "src/app.py", "version": 3})

# Partial restore (specific lines)
self.api("/restore/partial", "POST", {
    "path": "src/app.py",
    "version": 3,
    "lines": [10, 11, 12, 13]
})
```

---

### Groups (Time Machine)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups/pending` | Get pending (uncommitted) changes |
| POST | `/groups/confirm` | Confirm pending changes into a TM group |
| GET | `/groups` | List all TM groups |
| GET | `/groups/{group_id}/files` | Get files in a specific group |
| GET | `/groups/{group_id}/flow` | Get change flow within group |
| DELETE | `/groups/{group_id}` | Delete a group |
| POST | `/groups/{group_id}/remove-file` | Remove file from group |

```python
# Get pending changes
pending = self.api("/groups/pending")

# Confirm group (create TM commit)
result = self.api("/groups/confirm", "POST", {
    "name": "Added login feature"
})
# => {"ok": true, "group_id": 42}

# List all groups
groups = self.api("/groups")

# Get files in group
files = self.api("/groups/42/files")

# Delete group
self.api("/groups/42", "DELETE")
```

---

### Branches

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/branches` | List all branches |
| POST | `/branches` | Create a new branch |
| POST | `/branches/{id}/switch` | Switch to branch |
| DELETE | `/branches/{id}` | Delete branch |
| GET | `/branches/{id}/conflicts` | Check merge conflicts |
| GET | `/branches/{id}/diff` | Get branch diff |
| POST | `/branches/{id}/merge` | Merge branch |
| POST | `/branches/{id}/selective-merge` | Merge specific files only |
| POST | `/branches/{id}/merge/smart` | Smart merge |
| POST | `/branches/{id}/export` | Export branch to ZIP |

```python
# List branches
branches = self.api("/branches")

# Create branch
self.api("/branches", "POST", {"name": "feature/auth"})

# Switch branch
self.api("/branches/7/switch", "POST")

# Check conflicts before merge
conflicts = self.api("/branches/7/conflicts")

# Merge branch
self.api("/branches/7/merge", "POST", {"force": False})

# Export branch as ZIP
self.api("/branches/7/export", "POST")
```

---

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tags` | Create a tag |
| GET | `/tags` | List all tags |
| DELETE | `/tags/{tag_name}` | Delete a tag |
| POST | `/tags/{tag_name}/checkout` | Checkout a tag |
| GET | `/tags/definitions` | Get tag definitions |
| GET | `/tags/all` | Get all unique tags across groups |

#### Smart Tags (Auto-tagging)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups/{id}/analyze-tags` | Analyze and suggest tags for a group |
| POST | `/groups/{id}/apply-tags` | Apply tags to a group |
| POST | `/groups/{id}/set-tags` | Set tags on a group |
| GET | `/groups/with-tags` | Get groups with their tags |
| POST | `/groups/{id}/confirm-smart` | Confirm group with smart auto-tagging |
| POST | `/tags/retag-all` | Re-analyze and tag all groups |

```python
# Create a tag
self.api("/tags", "POST", {"name": "v1.0.0"})

# List tags
tags = self.api("/tags")

# Analyze tags for group
suggestions = self.api("/groups/42/analyze-tags")

# Apply suggested tags
self.api("/groups/42/apply-tags", "POST")
```

---

### Stash

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/stash` | Stash current changes |
| POST | `/stash/pop` | Pop stashed changes |
| GET | `/stash` | List all stashes |
| DELETE | `/stash/{stash_id}` | Delete a stash entry |

```python
# Stash current changes
self.api("/stash", "POST", {"message": "WIP: login form"})

# List stashes
stashes = self.api("/stash")

# Pop latest stash
self.api("/stash/pop", "POST")
```

---

### Blame & Bisect

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blame` | Get blame info for file (who changed each line) |
| GET | `/blame/line` | Get blame for a specific line |
| POST | `/bisect/start` | Start bisect session (binary search for bugs) |
| POST | `/bisect/good` | Mark current version as good |
| POST | `/bisect/bad` | Mark current version as bad |
| POST | `/bisect/skip` | Skip current version |
| POST | `/bisect/reset` | Reset/cancel bisect session |
| GET | `/bisect/status` | Get bisect status |

```python
# Blame file
blame = self.api("/blame?path=src/app.py")

# Start bisect
self.api("/bisect/start", "POST", {
    "path": "src/app.py",
    "good_version": 1,
    "bad_version": 20
})

# Mark versions
self.api("/bisect/good", "POST")
self.api("/bisect/bad", "POST")

# Get bisect status
status = self.api("/bisect/status")
```

---

### Tree Diff

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/file/tree-diff` | Get file version tree diff (all versions) |
| GET | `/file/compare` | Compare two file versions |
| GET | `/pending/tree-diff` | Get pending changes tree diff |
| GET | `/pending/file-tree-diff` | Get pending file tree diff |
| GET | `/groups/{id}/tree-diff` | Get group tree diff |
| GET | `/groups/{id}/file-tree-diff` | Get group file tree diff |

```python
# Get tree diff for a file (all versions with diffs)
tree_diff = self.api("/file/tree-diff?path=src/app.py&from_version=1&to_version=10")

# Compare two versions
compare = self.api("/file/compare?path=src/app.py&v1=3&v2=5")

# Get group tree diff
group_diff = self.api("/groups/42/tree-diff")
```

---

### Time Travel & Replay

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/time-machine/timeline` | Get timeline for time travel |
| GET | `/time-machine/state` | Get project state at a specific time |
| GET | `/time-machine/file` | Get file at a specific time |
| GET | `/time-machine/compare` | Compare states at different times |
| GET | `/replay/session` | Get session replay data |
| GET | `/replay/file` | Get file replay data |
| GET | `/replay/typing` | Get typing replay data |
| GET | `/branches/tree` | Get branch tree (visualization) |
| GET | `/branches/{id}/history` | Get branch history |
| GET | `/branches/diff` | Get diff between two branches |
| GET | `/branches/merge-preview` | Preview merge result |

```python
# Get timeline
timeline = self.api("/time-machine/timeline")

# Get project state at a specific time
state = self.api("/time-machine/state?timestamp=1700000000")

# Get file at a specific time
file_state = self.api("/time-machine/file?path=src/app.py&timestamp=1700000000")

# Replay file changes
replay = self.api("/replay/file?path=src/app.py")
```

---

### Features & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/features/predictions` | Get predictive suggestions (what you'll likely edit next) |
| GET | `/features/timeline` | Get feature timeline |
| GET | `/features/heatmap` | Get activity heatmap |
| GET | `/features/refactoring` | Get refactoring hints |
| GET | `/features/velocity` | Get change velocity metrics |
| GET | `/features/dependencies` | Get dependency analysis |
| GET | `/features/clusters` | Get smart clusters (related files) |
| GET | `/features/analytics` | Get analytics dashboard data |
| GET | `/v3/features` | List all available v3 features |

```python
# Get activity heatmap
heatmap = self.api("/features/heatmap")

# Get velocity metrics
velocity = self.api("/features/velocity")

# Get predictions
predictions = self.api("/features/predictions")

# Get smart clusters
clusters = self.api("/features/clusters")

# Get dependency analysis
deps = self.api("/features/dependencies")
```

---

### Graph & Symbol Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/graph/relationships` | Get code relationships between files |
| GET | `/graph/neighbors` | Get neighboring/related files |
| GET | `/graph/clusters` | Get code clusters |
| GET | `/symbols/timeline` | Get symbol change timeline |

```python
# Get relationships
rels = self.api("/graph/relationships")

# Get neighbors of a file
neighbors = self.api("/graph/neighbors?path=src/app.py")
```

---

### Extended Log

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/log` | Get log with filters |
| GET | `/log/search` | Search log entries |
| GET | `/log/diff-branches` | Get diff between branches in log format |
| GET | `/log/activity` | Get activity log |

```python
# Get filtered log
log = self.api("/log?limit=50&branch=main")

# Search log
results = self.api("/log/search?q=login")

# Activity log
activity = self.api("/log/activity")
```

---

### Work Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/work/start` | Start a work session |
| POST | `/work/end/{session_id}` | End a work session |
| GET | `/work/stats` | Get work statistics |
| GET | `/work/history` | Get work session history |
| GET | `/work/daily` | Get daily work report |
| GET | `/work/file-stats` | Get per-file work statistics |
| GET | `/work/audit` | Get full audit report |
| POST | `/work/report` | Generate work report |
| POST | `/work/report/detailed` | Generate detailed file report |
| GET | `/work/report/preview` | Preview detailed report |
| GET | `/agent/session` | Get agent session stats |
| POST | `/agent/session/start` | Start agent session |
| POST | `/agent/session/end` | End agent session |
| POST | `/agent/terminal` | Log terminal command |

```python
# Start work session
session = self.api("/work/start", "POST", {"name": "Feature development"})

# Get work stats
stats = self.api("/work/stats")

# Get daily report
daily = self.api("/work/daily")

# Get audit report
audit = self.api("/work/audit")

# End work session
self.api(f"/work/end/{session_id}", "POST")
```

---

### Ignore Patterns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ignore` | Get current .localhubignore patterns |
| POST | `/ignore` | Set .localhubignore patterns |
| POST | `/ignore/add` | Add a single ignore pattern |
| DELETE | `/ignore` | Remove an ignore pattern |

```python
# Get ignore patterns
patterns = self.api("/ignore")

# Add pattern
self.api("/ignore/add", "POST", {"pattern": "*.log"})
```

---

### Backup & Restore

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/backup/projects` | List backed up projects |
| GET | `/backup/info/{project}` | Get backup info for a project |
| POST | `/backup/restore` | Restore from backup |

```python
# List backups
backups = self.api("/backup/projects")

# Restore
self.api("/backup/restore", "POST", {"project": "my-project", "timestamp": 1700000000})
```

---

### Import / Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/branches/{id}/export` | Export branch to ZIP |
| POST | `/import/zip` | Import from ZIP file |
| POST | `/import/validate` | Validate a ZIP before import |
| POST | `/branches/import` | Import branch |

```python
# Export branch
self.api("/branches/5/export", "POST")

# Validate ZIP
self.api("/import/validate", "POST", {"path": "/tmp/export.zip"})

# Import from ZIP
self.api("/import/zip", "POST", {"path": "/tmp/export.zip"})
```

---

### GitHub & Cloud Sync

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/github/config` | Get GitHub configuration |
| POST | `/github/config` | Set GitHub configuration |
| GET | `/github/branches` | List branches from GitHub remote |
| POST | `/cloud/github/sync` | Sync to GitHub |
| GET | `/cloud/github/result` | Get sync result |
| GET | `/cloud/progress` | Get upload progress |
| POST | `/cloud/abort` | Abort current upload |
| POST | `/cloud/mark-synced` | Mark groups as cloud-synced |

```python
# Get GitHub config
config = self.api("/github/config")

# Sync to GitHub
self.api("/cloud/github/sync", "POST", {"branch": "main"})

# Check progress
progress = self.api("/cloud/progress")
```

---

### Global Watcher

Global Watcher monitors files across ALL projects system-wide. It has its own server (port 19900+) and also endpoints proxied through the main server at `/gw/`.

#### Via Main Server (prefix `/gw/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gw/health` | Global Watcher health check |
| GET | `/gw/status` | Global Watcher status |
| POST | `/gw/start` | Start Global Watcher |
| POST | `/gw/stop` | Stop Global Watcher |
| GET | `/gw/config` | Get GW config |
| POST | `/gw/config` | Set GW config |
| POST | `/gw/config/exclude/add` | Add exclude pattern |
| GET | `/gw/paths` | Get watched paths (folders) |
| POST | `/gw/paths/add` | Add a folder to watch |
| DELETE | `/gw/paths` | Remove a watched folder |
| POST | `/gw/scan` | Scan/initialize a folder |
| GET | `/gw/stats` | Get GW statistics |
| POST | `/gw/cleanup` | Cleanup GW storage |
| DELETE | `/gw/file/history` | Delete file history |
| POST | `/gw/cleanup/ignored` | Cleanup files matching ignore patterns |
| GET | `/gw/history` | Get file change history |
| GET | `/gw/content` | Get file content at version |
| POST | `/gw/restore` | Restore file from GW history |
| GET | `/gw/files` | List all GW tracked files |
| GET | `/gw/history/recent` | Get recent changes across all projects |
| GET | `/gw/sync/status` | Get cloud sync status |
| POST | `/gw/sync/now` | Sync now |
| GET | `/gw/sync/config` | Get sync config |
| POST | `/gw/sync/config` | Set sync config |
| GET | `/gw/sync/detect-services` | Detect available cloud services |
| POST | `/gw/backup/run` | Run backup |
| GET | `/gw/backup/status` | Get backup status |
| GET | `/gw/projects` | List all GW projects |
| POST | `/gw/export` | Export GW data |
| POST | `/gw/shutdown` | Shutdown Global Watcher |

#### Standalone GW Server (port 19900+)

Same endpoints without the `/gw/` prefix — just use the GW server URL directly.

```python
# Example: Using GW via main server
gw_status = self.api("/gw/status")

# Get recent changes across all projects
recent = self.api("/gw/history/recent")

# Get GW stats
stats = self.api("/gw/stats")

# Add a folder to watch
self.api("/gw/paths/add", "POST", {"path": "C:/Projects/my-other-project"})

# Get all tracked files
files = self.api("/gw/files")

# Get file history from any project
history = self.api("/gw/history?path=C:/Projects/other/src/main.py")

# Restore from GW history
self.api("/gw/restore", "POST", {"path": "C:/Projects/other/src/main.py", "version": 3})
```

---

### Plugin Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plugins` | List installed plugins |
| POST | `/plugins/install` | Install a plugin |
| DELETE | `/plugins/{name}` | Uninstall plugin |
| POST | `/plugins/{name}/enable` | Enable plugin |
| POST | `/plugins/{name}/disable` | Disable plugin |
| GET | `/plugins/{name}/config` | Get plugin configuration |
| PUT | `/plugins/{name}/config` | Set plugin configuration |
| GET | `/plugins/{name}/ui` | Get plugin UI HTML |
| GET | `/plugins/marketplace` | Search marketplace |
| GET | `/plugins/marketplace/{id}` | Get marketplace plugin details |
| POST | `/plugins/marketplace/install` | Install from marketplace |
| GET | `/plugins/updates` | Check for plugin updates |
| POST | `/plugins/{name}/update` | Update plugin |

---

## VS Code Commands

Plugins can reference these commands that users can trigger from the IDE. These are the commands available in the UI (menus, keyboard shortcuts, command palette).

### Snapshots & History

| Command ID | Name | Shortcut |
|------------|------|----------|
| `localhub.snapshot` | Create Snapshot | `Ctrl+Alt+S` |
| `localhub.showHistory` | Show File History | |
| `localhub.showFileHistory` | Show File History | |
| `localhub.showFileDiff` | Show File Diff | |
| `localhub.showDiff` | Show Diff | |
| `localhub.showTreeDiff` | Show Tree Diff | |
| `localhub.restore` | Restore Version | |
| `localhub.showHunks` | Partial Restore | |
| `localhub.toggleStar` | Toggle Star | |
| `localhub.editReason` | Edit Description | |
| `localhub.showStarred` | Show Starred Versions | |
| `localhub.deleteSnapshot` | Delete Version | |
| `localhub.deleteFileHistory` | Delete All File History | |
| `localhub.compareVersions` | Compare Two Versions | |
| `localhub.refreshHistory` | Refresh History | |
| `localhub.showStats` | Show Statistics | |
| `localhub.showFeatures` | Show All Features | `Ctrl+Alt+H` |

### Files & Trash

| Command ID | Name | Shortcut |
|------------|------|----------|
| `localhub.showTrash` | Show Deleted Files (Trash) | `Ctrl+Alt+T` |
| `localhub.showBranchTrash` | Show Deleted Branches (Branch Trash) | `Ctrl+Alt+Shift+T` |
| `localhub.emptyTrash` | Empty Trash | |
| `localhub.emptyBranchTrash` | Empty Zombie Branch Trash | |
| `localhub.restoreBranch` | Restore Zombie Branch | |
| `localhub.restoreDeletedFile` | Restore Deleted File | |
| `localhub.createIgnore` | Create .localhubignore | |
| `localhub.addToIgnore` | Add to .localhubignore | |
| `localhub.initProject` | Initialize Project | |

### Groups (Time Machine)

| Command ID | Name |
|------------|------|
| `localhub.confirmGroup` | Confirm Changes (OK) |
| `localhub.confirmGroupSmart` | Smart Confirm Group (with auto-tags) |
| `localhub.generateSummary` | AI: Generate Commit Summary |
| `localhub.refreshGroups` | Refresh Groups |
| `localhub.checkoutGroup` | Checkout TM Group |
| `localhub.returnToBranchHead` | Return To Branch Head |
| `localhub.showGroupCheckoutStatus` | Show TM Group Checkout Status |
| `localhub.deleteGroup` | Delete TM Group |
| `localhub.removeFileFromGroup` | Remove from Group |
| `localhub.ignoreFileFromGroup` | Add to Ignore |
| `localhub.showGroupTreeDiff` | Show Group Tree Diff |
| `localhub.showFullGroupTreeDiff` | Show Full Group Tree Diff |
| `localhub.showPendingTreeDiff` | Show Pending Tree Diff |

### Branches

| Command ID | Name | Shortcut |
|------------|------|----------|
| `localhub.createBranch` | Create Branch | `Ctrl+Alt+B` |
| `localhub.switchBranch` | Switch Branch | |
| `localhub.deleteBranch` | Delete Branch | |
| `localhub.mergeBranch` | Merge Branch | |
| `localhub.exportBranch` | Export Branch to ZIP | |
| `localhub.importBranch` | Import Branch from ZIP | |
| `localhub.refreshBranches` | Refresh Branches | |

### Tags & Smart Features

| Command ID | Name |
|------------|------|
| `localhub.analyzeGroupTags` | Analyze Group Tags |
| `localhub.filterByTag` | Search Groups by Tag |
| `localhub.clearTagFilter` | Clear Tag Filter |
| `localhub.retagAllGroups` | Re-tag All Groups |
| `localhub.openFeatures` | Open Smart Features |
| `localhub.openFeature` | Open Specific Feature |

### Analytics & Visualizations

| Command ID | Name |
|------------|------|
| `localhub.feature.predictions` | Predictive Suggestions |
| `localhub.feature.timeline` | Timeline View |
| `localhub.feature.heatmap` | Activity Heatmap |
| `localhub.feature.refactoring` | Refactoring Hints |
| `localhub.feature.velocity` | Change Velocity |
| `localhub.feature.dependencies` | Dependency Overlay |
| `localhub.feature.clusters` | Smart Clusters |
| `localhub.feature.analytics` | Analytics Dashboard |
| `localhub.open3DGrid` | Open 3D Grid Visualization |
| `localhub.openTimeMachine` | Open Time Machine |
| `localhub.openCodeReplay` | Open Code Replay |
| `localhub.openBranchTree` | Open Branch Tree |
| `localhub.openTimeTravel` | Open Time Travel Suite |
| `localhub.showSymbolTimeline` | Show Symbol Timeline |

### Graph & Nexus

| Command ID | Name |
|------------|------|
| `localhub.refreshGraph` | Refresh Graph |
| `localhub.graphFilter` | Filter Graph |
| `localhub.openGraphFullTab` | Open Graph Full Tab |
| `localhub.openNexusFullTab` | Open Nexus Vision |
| `localhub.toggleSidebarView` | Toggle Classic/Nexus View |

### Blame & Bisect

| Command ID | Name |
|------------|------|
| `localhub.blame` | Blame File |
| `localhub.bisectStart` | Bisect: Start Bug Search |
| `localhub.bisectGood` | Bisect: Mark as Good |
| `localhub.bisectBad` | Bisect: Mark as Bad |
| `localhub.bisectReset` | Bisect: Cancel |

### GitHub & Cloud

| Command ID | Name |
|------------|------|
| `localhub.syncToGitHub` | Sync to GitHub |
| `localhub.setupGitHub` | Setup GitHub Integration |
| `localhub.setRemoteRepo` | Set Repo |
| `localhub.cloneFromGitHub` | Clone from GitHub |
| `localhub.setupSSH` | Setup SSH Key |
| `localhub.pushSSH` | Push via SSH/Git |

### Backup & Restore

| Command ID | Name | Shortcut |
|------------|------|----------|
| `localhub.showBackups` | Show Backups | `Ctrl+Alt+R` |
| `localhub.restoreBackup` | Restore from Backup | `Ctrl+Alt+Shift+R` |
| `localhub.restoreProject` | Restore Project from Backup | |
| `localhub.openBackupFolder` | Open Backup Folder | |
| `localhub.cleanupOldVersions` | Cleanup Old Versions | |

### Plugins

| Command ID | Name |
|------------|------|
| `localhub.showPlugins` | Manage Plugins |
| `localhub.installPlugin` | Install Plugin from Folder |
| `localhub.enablePlugin` | Enable Plugin |
| `localhub.disablePlugin` | Disable Plugin |
| `localhub.removePlugin` | Remove Plugin |
| `localhub.refreshPlugins` | Refresh Plugins |
| `localhub.browsePlugins` | Browse Marketplace |
| `localhub.checkPluginUpdates` | Check Plugin Updates |
| `localhub.setMarketplaceUrl` | Set Marketplace URL |

### Global Watcher

| Command ID | Name |
|------------|------|
| `localhub.openGlobalWatcher` | Open Global Watcher Settings |
| `localhub.startGlobalWatcher` | Start Global Watcher Daemon |
| `localhub.stopGlobalWatcher` | Stop Global Watcher Daemon |
| `localhub.gwAddFolder` | Add Watch Folder |
| `localhub.gwRemoveFolder` | Remove Watch Folder |
| `localhub.gwScanFolder` | Initialize/Scan Folder |
| `localhub.gwRefreshFolders` | Refresh Folders |

### LHL Mode & Settings

| Command ID | Name |
|------------|------|
| `localhub.toggleLHL` | Toggle LHL Mode (Auto-Grouping) |
| `localhub.enableLHL` | Enable LHL Mode |
| `localhub.disableLHL` | Disable LHL Mode |
| `localhub.openSettings` | Open Settings |
| `localhub.showDocumentation` | Show Documentation |
| `localhub.showOutput` | Show Server Logs |

---

## Data Storage

### Plugin code
```
.localhub/plugins/<plugin-name>/
├── manifest.json
├── main.py
└── ui.html
```

### Plugin config (managed by LocalHub)
```
.localhub/plugins/config/<plugin-name>.json
```

### Plugin data (for your databases, caches, etc.)
Create your own data directory:
```python
import os

class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        project = self.config.get("_project_root", ".")

        # Your plugin's private data directory
        self.data_dir = os.path.join(project, ".localhub", "plugins", "data", "my-plugin")
        os.makedirs(self.data_dir, exist_ok=True)

        # Store database, cache, logs here
        self.db_path = os.path.join(self.data_dir, "stats.db")
```

---

## Marketplace

### Installing from marketplace

Users can browse and install plugins from the LocalHub Marketplace:
- **IDE**: Sidebar > Plugins > Browse Marketplace
- **API**: `GET /plugins/marketplace?q=search_term`

### Publishing to Marketplace

1. Create account at `marketplace.localhub.dev` (GitHub login)
2. Go to "Submit Plugin"
3. Upload ZIP file containing:
   - `manifest.json` (required)
   - `main.py` (required)
   - `ui.html` (optional)
   - `README.md` (recommended)
4. Wait for admin approval

### Checking for updates

```python
# Check updates via API
updates = self.api("/plugins/updates")
```

---

## Examples

### Example 1: Simple Event Logger

```python
import os, json, time

class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        self.log_file = self.config.get("log_file", "events.log")
        self.prefix = self.config.get("prefix", "[Event]")

    def _log(self, msg):
        ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        line = f"{ts} {self.prefix} {msg}"
        print(line)
        if self.config.get("log_to_file", False):
            project = self.config.get("_project_root", ".")
            data_dir = os.path.join(project, ".localhub", "plugins", "data", "event-logger")
            os.makedirs(data_dir, exist_ok=True)
            with open(os.path.join(data_dir, self.log_file), "a") as f:
                f.write(line + "\n")

    def on_file_save(self, data):
        self._log(f"File saved: {data.get('path')} v{data.get('version')}")

    def on_group_confirm(self, data):
        self._log(f"Group confirmed: {data.get('name')} ({data.get('file_count')} files)")

    def on_branch_create(self, data):
        self._log(f"Branch created: {data.get('name')}")

    def on_branch_merge(self, data):
        self._log(f"Merge: {data.get('source')} -> {data.get('target')}")
```

**manifest.json:**
```json
{
  "name": "event-logger",
  "version": "1.0.0",
  "description": "Logs all LocalHub events to file",
  "author": "Developer",
  "entrypoint": "main.py",
  "permissions": ["subscribe:events", "storage:local"],
  "events": ["file:save", "group:confirm", "branch:create", "branch:merge"],
  "config_schema": {
    "log_to_file": {
      "type": "boolean",
      "default": false,
      "description": "Save logs to file"
    },
    "prefix": {
      "type": "string",
      "default": "[Event]",
      "description": "Log line prefix"
    }
  }
}
```

### Example 2: Auto-Commit Plugin

```python
import threading, time, urllib.request, json

class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        self.threshold = self.config.get("threshold", 10)
        self.timeout = self.config.get("timeout_minutes", 5)
        self.prefix = self.config.get("auto_name_pattern", "[Auto]")
        self.server = self.config.get("_server_url", "http://127.0.0.1:19876")
        self.project = self.config.get("_project_root", "")
        self.save_count = 0
        self.lock = threading.Lock()

    def api(self, endpoint, method="GET", data=None):
        url = f"{self.server}{endpoint}"
        req = urllib.request.Request(url)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Project-Root", self.project)
        if data:
            req.data = json.dumps(data).encode()
            req.method = method
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)

    def on_file_save(self, data):
        with self.lock:
            self.save_count += 1
            if self.save_count >= self.threshold:
                self._auto_commit()
                self.save_count = 0

    def _auto_commit(self):
        try:
            ts = time.strftime("%H:%M", time.localtime())
            name = f"{self.prefix} {ts} ({self.save_count} changes)"
            result = self.api("/groups/confirm", "POST", {"name": name})
            print(f"[AutoCommit] Created group: {name}")
        except Exception as e:
            print(f"[AutoCommit] Error: {e}")

    def render_ui(self) -> str:
        return f"""
        <div style="padding: 20px;">
            <h3>Auto-Commit</h3>
            <p>Changes since last commit: <b>{self.save_count}</b></p>
            <p>Threshold: {self.threshold}</p>
            <p>Status: {'Active' if self.config.get('enabled', True) else 'Disabled'}</p>
        </div>
        """
```

### Example 3: Stats Dashboard with SQLite

```python
import os, sqlite3, time

class Plugin:
    def __init__(self, config=None):
        self.config = config or {}
        project = self.config.get("_project_root", ".")
        data_dir = os.path.join(project, ".localhub", "plugins", "data", "stats-dashboard")
        os.makedirs(data_dir, exist_ok=True)
        self.db_path = os.path.join(data_dir, "stats.db")
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY,
                event_type TEXT,
                timestamp REAL,
                data TEXT
            )
        """)
        conn.commit()
        conn.close()

    def _record(self, event_type, data):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            "INSERT INTO events (event_type, timestamp, data) VALUES (?, ?, ?)",
            (event_type, time.time(), str(data))
        )
        conn.commit()
        conn.close()

    def on_file_save(self, data):
        self._record("file:save", data)

    def on_group_confirm(self, data):
        self._record("group:confirm", data)

    def on_branch_create(self, data):
        self._record("branch:create", data)

    def render_ui(self) -> str:
        conn = sqlite3.connect(self.db_path)
        total = conn.execute("SELECT COUNT(*) FROM events").fetchone()[0]
        saves = conn.execute("SELECT COUNT(*) FROM events WHERE event_type='file:save'").fetchone()[0]
        groups = conn.execute("SELECT COUNT(*) FROM events WHERE event_type='group:confirm'").fetchone()[0]
        conn.close()

        return f"""
        <div style="padding: 20px; font-family: var(--vscode-font-family); color: var(--vscode-foreground);">
            <h2>Stats Dashboard</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 16px;">
                <div style="background: var(--vscode-editor-background); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">{total}</div>
                    <div>Total Events</div>
                </div>
                <div style="background: var(--vscode-editor-background); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">{saves}</div>
                    <div>File Saves</div>
                </div>
                <div style="background: var(--vscode-editor-background); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">{groups}</div>
                    <div>Groups</div>
                </div>
            </div>
        </div>
        """
```

See also: `examples/plugins/` folder for more complete examples.

---

## Debugging

### Print to Output panel

```python
# All print() statements appear in LocalHub Output panel
print("[MyPlugin] Debug: something happened")

# Open the output panel: Ctrl+Shift+U → select "LocalHub"
```

### Check if plugin is loaded

```bash
# Via API
curl http://localhost:19876/plugins

# Or in browser
# http://localhost:19876/plugins
```

### Check plugin config

```bash
curl http://localhost:19876/plugins/my-plugin/config
```

### Check plugin UI

```bash
curl http://localhost:19876/plugins/my-plugin/ui
```

### Common issues

| Problem | Solution |
|---------|----------|
| Plugin not loading | Check `manifest.json` syntax (valid JSON?) |
| Event handler not firing | Verify event name in `events` array matches handler name pattern |
| `render_ui()` not called | Make sure plugin is enabled and loaded |
| API calls failing | Check `_server_url` in config, verify server is running |
| Permission denied | Add required permission to manifest `permissions` array |

---

## Best Practices

1. **Handle errors gracefully** — wrap API calls and handlers in try/except
2. **Don't block the event loop** — use threads for long operations (HTTP calls, heavy computation)
3. **Log actions** — use `print("[PluginName] ...")` for debugging
4. **Validate config in `__init__`** — use `.get()` with defaults
5. **Use `X-Project-Root` header** — always include it in API calls
6. **Store data in data directory** — use `.localhub/plugins/data/<name>/`, never write to project files
7. **Use `time.localtime()`** — never `datetime.utcnow()` for display timestamps
8. **Keep manifest permissions minimal** — only request what you actually need
9. **Test with multiple projects** — your plugin may run in different project contexts
10. **Clean up resources** — close database connections, stop threads when disabled

---

## Security Notes

- Plugins **cannot** access the LocalHub source code
- Plugins communicate only through the HTTP API
- All plugin data is isolated in `.localhub/plugins/`
- Permissions control what API endpoints a plugin can use
- Plugin UI runs in a sandboxed VS Code webview
- Users can enable/disable plugins at any time from Settings > Plugins

---

*LocalHub Plugin Development Guide v3.0 — Complete API Reference*
