# 🧪 LocalHub Testing Checklist

> For AI Agents and Manual Testing
> Last Updated: 2026-01-11

---

## ☁️ Cloud Sync (GitHub Integration)

### Test 1: Setup GitHub
```
Ctrl+Shift+P → "LocalHub: Setup GitHub Integration"
```
**Expected:**
- Prompt for GitHub token
- Prompt for username
- Prompt for repo name
- Token saved securely
- Cloud icon appears in Pending Changes panel

### Test 2: Sync to GitHub (Cloud Button)
```
Click ☁️ cloud icon in Pending Changes panel
```
**Expected:**
- QuickPick menu with options:
  - Push to saved repository
  - Change branch
  - Add new repository
- Select repo → prompt for commit message
- Upload starts (spinning icon)
- Success message with file count

### Test 3: API Sync
```bash
curl -X POST "http://127.0.0.1:19876/cloud/github/sync" \
  -H "Content-Type: application/json" \
  -d '{"token":"ghp_xxx","repo_owner":"username","repo_name":"repo","branch":"main"}'
```
**Expected:** `{"ok":true,"uploaded_files":N,"total_files":N}`

### Test 4: Progress Tracking
```bash
curl "http://127.0.0.1:19876/cloud/progress"
```
**Expected:** `{"status":"uploading","percent":50.0,...}` during sync

### Test 5: Clone from GitHub
```
Ctrl+Shift+P → "LocalHub: Clone from GitHub"
```
**Expected:**
- Prompts for token, owner, repo, branch
- Downloads files from GitHub
- Creates new branch with cloned files
- Shows success message

### Test 5b: Clone API
```bash
curl -X POST "http://127.0.0.1:19876/cloud/github/clone" \
  -H "Content-Type: application/json" \
  -d '{"token":"ghp_xxx","repo_owner":"username","repo_name":"repo","branch":"main"}'
```
**Expected:** `{"ok":true,"downloaded_files":N,"branch_name":"..."}`

---

## 🔑 SSH Push (Git CLI)

### Test 6: SSH Push via UI
```
Ctrl+Shift+P → "LocalHub: Push via SSH/Git"
```
**Expected:**
- Prompt for remote URL (git@github.com:user/repo.git)
- Prompt for branch (default: main)
- Spinner in status bar
- Success message with file count

### Test 6b: SSH Push API
```bash
curl -X POST "http://127.0.0.1:19876/cloud/ssh/push" \
  -H "Content-Type: application/json" \
  -d '{"remote_url":"git@github.com:user/repo.git","branch":"main"}'
```
**Expected:** `{"ok":true,"files_pushed":N,"message":"..."}`

---

## 🔄 Merge Memory (Tracking)

### Test 7: Merge and Check Status
1. Create branch `feature`
2. Make changes, confirm
3. Switch to `main`
4. Merge `feature` into `main`

**Expected:**
- After merge, `feature` branch shows:
  - Green merge icon (git-merge)
  - Label "merged"
  - Tooltip: "Merged into #X" + date

### Test 7b: API Check Merge Status
```bash
curl "http://127.0.0.1:19876/branches?session=vscode"
```
**Expected:** Branch with `"merged_into": N, "merged_at": timestamp`

### Test 7c: Delete Merged Branch Prompt
After merge completes:
**Expected:** Dialog "Delete merged branch?" with options Delete/Keep

---

## ⚡ UI Auto-Sync

### Test 8: UI Updates After Actions
1. Open Branches panel in VS Code
2. In terminal: `lh branch test_ui_sync`
3. Wait 1 second

**Expected:** New branch appears in panel WITHOUT manual refresh

### Test 8b: UI Updates After Merge
1. Merge a branch via UI
**Expected:** All panels refresh automatically (branches, groups, files)

---

## 🔀 Smart Merge

### Test 9: Smart Merge API
```bash
curl -X POST "http://127.0.0.1:19876/branches/2/merge/smart?target_branch_id=1" \
  -H "Content-Type: application/json" \
  -d '{"resolutions":[{"path":"file.py","action":"source"}]}'
```
**Expected:** `{"ok":true,"merged_from_source":1,...}`

---

## 📦 Export/Import

### Test 6: Export Branch to ZIP
```
Right-click branch → Export to ZIP
```
**Expected:** ZIP file created in `.localhub/exports/`

### Test 7: Import from ZIP
```
Ctrl+Shift+P → "LocalHub: Import Branch from ZIP"
```
**Expected:**
- File picker opens
- Preview shows file count
- New branch created with imported files

### Test 8: Import API
```bash
curl -X POST "http://127.0.0.1:19876/import/zip" \
  -H "Content-Type: application/json" \
  -d '{"zip_path":"C:\\path\\to.zip","branch_name":"imported"}'
```
**Expected:** `{"ok":true,"imported_files":N}`

---

## 🌿 Branches

### Test 9: Create Branch
```
Ctrl+Shift+P → "LocalHub: Create Branch"
```
**Expected:** New branch visible in Branches panel

### Test 10: Switch Branch
```
Click branch in panel → "Switch to this branch"
```
**Expected:** 
- Files from new branch appear
- Files unique to old branch disappear
- Star moves to new active branch

### Test 11: Branch Isolation
1. Create file in Branch A
2. Switch to Branch B
3. File should NOT exist in Branch B

---

## 🗑️ Cleanup

### Test 12: Cleanup Old Versions
```
Ctrl+Shift+P → "LocalHub: Cleanup Old Versions"
```
**Expected:** Prompt for days → delete old snapshots → show freed space

### Test 13: Cleanup API
```bash
curl -X POST "http://127.0.0.1:19876/backup/cleanup?days=30"
```
**Expected:** `{"ok":true,"deleted_files":N,"freed_mb":X}`

---

## 📜 File History

### Test 14: View History
```
Click file in File History panel
```
**Expected:** List of versions with timestamps

### Test 15: Restore Version
```
Right-click version → Restore
```
**Expected:** File content reverts to selected version

### Test 16: View Diff
```
Right-click version → Show Diff
```
**Expected:** Side-by-side diff opens

---

## ❤️ Health Check

### Test 17: Server Health
```bash
curl "http://127.0.0.1:19876/health"
```
**Expected:** `{"status":"ok","version":"2.5"}`

---

## 📊 Status Bar

### Test 18: TM Status
- Open a file with history
- Status bar shows `TM: vN` where N is version count

### Test 19: Cloud Icon
- Cloud icon visible in status bar (right side)
- Click → opens sync dialog

---

## 📚 Documentation Files

- `docs/FEATURES.md` - All features documented
- `docs/API_REFERENCE.md` - API format for agents
- `README.md` - Links to docs
- `TODO.md` - Progress tracking

---

## 💻 CLI Commands

### Test 20: CLI Help
```powershell
python cli/lh.py help
```
**Expected:** Shows all available commands

### Test 21: CLI Status
```powershell
python cli/lh.py status
```
**Expected:** Shows server status, branch count, cloud status

### Test 22: CLI Branch List
```powershell
python cli/lh.py branch
```
**Expected:** Lists all branches with stars for active

### Test 23: CLI Push
```powershell
$env:GITHUB_TOKEN="ghp_xxx"
$env:GITHUB_OWNER="username"
$env:GITHUB_REPO="repo"
python cli/lh.py push
```
**Expected:** Shows progress and uploads files

### Test 23A: CLI TM Group Checkout
```powershell
python cli/lh.py group checkout 128
python cli/lh.py group status
```
**Expected:**
- Checkout command succeeds
- Status shows detached TM checkout
- Branch name and group ID are visible

### Test 23B: CLI Return To Branch Head
```powershell
python cli/lh.py group head
python cli/lh.py group status
```
**Expected:**
- Head command succeeds
- Status shows active branch head

### Test 23C: UI TM Group Checkout
```
TM GROUPS → Right Click group → "Checkout TM Group"
TM GROUPS → Right Click any group while detached → "Return To Branch Head"
```
**Expected:**
- Checked out group gets detached marker
- TM GROUPS header shows detached message
- Return command restores branch head
- Future groups remain visible and marked as future

### Test 23D: Cross-Branch TM Group Checkout (CLI)
```powershell
python cli/lh.py branch
python cli/lh.py group checkout <group_id_from_other_branch>
python cli/lh.py group status
```
**Expected:**
- Checkout command succeeds on a TM Group from another branch
- Status shows detached TM checkout
- Status shows the target branch of that TM Group, not the previously active branch
- Workspace files match the selected TM Group state

### Test 23E: Cross-Branch Return To Branch Head
```powershell
python cli/lh.py group head
python cli/lh.py group status
```
**Expected:**
- Return command succeeds after cross-branch checkout
- Workspace returns to the head of the target branch that was checked out
- Status shows active branch head

### Test 23F: Cross-Branch UI Visibility
```
1. Create or use TM Groups from two different branches
2. Checkout a TM Group from another branch in TM GROUPS
3. Observe TM GROUPS and BRANCHES panels
```
**Expected:**
- Checked out group is marked as detached/current
- Future groups are marked only inside the checked-out branch timeline
- BRANCHES panel shows the target branch as active
- `Return To Branch Head` is available in toolbar and right-click menu

### Test 23G: API Cross-Branch Checkout
```powershell
curl -X POST "http://127.0.0.1:19876/groups/<group_id>/checkout?session=vscode"
curl "http://127.0.0.1:19876/groups/checkout/status?session=vscode"
curl -X POST "http://127.0.0.1:19876/groups/checkout/clear?session=vscode"
```
**Expected:**
- Checkout response returns `mode=group_detached`
- Status returns `checked_out_group_id` and target branch info
- Clear returns workspace to `mode=branch_head`

---

## 📂 .localhubignore

### Test 24: Create Ignore File
```
Ctrl+Shift+P → "LocalHub: Create .localhubignore"
```
**Expected:**
- Template picker (All, Python, Node, Minimal)
- Creates .localhubignore file
- Opens file for editing

### Test 25: Add to Ignore
```
Right-click file in Pending Changes → "Add to .localhubignore"
```
**Expected:** 
- File path added to .localhubignore
- File removed from pending changes

---

## ✅ Quick Agent Test Script

```python
import requests

BASE = "http://127.0.0.1:19876"

# 1. Health check
r = requests.get(f"{BASE}/health")
print("Health:", r.json())

# 2. List branches
r = requests.get(f"{BASE}/branches")
print("Branches:", len(r.json().get("branches", [])))

# 3. List files
r = requests.get(f"{BASE}/files")
print("Files:", len(r.json()))

# 4. Cloud progress (should be idle)
r = requests.get(f"{BASE}/cloud/progress")
print("Cloud:", r.json().get("status"))

print("✅ All basic tests passed!")
```

---

## 🗑️ Trash Bin (Deleted Files)

### Test 10: Show Deleted Files (UI)
1. Delete a file from project
2. Click 🗑️ icon in File History panel (or Ctrl+Alt+T)

**Expected:** Quick pick shows deleted files with versions

### Test 10b: Restore Deleted File (UI)
1. From trash list, select a file
2. Click "Restore"

**Expected:** File appears on disk, message "Restored"

### Test 10c: Empty Trash (UI)
1. `Ctrl+Shift+P` → "LocalHub: Empty Trash"
2. Confirm

**Expected:** All deleted file history removed

### Test 11: CLI Trash Commands
```bash
# Show deleted files
lh trash

# Restore single file
lh restore myfile.py

# Restore all
lh restore --all

# Empty trash
lh empty-trash
```
**Expected:** Each command works from any project directory

### Test 11b: API Trash Endpoints
```bash
# List deleted files
curl "http://127.0.0.1:19876/files/deleted?session=vscode"

# Restore file
curl -X POST "http://127.0.0.1:19876/restore" \
  -H "Content-Type: application/json" \
  -d '{"path":"c:/path/to/file.py","version":5,"session":"vscode"}'

# Empty trash
curl -X DELETE "http://127.0.0.1:19876/files/deleted?session=vscode"
```
**Expected:** Each returns `{"ok":true,...}`

---

*LocalHub v2.5 | Testing Checklist*
