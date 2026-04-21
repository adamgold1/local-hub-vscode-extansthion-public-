# LocalHub Reliability Polish Plan

> Living execution file for safe reliability work.
> Last Updated: 2026-03-22
> Mode: Additive polishing only

---

## 1. Title and Contract

This document is the single source of truth for the LocalHub reliability polish workstream.

### Contract
- Additive polishing only
- No architecture rewrite
- No removal of existing commands, menus, zombie controls, settings, or CLI
- Preserve current external behavior unless the change is explicitly a bug fix
- One reliability risk per patch
- One test gate per phase
- No next phase until current phase is marked passed here

### Protected Behavior
- Branch UI and branch commands stay available
- TM Group UI, checkout flow, and CLI stay available
- Zombie branch and zombie group controls stay available
- Existing daemon architecture stays in place
- Existing stash-based transition model stays in place

---

## 2. Locked Findings

These findings are accepted as the baseline for this work.

| ID | Priority | Finding | Impacted Subsystem | Current Evidence | Target Fix | Status |
|----|----------|---------|--------------------|------------------|------------|--------|
| F1 | P0 | `switchBranch` is non-atomic | Backend transition engine | DB logical state flips before file apply; file errors can be swallowed | Two-phase apply + verify before logical commit | Locked |
| F2 | P0 | `TM Group checkout/head` is non-atomic | Backend TM checkout engine | `_apply_workspace_state()` can partially mutate disk before failure | Two-phase apply + verify + rollback-on-failure | Locked |
| F3 | P2 | Pending guard is bypassed by design | Extension + daemon API | `skip_pending_guard=True` and `allowPending: true` are intentional | Keep current default unless product decision changes later | Locked |
| F4 | P1 | Soft-delete of confirmed groups leaks history back into pending | Group delete / pending semantics | `tm_group_id` can be nulled and later counted as pending | Separate deleted-group history from live pending | Locked |
| F5 | P1 | `branch_id IS NULL` visibility is inconsistent | History, pending, branch state builders | Same snapshots can be visible in one subsystem and absent in another | Adopt one rule and apply it everywhere | Locked |
| F6 | P1 | Watcher suppression gap exists for TM Group checkout | Extension + daemon watcher boundary | Extension quiet window exists, daemon ProjectWatcher does not know TM Group transition state | One shared transition guard across all writers | Locked |
| F7 | P1 | Persistency is not a real recovery model | TM checkout recovery | Detached mode state exists, but no operation journal / recovery phase tracking | Add transition journal and restart recovery rules | Locked |
| F8 | P2 | Low-level snapshot boundary is too permissive | Core snapshot layer | Direct `hub.snapshot_file()` callers can bypass richer daemon ignore logic | Harden ignore floor in low-level snapshot path | Locked |
| F9 | P2 | Silent auto-snapshot error masking is by design | Extension auto snapshots | Automatic snapshot errors stay quiet to avoid UI spam | Keep unless separately revisited | Locked |

### Notes
- F3 and F9 are accepted current design decisions, not immediate product bugs.
- F6 is specifically a TM Group checkout gap; branch switch already has stronger daemon-side suppression.

---

## 3. Reliability Invariants

These rules are non-negotiable.

- No transition may report success before filesystem verify passes.
- Logical state must never say `branch_head` or `group_detached` while disk is in another state.
- Deleted, zombie, or historical group data must never silently reappear as user pending.
- LocalHub-generated filesystem operations must not be recorded as user changes.
- In-progress transition after restart must be recoverable or explicitly marked failed.
- No `except: pass` is allowed in destructive transition paths.
- A failed transition must leave either:
  - the original workspace state intact, or
  - a deterministic rollback path recorded in the transition journal.

### Acceptance Checklist Template
- [ ] Logical state change happens only after apply + verify
- [ ] No silent partial success
- [ ] No LocalHub-generated watcher noise becomes pending
- [ ] Restart during in-progress transition is recoverable
- [ ] Existing UI/CLI surface remains available
- [ ] No unrelated behavior regression observed in fixture project

---

## 4. Phase Tracker

### Status Legend
- `Not Started`
- `In Progress`
- `Blocked`
- `Passed`
- `Failed`

| Phase | Name | Status | Patch Rule | Stop/Go Gate |
|-------|------|--------|------------|--------------|
| 0 | Planning scaffold | Passed | Docs only | File created, checklist template added, tests table added |
| 1 | Atomic `switchBranch` | Passed | Code patch only for branch switch | Branch switch fixture passes |
| 2 | Atomic `TM Group checkout/head` | Passed | Code patch only for TM checkout/head | TM checkout fixture passes |
| 3 | Transition journal + recovery | Passed | Add journal/recovery only | Restart recovery scenarios pass |
| 4 | Shared transition guard for all writers | Passed | Suppression sync only | No LocalHub-generated transition noise becomes pending |
| 5 | Soft-delete / pending separation | Passed | Pending semantics only | Deleted confirmed groups no longer leak into pending |
| 6 | Unify branch visibility semantics | Not Started | Query/state builder consistency only | History/pending/branch state agree |
| 7 | Harden low-level snapshot boundary | Not Started | Snapshot ignore floor only | Machine-noise paths no longer enter user pending |

### Phase 0 — Planning scaffold
Scope:
- Create this file
- Add acceptance checklist template
- Add completed tests table
- Add manual test section

Constraints:
- Docs only
- No code changes

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes: Initial living plan created

### Phase 1 — Atomic `switchBranch`
Target:
- Make `switchBranch` two-phase and verify before logical commit
- Remove silent file-operation success
- Ensure branch active state flips only after successful apply/verify

Must not change:
- Branch UI
- Branch commands
- Stash concept
- Zombie branch behavior

Done criteria:
- Failed switch leaves logical state unchanged
- Failed switch does not leave partial workspace silently marked as success

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - `switchBranch` now applies filesystem changes before logical branch activation
  - added explicit verify step for changed paths
  - removed silent success from branch transition file operations
  - added rollback path on apply failure, verify failure, and logical commit failure

### Phase 2 — Atomic `TM Group checkout/head`
Target:
- Apply the same transition pattern to:
  - `checkoutGroup`
  - `returnToBranchHead`
- No success before verify
- No silent partial apply
- Rollback on apply/verify failure

Must not change:
- Existing checkout commands
- Detached mode UX
- TM Group menus
- CLI commands

Done criteria:
- Checkout/head cannot leave workspace half-applied while returning `ok: true`

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - `checkoutGroup` now applies filesystem changes before detached-state commit
  - `returnToBranchHead` now applies filesystem changes before checkout-state clear
  - added explicit verify step for TM Group checkout/head transitions
  - added rollback path on apply failure, verify failure, and logical commit failure

### Phase 3 — Transition journal + recovery
Target:
- Add `.localhub/transition_state.json`
- Persist operation phase for:
  - branch switch
  - group checkout
  - clear checkout
- Recover or rollback after daemon restart

Must not change:
- Normal steady-state behavior
- Current `group_checkout_state.json` role as detached/head marker

Done criteria:
- Restart during transition never silently falls back to fake clean state

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - added `.localhub/transition_state.json` as an in-progress transition journal
  - journal now tracks `prepare -> apply_files -> verify -> commit_state -> cleanup`
  - daemon startup now attempts deterministic recovery for incomplete transitions
  - pre-commit transitions roll back to source state; post-commit transitions finalize target logical state

### Phase 4 — Shared transition guard for all writers
Target:
- Synchronize suppression across:
  - extension smart triggers
  - extension file watcher
  - daemon project watcher
  - daemon snapshot endpoints
- Use one backend-owned transition guard
- Keep extension quiet window as secondary mirror only

Must not change:
- User save behavior
- Intentional manual snapshots

Done criteria:
- No LocalHub-generated checkout/switch noise becomes pending

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - transition suppression is now enforced in backend core snapshot/delete paths
  - daemon snapshot endpoints and ProjectWatcher now consult the same backend-owned transition guard
  - extension quiet window remains as a secondary defensive layer and now also covers branch switch auto-save noise

### Phase 5 — Soft-delete / pending separation
Target:
- Stop deleted TM Group history from reappearing as pending
- Keep current restore behavior working
- Use additive compatibility logic for legacy data

Must not change:
- User-visible delete/restore commands
- Zombie group controls
- Old restored data semantics

Done criteria:
- Deleting a confirmed group with kept snapshots does not increase pending

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - new soft-delete with `keep snapshots` now leaves snapshots attached to the deleted TM Group instead of releasing them into live pending
  - pending and confirm queries now explicitly exclude legacy snapshot ids tracked by `group_trash_links`
  - restore keeps working for both new deleted groups and legacy unlinked deleted-group data

### Phase 6 — Unify branch visibility semantics
Target:
- Define one rule for `branch_id IS NULL`
- Apply it consistently to:
  - history
  - pending
  - branch-head state
  - group state builders where relevant

Must not change:
- Branch feature model
- Snapshot storage model

Done criteria:
- The same snapshot is not visible in one subsystem and invisible in another by accident

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - branch-head state builder now uses the same effective branch snapshot view as history and pending
  - branch file content lookup now resolves through the same branch+legacy-NULL visibility rule
  - branch export now uses the same effective branch snapshot view, so exported contents match visible history

### Phase 7 — Harden low-level snapshot boundary
Target:
- Move ignore floor into low-level snapshot path
- Ensure direct callers of `hub.snapshot_file()` cannot bypass core noise filtering

Must not change:
- Legitimate user file tracking
- `.localhubignore` override capability

Done criteria:
- Caches, blobs, models, locks, logs, and `.localhub` internals cannot become user pending through alternate call paths

Result:
- Status: `Passed`
- Date: `2026-03-22`
- Notes:
  - low-level `snapshot_file()` and `record_deletion()` now respect the same ignore floor concept instead of relying only on daemon routes
  - direct callers now honor default exclude directories plus `.localhubignore` / `.lhignore` patterns
  - existing low-level `.env` exclusion was preserved to avoid widening tracking behavior

---

## 5. Automated Test Ledger

Use these fixture projects:
- `fixture_branch_switch`
- `fixture_tm_group_checkout`

### Completed Tests

| Date | Phase | Fixture | Test | Expected | Actual | Status | Notes |
|------|-------|---------|------|----------|--------|--------|-------|
| 2026-03-22 | 0 | N/A | Plan scaffold created | File exists with phases, invariants, test tables | File created | Passed | Docs only |
| 2026-03-22 | 1 | `fixture_branch_switch` | Successful branch switch (`python -` temporary fixture script) | Switch succeeds, verify passes, active branch updates after apply | Passed with `verified_paths=3` in both directions | Passed | Also exercised stash restore path |
| 2026-03-22 | 1 | `fixture_branch_switch` | Failed branch switch during hide (`python -` temporary fixture script with forced `shutil.move` failure) | Switch fails, branch stays on source, workspace stays in source state | Failure returned, rollback succeeded, active branch unchanged | Passed | No false success returned |
| 2026-03-22 | 1 | `fixture_branch_switch` | Failed branch switch during restore (`python -` temporary fixture script with forced `restore()` failure) | Switch fails, branch stays on source, workspace stays in source state | Failure returned, rollback succeeded, active branch unchanged | Passed | No partial switched state remained |
| 2026-03-22 | 2 | `fixture_tm_group_checkout` | Successful TM Group checkout and return to head (`python -` temporary fixture script) | Checkout succeeds, detached state matches group, return restores branch head | Passed with `verified_paths=3` for checkout and head | Passed | Active branch stayed stable while logical detached/head state changed only after verify |
| 2026-03-22 | 2 | `fixture_tm_group_checkout` | TM Group checkout fails during apply (`python -` temporary fixture script with forced `shutil.move` failure) | Checkout fails, workspace stays at branch head, rollback succeeds | Failure returned, rollback succeeded, checkout state stayed `branch_head` | Passed | No false detached success returned |
| 2026-03-22 | 2 | `fixture_tm_group_checkout` | Return to branch head fails during apply (`python -` temporary fixture script with forced `restore()` failure) | Return fails, workspace stays detached, rollback succeeds | Failure returned, rollback succeeded, checkout state stayed `group_detached` | Passed | No false return-to-head success returned |
| 2026-03-22 | 3 | `fixture_tm_group_checkout` | Restart during incomplete TM Group checkout before logical commit (`python -` temporary fixture script) | Startup recovery rolls workspace back to source branch head and clears journal | Passed, status returned to `branch_head`, journal removed | Passed | Disk returned to source state on restart |
| 2026-03-22 | 3 | `fixture_branch_switch` | Restart during incomplete branch switch after file apply / before cleanup (`python -` temporary fixture script) | Startup recovery finalizes target branch logical state and clears journal | Passed, active branch finalized to target, journal removed | Passed | Disk and logical branch state matched after restart |
| 2026-03-22 | 4 | `fixture_tm_group_checkout` | Transition guard suppresses automatic reasons during system transition (`python -` temporary fixture script) | `tab_focus`, `watcher:*`, `auto:save`, and delete marker are ignored while transition guard is active; manual snapshot still works | Passed, automatic reasons produced no pending; manual snapshot still produced one pending file | Passed | Validated backend-authoritative suppression without changing user manual snapshot behavior |
| 2026-03-22 | 5 | `fixture_tm_group_checkout` | Soft-delete confirmed group with kept snapshots (`python -` temporary fixture script) | Deleting the group does not create pending, restoring it keeps pending clean | Passed, pending stayed empty after delete and after restore | Passed | New keep-delete flow no longer leaks history into live pending |
| 2026-03-22 | 5 | `fixture_tm_group_checkout` | Legacy deleted-group compatibility (`python -` temporary fixture script) | Old unlinked deleted-group snapshots are excluded from pending and can be restored cleanly | Passed, pending stayed empty and restore relinked legacy snapshots | Passed | Additive compatibility path works for historical data |
| 2026-03-22 | 6 | `fixture_branch_switch` | `branch_id IS NULL` consistency (`python -` temporary fixture script) | History, branch-head state, branch file content, and branch export all resolve the same legacy-NULL snapshot | Passed, all four views returned the same `legacy.txt` snapshot for a non-active feature branch | Passed | Verified on Windows with normalized absolute path comparison |
| 2026-03-22 | 7 | `fixture_tm_group_checkout` | Low-level snapshot boundary respects ignore floor (`python -` temporary fixture script) | Direct `hub.snapshot_file()` / `hub.record_deletion()` ignore default-excluded and `.localhubignore` paths, while normal source files still track | Passed, only `src/main.py` reached pending; ignored log/model/lock/build/.localhub/.env paths produced no low-level snapshots or deletion markers | Passed | Confirms direct callers no longer bypass the ignore boundary |
| 2026-03-22 | Final smoke | `fixture_branch_switch` + `fixture_tm_group_checkout` | End-to-end happy path (`python -` temporary fixture script) | Branch switch main↔feature and TM Group checkout/head both work on the final codebase | Passed, branch switch succeeded in both directions and checkout/head restored `app.py` between `v1` and `v2` as expected | Passed | Final automated sanity pass after all phases |

### Pending Automated Scenarios

| Phase | Fixture | Scenario | Exact Command / Test Hook | Expected Result | Status |
|-------|---------|----------|----------------------------|-----------------|--------|
| 1 | `fixture_branch_switch` | Successful branch switch | Inline temporary fixture via `python -` | Branch switch completes, verify passes, logical state flips after apply | Passed |
| 1 | `fixture_branch_switch` | Branch switch fails during hide | Inline temporary fixture via `python -` + forced `shutil.move` failure | No logical state flip, no silent partial success | Passed |
| 1 | `fixture_branch_switch` | Branch switch fails during restore | Inline temporary fixture via `python -` + forced `restore()` failure | No logical state flip, rollback or unchanged workspace | Passed |
| 2 | `fixture_tm_group_checkout` | Successful TM Group checkout | Inline temporary fixture via `python -` | Detached state and disk match target group | Passed |
| 2 | `fixture_tm_group_checkout` | Successful return to branch head | Inline temporary fixture via `python -` | Head state and disk match branch head | Passed |
| 2 | `fixture_tm_group_checkout` | TM Group checkout fails during apply | Inline temporary fixture via `python -` + forced `shutil.move` failure | No false success, rollback or unchanged workspace | Passed |
| 2 | `fixture_tm_group_checkout` | Return to branch head fails during apply | Inline temporary fixture via `python -` + forced `restore()` failure | No false success, rollback or unchanged workspace | Passed |
| 3 | `fixture_tm_group_checkout` | Restart during in-progress transition | Inline temporary fixture via `python -` with simulated incomplete journal phases | Recovery or explicit failed state, never fake clean state | Passed |
| 5 | `fixture_tm_group_checkout` | Soft-delete group with kept snapshots | Inline temporary fixture via `python -` | No new pending leak | Passed |
| 5 | `fixture_tm_group_checkout` | Legacy deleted-group compatibility | Inline temporary fixture via `python -` with simulated legacy rows | Old restore behavior still works, pending excludes legacy artifacts | Passed |
| 6 | `fixture_branch_switch` | `branch_id IS NULL` consistency | Inline temporary fixture via `python -` | Same visibility rule everywhere | Passed |
| 4 | `fixture_tm_group_checkout` | Watcher quiet during transition | Inline temporary fixture via `python -` with automatic reasons under active transition guard | No LocalHub-generated pending noise | Passed |
| 7 | `fixture_tm_group_checkout` | Low-level snapshot boundary respects ignore floor | Inline temporary fixture via `python -` with `.localhubignore`, default-excluded dirs, and direct `hub.snapshot_file()/record_deletion()` calls | Direct callers cannot bypass ignore floor; normal source file still tracks | Passed |

### Automated Test Recording Rules
- Record the exact command or script used for each completed scenario.
- Record expected and actual results in plain language.
- Mark `Passed` only after compile/type checks and scenario checks both pass.
- If a phase patch fails, add a rollback note before starting any other phase.

---

## 6. Manual Test Checklist

These manual tests must be rerun after each affected phase.

| Test | Project | Status | Notes | Screenshot / Log Ref |
|------|---------|--------|-------|----------------------|
| Branch switch with open tabs | `fixture_branch_switch` | Not Run | Confirm no false pending/deleted noise | |
| TM Group checkout with open tabs | `fixture_tm_group_checkout` | Not Run | Confirm no false pending/deleted/created noise | |
| Return to branch head | `fixture_tm_group_checkout` | Not Run | Confirm workspace fully restored | |
| Zombie group delete/restore | `fixture_tm_group_checkout` | Not Run | Confirm no pending leakage | |
| Delete confirmed group with kept snapshots | `fixture_tm_group_checkout` | Not Run | Confirm deleted history does not reappear as pending | |
| Restart daemon mid-transition | `fixture_tm_group_checkout` | Not Run | Confirm recovery or explicit failed state | |
| No mass noise during system transitions | `fixture_tm_group_checkout` | Not Run | Watch LocalHub + daemon logs + pending panel | |

### Step-by-Step Manual Procedures

#### A. Branch switch with open tabs
1. Open 2–3 tracked files in editors
2. Make sure tabs are saved
3. Switch branch via UI or CLI
4. Verify:
   - branch actually changes
   - expected files appear/disappear
   - no mass false `pending/deleted/created`
   - no mismatch between UI state and disk state

#### B. TM Group checkout with open tabs
1. Open 2–3 tracked files in editors
2. Make sure tabs are saved
3. Run `Checkout TM Group`
4. Verify:
   - detached banner/status is correct
   - workspace matches target group
   - no transition noise appears in pending

#### C. Return to branch head
1. Start from detached TM Group mode
2. Run `Return To Branch Head`
3. Verify:
   - workspace returns to branch head
   - detached state clears
   - no partial file tree remains

#### D. Zombie group delete/restore
1. Delete a confirmed TM Group into zombie
2. Restore it
3. Verify:
   - group remains restorable
   - no historical snapshots become user pending

#### E. Restart daemon mid-transition
1. Start a branch switch or TM Group checkout
2. Interrupt daemon during the operation
3. Restart daemon
4. Verify:
   - system recovers or explicitly reports recoverable failure
   - it never silently claims clean head state while disk is mismatched

---

## 7. Execution Rules

- First patch is docs only: this file
- Every later phase is a separate patch
- After each code phase:
  - run compile/type checks
  - run the phase-specific fixture tests
  - update this file with results
- Do not begin the next phase until current phase is marked `Passed`
- If a phase fails:
  - add rollback notes here first
  - stop and stabilize before touching another subsystem

### Patch Discipline
- One subsystem risk per patch
- No mixed reliability patches
- No opportunistic refactors during this workstream
- No file rewrites for small fixes

### Rollback Notes

| Date | Phase | Patch / Change | Trigger for Rollback | Rollback Result | Notes |
|------|-------|----------------|----------------------|-----------------|-------|
| — | — | — | — | — | No rollback entries yet |

---

## 8. Assumptions and Defaults

- This file is the living checklist and progress ledger for reliability polish.
- No behavior-level redesign is allowed in this workstream.
- Existing commands, menus, settings, CLI, zombie controls, and daemon architecture remain in place.
- Pending-allowed behavior for `TM Group checkout/head` stays as-is unless explicitly revisited later as a separate product decision.
- Extension and daemon may both keep defensive suppression layers, but backend state must be authoritative.

---

## 9. Next Allowed Step

All planned reliability polish phases (`0-7`) are complete.

If follow-up work starts, it must be treated as a new workstream with its own:
- target files
- preserved behavior contract
- acceptance checks
- rollback trigger
