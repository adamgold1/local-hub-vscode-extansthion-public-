# 📡 LocalHub Protocol Specification v1.0

> Открытый протокол для интеграции с LocalHub

---

## 🔌 Подключение

```
Host: localhost
Port: 19876 (default)
Protocol: HTTP/REST
Format: JSON
```

### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "version": "2.5.0",
  "project": "C:/path/to/project"
}
```

---

## 📁 Files API

### Get All Files
```http
GET /files?session=vscode

Response:
{
  "ok": true,
  "files": [
    {"path": "app.py", "versions": 5, "last_modified": "2024-01-12T10:00:00"},
    {"path": "utils.py", "versions": 3, "last_modified": "2024-01-12T09:30:00"}
  ]
}
```

### Get File History
```http
GET /history?path=app.py&session=vscode&limit=10

Response:
{
  "ok": true,
  "history": [
    {"version": 5, "timestamp": 1736715000, "reason": "SAVE", "hash": "abc123"},
    {"version": 4, "timestamp": 1736714000, "reason": "EXTERNAL_CHANGE", "hash": "def456"}
  ]
}
```

### Get File Content (specific version)
```http
GET /content?path=app.py&version=3&session=vscode

Response:
{
  "ok": true,
  "content": "# Python file content...",
  "version": 3
}
```

### Create Snapshot
```http
POST /snapshot
Content-Type: application/json

{
  "session": "vscode",
  "path": "app.py",
  "reason": "manual"
}

Response:
{
  "ok": true,
  "version": 6
}
```

### Get Diff
```http
GET /diff?path=app.py&v1=3&v2=5&session=vscode

Response:
{
  "ok": true,
  "diff": "--- v3\n+++ v5\n@@ -1,3 +1,5 @@\n..."
}
```

---

## 🌿 Branches API

### List Branches
```http
GET /branches?session=vscode

Response:
{
  "ok": true,
  "branches": [
    {"id": 1, "name": "main", "is_active": true, "files_count": 10},
    {"id": 2, "name": "feature", "is_active": false, "files_count": 8}
  ]
}
```

### Create Branch
```http
POST /branches?name=feature&session=vscode

Response:
{
  "ok": true,
  "branch_id": 3,
  "name": "feature"
}
```

### Switch Branch
```http
POST /branches/2/switch?session=vscode

Response:
{
  "ok": true,
  "message": "Switched to 'feature'"
}
```

### Delete Branch
```http
DELETE /branches/2?session=vscode

Response:
{
  "ok": true,
  "message": "Branch deleted"
}
```

### Merge Branches
```http
POST /branches/2/merge?session=vscode

Response:
{
  "ok": true,
  "merged_files": 5,
  "conflicts": []
}
```

---

## ✅ Groups API (Commits)

### Get Pending Changes
```http
GET /groups/pending?session=vscode

Response:
{
  "ok": true,
  "pending": [
    {"path": "app.py", "status": "modified"},
    {"path": "new.py", "status": "added"}
  ]
}
```

### Confirm Group (Commit)
```http
POST /groups/confirm
Content-Type: application/json

{
  "session": "vscode",
  "name": "Added new feature",
  "comment": "Fixed bug #123"
}

Response:
{
  "ok": true,
  "group_id": 15
}
```

### List Groups
```http
GET /groups?session=vscode

Response:
{
  "ok": true,
  "groups": [
    {"id": 15, "name": "Added new feature", "files_count": 2, "timestamp": 1736715000}
  ]
}
```

---

## 🗑️ Trash API

### Get Deleted Files
```http
GET /files/deleted?session=vscode

Response:
{
  "ok": true,
  "deleted": [
    {"path": "old_file.py", "deleted_at": 1736700000, "versions": 3}
  ]
}
```

### Restore from Trash
```http
POST /restore
Content-Type: application/json

{
  "session": "vscode",
  "path": "old_file.py",
  "version": null
}

Response:
{
  "ok": true,
  "message": "Restored"
}
```

### Empty Trash
```http
DELETE /files/deleted?session=vscode

Response:
{
  "ok": true,
  "deleted_count": 5
}
```

---

## 📦 Stash API

### Save Stash
```http
POST /stash?session=vscode

Response:
{
  "ok": true,
  "message": "Stashed 3 files",
  "stash_id": 0
}
```

### List Stashes
```http
GET /stash?session=vscode

Response:
{
  "ok": true,
  "stashes": [
    {"id": 0, "message": "WIP", "files_count": 3, "timestamp": 1736715000}
  ]
}
```

### Pop Stash
```http
POST /stash/pop?session=vscode

Response:
{
  "ok": true,
  "message": "Popped stash",
  "restored": 3
}
```

### Drop Stash
```http
DELETE /stash/0?session=vscode

Response:
{
  "ok": true,
  "message": "Dropped"
}
```

---

## 🏷️ Tags API

### Create Tag
```http
POST /tags?name=v1.0&message=Release&session=vscode

Response:
{
  "ok": true,
  "message": "Created tag 'v1.0'"
}
```

### List Tags
```http
GET /tags?session=vscode

Response:
{
  "ok": true,
  "tags": [
    {"name": "v1.0", "branch_name": "main", "timestamp": 1736715000}
  ]
}
```

### Delete Tag
```http
DELETE /tags/v1.0?session=vscode

Response:
{
  "ok": true,
  "message": "Deleted"
}
```

---

## 🍒 Cherry-pick API

```http
POST /cherry-pick?source_branch_id=2&file_path=utils.py&session=vscode

Response:
{
  "ok": true,
  "message": "Cherry-picked utils.py v3 from 'feature'",
  "version": 3
}
```

---

## ☁️ Cloud API

### Sync to GitHub
```http
POST /cloud/github/sync
Content-Type: application/json

{
  "session": "vscode",
  "token": "ghp_xxx",
  "owner": "username",
  "repo": "repo-name",
  "branch": "main"
}

Response:
{
  "ok": true,
  "uploaded_files": 10
}
```

### Clone from GitHub
```http
POST /cloud/github/clone
Content-Type: application/json

{
  "session": "vscode",
  "token": "ghp_xxx",
  "repo_url": "https://github.com/user/repo"
}

Response:
{
  "ok": true,
  "downloaded": 25
}
```

---

## 🔌 Plugin API

### List Installed Plugins
```http
GET /plugins?session=vscode

Response:
{
  "ok": true,
  "plugins": [
    {"name": "my-plugin", "version": "1.0.0", "enabled": true}
  ]
}
```

### Install Plugin
```http
POST /plugins/install
Content-Type: application/json

{
  "name": "my-plugin",
  "source": "local",
  "path": "/path/to/plugin"
}

Response:
{
  "ok": true,
  "message": "Installed"
}
```

### Enable/Disable Plugin
```http
POST /plugins/my-plugin/enable
POST /plugins/my-plugin/disable
```

### Plugin Config
```http
GET /plugins/my-plugin/config
PUT /plugins/my-plugin/config
```

---

## 📡 Events (WebSocket)

Connect to: `ws://localhost:19876/events`

### Subscribe to events:
```json
{
  "action": "subscribe",
  "events": ["file:save", "group:confirm", "branch:switch"]
}
```

### Event format:
```json
{
  "event": "file:save",
  "timestamp": 1736715000,
  "data": {
    "path": "app.py",
    "version": 5,
    "reason": "SAVE"
  }
}
```

### Available events:
- `file:save`
- `file:delete`
- `file:restore`
- `group:confirm`
- `branch:create`
- `branch:switch`
- `branch:delete`
- `branch:merge`
- `stash:save`
- `stash:pop`
- `tag:create`
- `tag:delete`
- `github:sync`
- `github:clone`
- `session:start`
- `session:end`

---

## 🔐 Authentication (Future)

```http
Authorization: Bearer <plugin_token>
```

---

## 📝 Error Format

```json
{
  "ok": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Codes:
- `NOT_INITIALIZED` — LocalHub not initialized
- `FILE_NOT_FOUND` — File not found
- `BRANCH_NOT_FOUND` — Branch not found
- `PERMISSION_DENIED` — No permission
- `INVALID_REQUEST` — Bad request format

---

*LocalHub Protocol v1.0 | Open Specification*
