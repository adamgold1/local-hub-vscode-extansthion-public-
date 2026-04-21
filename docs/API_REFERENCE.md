# LocalHub API Reference
> Single Source of Truth for Agents and Developers

**Base URL:** `http://127.0.0.1:19876`  
**Session:** All endpoints accept `?session=vscode` (default)

**Related module docs:**
- [Shadow Sandboxes](./SHADOW_SANDBOXES.md)
- [Universal MCP](./UNIVERSAL_MCP.md)

---

## 🔀 Smart Merge (Selective Merge)

Resolve merge conflicts by choosing action per file.

```
POST /branches/{source_branch_id}/merge/smart?target_branch_id={target_id}
```

**URL Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| source_branch_id | int | ✅ | Branch to merge FROM |
| target_branch_id | int | ✅ | Branch to merge INTO (query param) |

**Body (JSON):**
```json
{
  "resolutions": [
    {"path": "src/file1.py", "action": "source"},
    {"path": "src/file2.py", "action": "target"},
    {"path": "src/file3.py", "action": "skip"}
  ]
}
```

**Action Values:**
| Value | Aliases | Description |
|-------|---------|-------------|
| `source` | `use_source`, `from_source`, `take_source` | Take file from source branch |
| `target` | `keep_target`, `from_target`, `use_target` | Keep file from target branch |
| `skip` | (any other value) | Don't touch this file |

**Response:**
```json
{
  "ok": true,
  "message": "Smart Merge completed: 1 from source, 1 kept from target, 1 skipped",
  "merged_from_source": 1,
  "kept_from_target": 1,
  "skipped": 1
}
```

---

## 📥 Import from ZIP

Import files from ZIP archive into new branch.

```
POST /import/zip
POST /branches/import  (alias)
```

**Body (JSON):**
```json
{
  "zip_path": "C:\\path\\to\\archive.zip",
  "branch_name": "imported-branch"
}
```

**Response:**
```json
{
  "ok": true,
  "branch_id": 5,
  "branch_name": "imported-branch",
  "imported_files": 42,
  "total_in_zip": 42,
  "message": "Imported 42 files into branch 'imported-branch'"
}
```

---

## 📦 Export to ZIP

Export branch to ZIP archive.

```
POST /branches/{branch_id}/export
```

**Response:**
```json
{
  "ok": true,
  "branch_name": "feature",
  "zip_path": "C:\\project\\.localhub\\exports\\feature_20240111.zip",
  "exported_files": 15,
  "zip_size_mb": 0.5
}
```

---

## 🌿 Branches

### List Branches
```
GET /branches
```

### Create Branch
```
POST /branches?name={branch_name}
```

### Switch Branch
```
POST /branches/{branch_id}/switch
```

### Delete Branch
```
DELETE /branches/{branch_id}
```

### Merge Branch (Force)
```
POST /branches/{source_id}/merge?target_branch_id={target_id}&force=true
```

---

## 📦 TM Groups (Checkout + Zombie Trash)

### List TM Groups
```
GET /groups?session=vscode
GET /groups?session=vscode&include_deleted=true
```

### Checkout TM Group
```
POST /groups/{group_id}/checkout?session=vscode
```

**Response:**
```json
{
  "ok": true,
  "mode": "group_detached",
  "group_id": 128,
  "branch_id": 17,
  "branch_name": "main",
  "message": "Checked out TM Group #128 on branch 'main'"
}
```

### TM Group Checkout Status
```
GET /groups/checkout/status?session=vscode
```

**Response when detached:**
```json
{
  "ok": true,
  "mode": "group_detached",
  "active_branch_id": 17,
  "active_branch_name": "main",
  "checked_out_group_id": 128
}
```

### Return To Branch Head
```
POST /groups/checkout/clear?session=vscode
```

### Delete TM Group (Soft Delete to Trash)
```
DELETE /groups/{group_id}?session=vscode&delete_snapshots=false&permanent=false
```

### Delete TM Group With Snapshots
```
DELETE /groups/{group_id}?session=vscode&delete_snapshots=true&permanent=false
```

### List Zombie TM Groups
```
GET /group-trash?session=vscode
```

### Restore Zombie TM Group
```
POST /groups/{group_id}/restore?session=vscode
```

### Restore All Zombie TM Groups
```
POST /group-trash/restore-all?session=vscode
```

### Empty Zombie TM Group Trash
```
DELETE /group-trash?session=vscode
```

---

## 📁 Files & History

### List All Files
```
GET /files
```

### Get File History
```
GET /history?path={file_path}
```

### Create Snapshot
```
POST /snapshot
Body: {"path": "src/file.py", "reason": "manual"}
```

### Restore Version
```
POST /restore?path={file_path}&version={version_number}
```

---

## 🗑️ Cleanup

### Cleanup Old Versions
```
POST /backup/cleanup?days=30
```

**Response:**
```json
{
  "ok": true,
  "deleted_files": 10,
  "freed_mb": 2.5,
  "retention_days": 30
}
```

---

## ☁️ Cloud Sync (GitHub)

### Upload to GitHub Repository
```
POST /cloud/github/sync
```

**Body (JSON):**
```json
{
  "token": "ghp_xxxxxxxxxxxx",
  "repo_owner": "your-username",
  "repo_name": "my-project",
  "branch": "main",
  "commit_message": "LocalHub sync"
}
```

**Response:**
```json
{
  "ok": true,
  "uploaded_files": 15,
  "total_files": 15,
  "message": "Uploaded 15/15 files to your-username/my-project"
}
```

### Get Upload Progress
```
GET /cloud/progress
```

**Response:**
```json
{
  "status": "uploading",
  "total_files": 15,
  "uploaded_files": 7,
  "total_bytes": 1024000,
  "uploaded_bytes": 512000,
  "current_file": "src/app.py",
  "percent": 50.0
}
```

### Abort Upload
```
POST /cloud/abort
```

### Clone from GitHub
```
POST /cloud/github/clone
Content-Type: application/json
```

**Body:**
```json
{
  "token": "ghp_xxxxxxxxxxxx",
  "repo_owner": "username",
  "repo_name": "my-repo",
  "branch": "main",
  "target_branch_name": "github_username_my-repo"
}
```

**Response:**
```json
{
  "ok": true,
  "downloaded_files": 50,
  "total_files": 55,
  "branch_name": "github_username_my-repo",
  "branch_id": 10,
  "message": "Cloned 50/55 files to branch 'github_username_my-repo'"
}
```

---

## ❤️ Health Check

```
GET /health
```

**Response:**
```json
{"status": "ok", "version": "2.5"}
```

---

## 🧪 Shadow Sandboxes

Core sandbox endpoints:

```http
POST   /lh/sandboxes/create
GET    /lh/sandboxes/list
GET    /lh/sandboxes/{name}/status
GET    /lh/sandboxes/{name}/files
GET    /lh/sandboxes/{name}/diff
POST   /lh/sandboxes/{name}/checkout
POST   /lh/sandboxes/{name}/return
POST   /lh/sandboxes/{name}/merge
DELETE /lh/sandboxes/{name}
POST   /lh/sandboxes/health/cleanup
POST   /lh/sandboxes/health/emergency_reset
```

Use the full human-facing guide:
- [SHADOW_SANDBOXES.md](./SHADOW_SANDBOXES.md)

---

## 🔌 Universal MCP Bootstrap

Project-level MCP bootstrap endpoints:

```http
GET    /mcp/config
POST   /mcp/bootstrap?overwrite=false
DELETE /mcp/bootstrap
```

`POST /init` now also bootstraps `.vscode/mcp.json` automatically when the file does not exist yet.

Use the full MCP guide:
- [UNIVERSAL_MCP.md](./UNIVERSAL_MCP.md)

---

## 🤖 Notes for AI Agents

1. **Always use query params** for IDs when possible
2. **Body is JSON** with Content-Type: application/json
3. **Action values are flexible** - we normalize them (use_source → source)
4. **Field names are flexible** - we accept aliases (file_choices → resolutions)
5. **Check /health first** to verify server is running
6. **See [TESTING.md](./TESTING.md)** for full test checklist

---

## 🗑️ Trash Bin (Deleted Files)

### List Deleted Files
```
GET /files/deleted?session=vscode
```

**Response:**
```json
{
  "ok": true,
  "files": [
    {
      "path": "c:/project/deleted_file.py",
      "name": "deleted_file.py",
      "last_version": 5,
      "versions_count": 3
    }
  ],
  "count": 1
}
```

### Empty Trash
```
DELETE /files/deleted?session=vscode
```

**Response:**
```json
{
  "ok": true,
  "deleted_versions": 15,
  "message": "Emptied trash: 15 versions removed"
}
```

### Restore Deleted File
Use existing `/restore` endpoint:
```
POST /restore
Content-Type: application/json

{
  "path": "c:/project/deleted_file.py",
  "version": 5,
  "session": "vscode"
}
```

---

*LocalHub v2.5 | API Reference*
