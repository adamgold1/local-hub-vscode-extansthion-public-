# Shadow Sandboxes

> Human-facing LocalHub module documentation for isolated AI and reviewer workflows.

## What It Is

Shadow Sandboxes give LocalHub a safe parallel workspace model:

- each sandbox has its own LocalHub branch: `sandbox/<name>`
- each sandbox has a physical file copy in `.localhub/sandboxes/<name>/`
- sandbox files are auto-snapshotted by the daemon as a separate LocalHub project
- the main project is untouched until a human performs `merge`

This is not a fake preview mode. It is a real isolated working area with:

- `create`
- `status`
- `diff`
- `checkout`
- `return`
- `merge`
- `destroy`
- `ghost cleanup`
- `emergency reset`

## Why It Exists

Normal branch workflows are good for code history.
They are not enough when an AI agent needs a real writable workspace that must not damage the live project.

Shadow Sandboxes solve that by separating:

- the source branch
- the sandbox branch
- the sandbox disk copy
- the human review / merge step

## Runtime Modules

- [sandbox_manager.py](../python/sand_boxe/sandbox_manager.py)
- [sandbox_guard.py](../python/sand_boxe/sandbox_guard.py)
- [localhub_mcp_server.py](../python/sand_boxe/localhub_mcp_server.py)

Reference notes remain in:

- [python/sand_boxe/integration_notes](../python/sand_boxe/integration_notes/README.md)

## Lifecycle

1. Create sandbox from the currently active LocalHub branch.
2. Work inside the sandbox copy.
3. Inspect sandbox status or diff.
4. Checkout sandbox if a human wants to inspect it in the main editor.
5. Return back to the source branch.
6. Merge sandbox into the source branch.
7. Optionally destroy sandbox.

## Current LocalHub UI Integration

The feature is intentionally guarded by a toggle:

- VS Code setting: `localhub.sandbox.enabled`
- Branches toolbar:
  - `Enable Shadow Sandboxes`
  - `Disable Shadow Sandboxes`
  - `Create Shadow Sandbox`
  - `Manage Shadow Sandboxes`
- Settings panel:
  - `Shadow Sandboxes` card
- Control Center:
  - `Enable shadow sandboxes`

When the toggle is OFF, the normal branch workflow stays unchanged.

## Storage Layout

```text
project/
├── .localhub/
│   ├── localhub.db
│   ├── sandbox_registry.json
│   └── sandboxes/
│       ├── review_auth_fix/
│       └── agent_refactor_1/
└── src/
```

## Main API

Sandbox endpoints are mounted in the daemon under `/lh/sandboxes`.

Core routes:

- `POST /lh/sandboxes/create`
- `GET /lh/sandboxes/list`
- `GET /lh/sandboxes/{name}/status`
- `GET /lh/sandboxes/{name}/files`
- `GET /lh/sandboxes/{name}/diff`
- `POST /lh/sandboxes/{name}/checkout`
- `POST /lh/sandboxes/{name}/return`
- `POST /lh/sandboxes/{name}/merge`
- `DELETE /lh/sandboxes/{name}`
- `POST /lh/sandboxes/health/cleanup`
- `POST /lh/sandboxes/health/emergency_reset`

See also:

- [API_REFERENCE.md](./API_REFERENCE.md)
- [UNIVERSAL_MCP.md](./UNIVERSAL_MCP.md)

## Relationship With MCP

Shadow Sandboxes are the safe execution model.
Universal MCP is the agent-facing transport that exposes this model to external tools.

In practice:

- sandbox = isolated workspace and lifecycle
- MCP = standard way for agents to call sandbox tools

## Safe Defaults

- sandbox UI is OFF by default
- branch flow remains intact when sandbox toggle is disabled
- `mcp.json` bootstrap does not overwrite an existing file unless explicitly requested

## Recommended Next Tests

1. Enable shadow sandboxes in the Branches panel.
2. Create a sandbox from `main`.
3. Modify files inside the sandbox.
4. Open `Manage Shadow Sandboxes` and inspect `Status` and `Diff`.
5. Checkout sandbox, then return.
6. Merge sandbox back into source branch.
7. Destroy sandbox and verify branch/zombie behavior still works.
