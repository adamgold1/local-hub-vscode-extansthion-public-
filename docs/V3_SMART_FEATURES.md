# LocalHub v3.0 — Smart Features Documentation

> Visual Code Intelligence: Deep Relationships, Predictions, and Analytics

---

## Overview

LocalHub v3.0 adds 8 smart analyzers, an enhanced relationship graph, and a fullscreen Features panel. All features are powered by your existing LocalHub snapshot data — no external services required.

---

## Expanded Tool Coverage

For human-facing documentation across the full visual toolset, see [LOCALHUB_VISUAL_TOOLS_GUIDE.md](./LOCALHUB_VISUAL_TOOLS_GUIDE.md).

The v3 surface is no longer just the 8 analyzers. In practice, LocalHub exposes 13 connected tools:

| Tool | Open command | Primary layer |
|------|--------------|---------------|
| Predictive Suggestions | `localhub.feature.predictions` | Features panel |
| Timeline View | `localhub.feature.timeline` | Features panel |
| Activity Heatmap | `localhub.feature.heatmap` | Features panel |
| Refactoring Hints | `localhub.feature.refactoring` | Features panel |
| Change Velocity | `localhub.feature.velocity` | Features panel |
| Dependency Overlay | `localhub.feature.dependencies` | Features panel |
| Smart Clusters | `localhub.feature.clusters` | Features panel |
| Analytics Dashboard | `localhub.feature.analytics` | Features panel |
| Relationships | `localhub.openGraphFullTab` | Graph workspace |
| 3D Grid | `localhub.open3DGrid` | 3D workspace |
| Time Machine | `localhub.openTimeMachine` | Time Travel Suite |
| Code Replay | `localhub.openCodeReplay` | Time Travel Suite |
| Branch Tree | `localhub.openBranchTree` | Time Travel Suite |

Use this file for architecture and engine notes. Use `LOCALHUB_VISUAL_TOOLS_GUIDE.md` when you need an operational manual for a human user.

---

## 1. Features Panel (Sidebar + Fullscreen)

The Features panel provides access to all 8 smart analyzers in two modes:

| Mode | How to open | Description |
|------|-------------|-------------|
| **Sidebar** | Click the Features icon in LocalHub sidebar | Compact 2-column card grid |
| **Fullscreen** | Click any card or use `LocalHub: Open Features` command | Full tab with left navigation |

### Available Feature Cards:

| # | Feature | Icon | Description |
|---|---------|------|-------------|
| 1 | **Predictions** | Crystal Ball | AI-predicted next files you'll edit based on co-change patterns |
| 2 | **Timeline** | Clock | Visual timeline of changes in 5-minute buckets (up to 100 events) |
| 3 | **Heatmap** | Fire | Activity heatmap over 14 days, top-20 most active files |
| 4 | **Refactoring** | Wrench | Suggestions: MERGE (85%+ co-change), EXTRACT (5+ partners), SPLIT (50+ changes) |
| 5 | **Velocity** | Rocket | Change velocity with trend indicator (-1 to +1), daily breakdown |
| 6 | **Dependencies** | Link | Static imports vs dynamic co-changes, hidden dependency detection |
| 7 | **Clusters** | Boxes | Union-Find file clustering with 26+ naming patterns (Auth, API, DB, etc.) |
| 8 | **Analytics** | Chart | Dashboard: metrics, peak hours, top files of the week |

### API Endpoints:

```
GET /features/predictions     — Next file predictions with confidence scores
GET /features/timeline        — Change timeline in 5-minute buckets
GET /features/heatmap         — 14-day activity heatmap
GET /features/refactoring     — Refactoring suggestions (MERGE/EXTRACT/SPLIT/RENAME)
GET /features/velocity        — Change velocity and trends
GET /features/dependencies    — Import analysis vs co-change patterns
GET /features/clusters        — Union-Find file clusters
GET /features/analytics       — Dashboard with metrics and peak hours
```

---

## 2. Relationships Graph (Enhanced)

Interactive file relationship visualization using Cytoscape.js.

### Graph Views:

| View | Description |
|------|-------------|
| **Graph** | Interactive Cytoscape force-directed graph |
| **List** | Cluster-based file grouping with statistics |

### Layout Options (7 layouts):

| Layout | Type | Description |
|--------|------|-------------|
| **Force** | Continuous | Force-directed with gentle continuous animation loop |
| **Force Classic** | One-shot | Original simple force (400ms animation, runs once) |
| **Force New** | One-shot | Smart force (500ms animation, runs once) |
| **Circle** | Static | All nodes arranged in a circle |
| **Grid** | Static | Nodes in a grid pattern |
| **Tree** | Static | Breadthfirst tree layout |
| **Concentric** | Static | Concentric circles (most connected in center) |

### Edge Types:

| Type | Color | Style | Meaning |
|------|-------|-------|---------|
| **Group** | Green | Solid | Files confirmed together in TM Groups |
| **Temporal** | Orange | Dashed | Files changed close in time |

### Filter Buttons:

- **Groups** toggle — Show/hide group edges (green)
- **Temporal** toggle — Show/hide temporal edges (orange)

### Interactions:

| Action | What happens |
|--------|-------------|
| Click node | Opens detail panel with co-change neighbors |
| Double-click node | Opens the file in editor |
| Drag node | Move node, force layout readjusts |
| Scroll | Zoom in/out |

### Graph API Endpoints:

```
GET /graph/relationships  — Full relationship graph (nodes + edges + stats)
    ?days=30              — Time period (default 30)
    &min_cochanges=2      — Minimum co-changes to show edge
    &time_window=300      — Temporal window in seconds

GET /graph/neighbors      — Top-25 co-change partners for a file
    ?path=src/file.ts     — File path
    &min_cochanges=2

GET /graph/clusters       — Union-Find clusters with naming

GET /symbols/timeline     — Symbol change history
    ?path=src/file.ts
    &symbol_name=MyClass
```

### Fullscreen Graph:

- Open via expand button in the Graph sidebar
- Same functionality as sidebar but with full screen space
- `retainContextWhenHidden: true` — preserves state when switching tabs

---

## 3. Daemon Server (Multi-Project)

The daemon server manages multiple LocalHub projects simultaneously.

### Key Features:

| Feature | Description |
|---------|-------------|
| **Multi-project registry** | Tracks all open projects |
| **Port auto-discovery** | Finds available port starting from 19876 |
| **Per-request hub resolution** | Each request gets the correct project hub |
| **Module auto-loading** | Smart modules loaded via try/catch (non-fatal on failure) |

### Registered Route Modules:

```
1. blame_routes        — Git-like blame (when each line changed)
2. bisect_routes       — Binary search for bugs across versions
3. log_routes          — Extended log with filters and search
4. protection_routes   — Trash protection
5. gw_routes           — Global Watcher endpoints
6. graph_routes        — Original graph analysis (graph_analysis.py)
7. smart_graph_routes  — Smart graph with Union-Find (graph_analyzer.py)
8. features_routes     — 8 smart analyzers (features_analyzer.py)
9. integration_routes  — Auto tagger, tree diff, enhanced groups
```

---

## 4. Graph Analysis — Two Engines

LocalHub runs TWO graph analysis engines simultaneously:

### Engine 1: Classic (`graph_analysis.py`)

- Simple co-change counting from TM Groups
- Routes: `/graph/relationships`, `/graph/neighbors`, `/symbols/timeline`
- Registered FIRST (takes priority on shared routes)

### Engine 2: Smart (`graph_analyzer.py`)

- Union-Find clustering with path compression
- 30-second cache for performance
- Limits: 300 nodes, 1000 edges max
- Routes: `/graph/relationships`, `/graph/neighbors`, `/graph/clusters`, `/symbols/timeline`
- Registered SECOND (provides `/graph/clusters` which is unique)

---

## 5. Auto Tagger (`auto_tagger.py`)

Analyzes diffs within TM Groups to generate automatic tags:

```
Tags: [new-function] [refactor] [3-files] [api-change]
```

### Tag Patterns:

| Pattern | Detection Method |
|---------|-----------------|
| `new-function` | `def`/`function`/`class` added in diff |
| `refactor` | High ratio of deletions + additions |
| `api-change` | Route/endpoint modifications detected |
| `n-files` | File count in the group |

### How to Use Tags (Step by Step):

#### Step 1: Analyze Group Tags
1. Open **TM Groups** panel in the LocalHub sidebar
2. Find a confirmed group (with cloud/upload icon)
3. Hover over the group — you will see a **🏷️ tag icon** appear on the right side (inline button)
4. Click the **🏷️ tag icon** → LocalHub analyzes all diffs in this group
5. A notification appears: `Suggested tags: bugfix, refactor` + `Suggested name: Fix auth module`
6. Click **"Apply Tags"** to save tags to this group, or **"Cancel"** to skip

After applying, the group description shows tags in brackets: `[bugfix, refactor]`

#### Step 2: Filter Groups by Tag
1. In the **TM Groups** panel header bar, click the **🔍 filter icon**
2. A dropdown appears listing all available tags (collected from all groups)
3. Select a tag (e.g. `bugfix`) → only groups with that tag are shown
4. Other groups are hidden — the panel title shows filtered state

#### Step 3: Clear Tag Filter
1. When a filter is active, an **✖️ close button** appears in the TM Groups header
2. Click it to remove the filter and show all groups again
3. Or use Command Palette: `Ctrl+Shift+P` → `lh: Clear Tag Filter`

#### Step 4: Re-tag All Groups (Bulk)
1. Command Palette: `Ctrl+Shift+P` → `lh: Re-tag All Groups`
2. Confirm the action → LocalHub re-analyzes up to 100 confirmed groups
3. Tags are updated in the database for each group

#### Step 5: Smart Confirm (Auto-tag on Confirm)
1. When confirming a new group, use **Smart Confirm** instead of regular confirm
2. Command: `localhub.confirmGroupSmart` (available via right-click or palette)
3. LocalHub auto-analyzes, suggests a smart name + tags, then confirms

### All 15+ Tag Types:

| Tag | Category | Icon | What triggers it |
|-----|----------|------|-----------------|
| `new-function` | Structure | ➕ | `def`/`function`/`method` added in diff |
| `new-class` | Structure | 🏗️ | `class`/`type`/`interface` added |
| `new-file` | Structure | 📄 | New file appeared in group |
| `new-component` | Structure | 🧩 | React/Vue/Angular component added |
| `new-endpoint` | Structure | 🌐 | API route/endpoint added |
| `refactor` | Change | ♻️ | High ratio of deletions + additions (restructuring) |
| `rename` | Change | ✏️ | Symbols or files renamed |
| `move` | Change | 📦 | Code moved between files |
| `cleanup` | Change | 🧹 | Formatting, whitespace, comments cleanup |
| `bugfix` | Fix | 🐛 | Bug fix patterns (try/catch, null checks, error handling) |
| `hotfix` | Fix | 🔥 | Urgent fix (small change, critical file) |
| `api-change` | Feature | 🌐 | Route/endpoint modifications |
| `ui-change` | Feature | 🎨 | UI/CSS/HTML changes |
| `import-change` | Dependency | 📦 | Import/require statements changed |
| `test` | Meta | 🧪 | Test files modified |
| `docs` | Meta | 📝 | Documentation files changed |
| `config` | Meta | ⚙️ | Config/settings files changed |
| `ai-generated` | AI | 🤖 | AI-generated content detected |

### Tag API Endpoints:

```
GET  /groups/{id}/analyze-tags   — Analyze group diffs, return suggested tags + smart name
POST /groups/{id}/apply-tags     — Save analyzed tags to the database
GET  /tags/all                   — Get all unique tags used across groups
GET  /tags/definitions           — Get all possible tag types with descriptions
POST /tags/retag-all             — Re-analyze tags for all confirmed groups (limit=50)
GET  /groups/with-tags?tag=X     — Get groups filtered by specific tag
POST /groups/{id}/confirm-smart  — Confirm group with auto-tagging
```

---

## 6. Tree Diff (`tree_diff.py`)

Shows full file evolution: v1 -> v2 -> v3 -> ... -> vN — all diffs in one view.

### How to Use Tree Diff (Step by Step):

#### From File History:
1. Open a file in the editor
2. In **File History** panel, hover over any version
3. Click the **🔀 git-compare icon** on the version item
4. Choose how to view:
   - **Show All Diffs (one tab)** — all diffs in a dark-themed WebView with timeline
   - **Show Latest Diff Only** — just the most recent diff in VS Code diff editor
   - **Pick Version Range** — select specific diff to view

#### From Group File:
1. In **TM Groups** panel, expand a group to see its files
2. Click the **🔀 git-compare icon** on a file inside the group
3. Shows only diffs within that group's time period

#### From Pending Changes:
1. In **Pending Changes** panel, hover over a pending file
2. Click the **🔀 git-compare icon**
3. Shows diffs of uncommitted changes since last confirm

#### Compare Two Specific Versions:
1. Open a file, then: Command Palette → `lh: Compare Two Versions`
2. Enter version A (e.g. `5`) and version B (e.g. `12`)
3. Opens VS Code native diff editor side by side

### WebView Features:
- **Dark GitHub-style theme** with syntax-colored diffs
- **Sticky header** with file name, path, total stats (+added, -removed)
- **Timeline navigation** — clickable dots for each version, jump to any diff
- **Hunk display** — `@@ -start,count +start,count @@` headers with context
- **Stats per diff** — `+N -M` for each version transition
- **Up to 50 diffs** displayed at once (performance limit)

### Tree Diff API Endpoints:

```
GET /file/tree-diff              — Full diff chain for a file
    ?path=src/file.ts            — File path (required)
    &from_version=1              — Start version (default: 1)
    &to_version=0                — End version (0 = latest)

GET /groups/{id}/file-tree-diff  — Diffs within a group for one file
    ?path=src/file.ts            — File path
    &include_context=true        — Include context lines

GET /pending/tree-diff           — Diffs of pending changes for a file
    ?path=src/file.ts

GET /file/compare                — Compare two specific versions
    ?path=src/file.ts
    &version_a=5
    &version_b=12
```

---

## 7. Daemon Integration (`daemon_integration.py`)

Bridges new v3 features with the daemon server:

- Registers all new routes (auto_tagger, tree_diff, enhanced groups)
- Runs DB migrations lazily (per-project, on first request)
- Non-fatal loading — if modules are missing, server continues

---

## 8. UI Enhancements

### Toggle Buttons (Groups/Temporal):

| State | Appearance |
|-------|------------|
| **Active** | Colored text + glow border |
| **Inactive** | Opacity 0.3 + line-through text |

### Node Sizes:

| Layout | Node Size Formula | Font |
|--------|-------------------|------|
| Current | `30 + (size/max) * 60` px | 12px |
| Classic | `18 + (size/max) * 40` px | 9px |
| New | `20 + (size/max) * 45` px | 10px |

### Graph Button Fix:

- `#cy.hidden` uses `display: none !important` (not `opacity: 0`)
- On switch back to Graph: `cy.resize(); cy.fit()` recalculates canvas

### Expand Button:

- Rocket icon at top of FILE HISTORY panel
- Opens Features fullscreen tab

---

## 9. Keyboard Shortcuts

| Shortcut | Command | Description |
|----------|---------|-------------|
| (configured in package.json) | `localhub.openFeatures` | Open Features panel |
| (configured in package.json) | `localhub.openGraphFullTab` | Open Graph fullscreen |

---

## 10. File Reference

### TypeScript (src/):

| File | Purpose |
|------|---------|
| `extension.ts` | Main entry, all commands, Features/Graph registration |
| `features-webview-provider.ts` | Features panel: sidebar + fullscreen, 8 analyzer cards |
| `graph-webview-provider.ts` | Graph panel: Cytoscape, 7 layouts, filters, fullscreen |
| `api.ts` | HTTP client with Features/Graph API methods |
| `groups-provider.ts` | Enhanced groups with v3 integration |

### Python (python/):

| File | Purpose |
|------|---------|
| `daemon_server.py` | Multi-project server, route registration |
| `graph_analysis.py` | Classic graph: simple co-change analysis |
| `graph_analyzer.py` | Smart graph: Union-Find, 30s cache, clusters |
| `features_analyzer.py` | 8 analyzers: predictions, heatmap, velocity, etc. |
| `auto_tagger.py` | Automatic tag generation from diffs |
| `tree_diff.py` | Full file evolution diff chain |
| `daemon_integration.py` | v3 route registration and DB migrations |

### Backup Originals (.agent/smart/):

| File | Description |
|------|-------------|
| `graph_webview_provider.ts` | Original smart graph UI (reference copy) |
| `graph-webview-provider.ts` | Original classic graph UI (reference copy) |
| `graph_analyzer.py` | Original smart graph engine (reference copy) |
| `graph_analysis.py` | Original classic graph engine (reference copy) |

---

## 11. Human Tool Manual

If you are documenting LocalHub for end users instead of contributors, jump to:

- [LOCALHUB_VISUAL_TOOLS_GUIDE.md](./LOCALHUB_VISUAL_TOOLS_GUIDE.md)

That guide explains:

- what each tool is for
- which command opens it
- what the user sees on screen
- how to interpret the output
- which backend route powers the tool

---

*LocalHub v3.0 — From version control to visual code intelligence*
