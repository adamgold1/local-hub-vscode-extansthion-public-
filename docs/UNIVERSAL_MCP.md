# Universal MCP

> Standard Model Context Protocol integration for LocalHub and Shadow Sandboxes.

## Goal

Universal MCP means one project-level MCP entry point that external AI tools can consume without custom LocalHub glue per agent.

The current design uses a standard `.vscode/mcp.json` bootstrap file and the existing runtime:

- [localhub_mcp_server.py](../python/sand_boxe/localhub_mcp_server.py)

## Why This Design

Right now the safest universal path is:

- generate a project-local `.vscode/mcp.json`
- point it to the LocalHub MCP runtime via standard `command + args + env`
- keep daemon and MCP loosely coupled

This avoids forcing a new MCP transport directly into the daemon before that transport is fully tested in your environment.

## What Gets Bootstrapped

The generated `.vscode/mcp.json` uses:

- `servers.localhub`: current VS Code workspace MCP format
- `mcpServers.localhub`: legacy compatibility key kept for older readers
- `command`: current Python executable
- `args`: `python/sand_boxe/localhub_mcp_server.py --transport stdio`
- `env.LOCALHUB_URL`: current daemon URL
- `env.LOCALHUB_PROJECT_ROOT`: current LocalHub project root

That makes the config project-scoped and client-agnostic.

## Bootstrap Behavior

LocalHub now supports project-level MCP bootstrap:

- auto-bootstrap on `POST /init` if `.vscode/mcp.json` does not exist yet
- manual status/read:
  - `GET /mcp/config`
- manual create/update:
  - `POST /mcp/bootstrap`
- manual disconnect/remove:
  - `DELETE /mcp/bootstrap`

## Endpoints

### Get Effective MCP Config

```http
GET /mcp/config
```

Response includes:

- `project_root`
- `path`
- `exists`
- `config`

### Create Or Refresh `.vscode/mcp.json`

```http
POST /mcp/bootstrap?overwrite=false
```

Use `overwrite=true` only when you intentionally want LocalHub to rewrite an existing MCP file.

### Remove `.vscode/mcp.json`

```http
DELETE /mcp/bootstrap
```

This is the current “disconnect” action.

## Supported Agent Pattern

Because the config is standard MCP JSON, the same project can be attached to clients that understand MCP server definitions.

Typical targets:

- Claude Code
- Claude Desktop
- Cursor
- Windsurf
- other MCP-capable clients

## Runtime Requirements

The MCP runtime file depends on Python MCP libraries.

Typical requirement:

```bash
pip install "mcp[cli]" httpx
```

## Tool Surface

Current MCP server exposes:

- sandbox lifecycle tools
- sandbox file read/write/delete
- LocalHub status/history/branches/pending
- sandbox cleanup / emergency reset
- resource endpoints for status, branches, pending, sandboxes
- reusable prompts for:
  - starting a shadow sandbox task
  - reviewing a sandbox before merge
  - recovering a broken sandbox state

## Compatibility

Automatic project bootstrap is currently aimed at VS Code workspace MCP via `.vscode/mcp.json`.

The runtime itself is still useful for other MCP-capable clients because it supports:

- `stdio` transport
- `streamable-http`
- `sse`

But non-VS Code clients may still need their own client-side MCP registration flow.

## Relation To Shadow Sandboxes

Universal MCP is not a separate sandbox system.
It is the agent transport over the same sandbox runtime and same daemon-backed project state.

Use the sandbox docs for workflow:

- [SHADOW_SANDBOXES.md](./SHADOW_SANDBOXES.md)

## Recommended Test Flow

1. Run LocalHub daemon normally.
2. Initialize project with `lh init` or `POST /init`.
3. Verify `.vscode/mcp.json` exists.
4. Open `GET /mcp/config` and confirm `LOCALHUB_PROJECT_ROOT`.
5. Connect an MCP-capable client.
6. Create sandbox through MCP.
7. Read/write files only inside the sandbox.
8. Diff and merge through LocalHub review flow.
