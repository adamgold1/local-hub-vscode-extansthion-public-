# LocalHub CLI Reference

The LocalHub CLI (`lh`) provides a powerful, Git-like interface for managing your local version control history, branches, and backups directly from your terminal.

## 🚀 Getting Started

The CLI is automatically installed by the LocalHub VS Code extension.
You can verify it by running:
```bash
lh --version
```

## 📜 Core Commands

### `lh status`
Shows the working tree status.
- Displays the current active branch.
- Lists files with pending changes (modified since last snapshot).
- Shows auto-save status.

```bash
$ lh status
On branch main
Pending changes:
  M src/extension.ts
  M package.json
```

### `lh log [file]`
Shows commit logs or file history.

**Global History (Groups/Commits):**
List all "TM Groups" (snapshots grouped by confirmation).
```bash
$ lh log
```

**File History:**
List all versions of a specific file.
```bash
$ lh log src/extension.ts
v25  2023-10-25 14:30  manual:snapshot
v24  2023-10-25 14:25  auto:save
```

### `lh diff <file> [version]`
Show changes between versions.

**Diff Latest vs Current:**
Compare the latest snapshot with the file currently on disk.
```bash
$ lh diff src/main.py
```

**Diff Specific Version vs Current:**
Compare version 5 with the file currently on disk.
```bash
$ lh diff src/main.py 5
```

### `lh show <file> [version]`
Print the content of a file version to stdout.

**Show Latest Snapshot:**
```bash
$ lh show src/main.py
```

**Show Specific Version:**
```bash
$ lh show src/main.py 12 > old_main.py
```

## 🌿 Branching

### `lh branch`
List, create, or delete branches.

- **List branches:** `lh branch`
- **Create branch:** `lh branch feature/login`
- **Delete branch:** `lh branch -d feature/login`
- **Branch trash:** `lh branch trash`
- **Restore zombie branch:** `lh branch restore <name|id>`
- **Restore all zombie branches:** `lh branch restore --all`
- **Empty branch trash:** `lh branch empty-trash`

### `lh group`
Manage TM Groups and zombie TM Group trash.

- **List confirmed groups:** `lh group`
- **List all groups (incl. zombie):** `lh group -a`
- **Delete group (keep snapshots):** `lh group -d <name|id>`
- **Delete group with snapshots:** `lh group -d <name|id> --with-snapshots`
- **Group trash:** `lh group trash`
- **Restore zombie group:** `lh group restore <name|id>`
- **Restore all zombie groups:** `lh group restore --all`
- **Empty group trash:** `lh group empty-trash`

### `lh group checkout <id>`
Checkout the whole workspace to the exact state of a confirmed TM Group.

```bash
$ lh group checkout 128
```

What it does:
- Restores files to the selected TM Group state.
- Marks the workspace as **detached** from branch head.
- Keeps the active branch context, so you can return to branch head later.

### `lh group status`
Show current TM Group checkout state.

```bash
$ lh group status
🌿 Workspace is at active branch head
```

or:

```bash
$ lh group status
🎯 Detached TM checkout:
   Group: #128 My TM Group
   Branch: #17 main
```

### `lh group head`
Return the workspace from detached TM Group mode back to the active branch head.

```bash
$ lh group head
```

Typical flow:
```bash
lh group checkout 128
lh group status
lh group head
lh group status
```

### `lh switch <branch>`
Switch the active branch. This updates all files in your working directory to match the branch state.
```bash
$ lh switch feature/login
```

## 🗑️ Trash & Recovery

### `lh trash`
List deleted files that LocalHub has backed up.

### `lh restore <file>`
Restore a deleted file or revert a file to its latest snapshot.
```bash
$ lh restore deleted_script.py
```

### `lh empty-trash`
Permanently remove all history of deleted files.

## ☁️ Cloud (GitHub)

### `lh push`
Sync the current branch and all pending changes to the configured GitHub repository.
```bash
$ lh push
```

### `lh clone <owner> <repo>`
Clone a repository from GitHub into a new LocalHub branch.
```bash
$ lh clone adamgold1/localhub-vscode
```

## 🛠️ Utilities

- `lh init`: Initialize LocalHub in the current directory.
- `lh ignore`: Manage .localhubignore patterns.
- `lh stash`: Stash pending changes (experimental).
- `lh plugin`: Manage LocalHub plugins.
