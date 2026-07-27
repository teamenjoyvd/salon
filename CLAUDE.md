# CLAUDE.md — agentic
> Reference: `N/A` (read on demand during GATHER by section only)

---

## Constants
| Repo | `teamenjoyvd/salon` | Branch | `master` |
|---|---|---|---|
| Supabase | `N/A` | Prod URL | `N/A` |

Never ask the user to confirm these.

---

## ID & Branch Formats
- Canonical unique ID: `[YYMM]-DEV-[GH#]` (e.g. `2605-DEV-1` for GitHub issue #1 created in May 2026).
- Format matches: Issue title `[ID] description` · Commit `[ID] description`. No branch, no PR — commits land on `master`.
- **Rule:** Never infer or increment issue IDs. Always create the GitHub issue first and read the ID from the response.

---

## GitHub Issue Labels
- `feat` (New functionality) · `bug` (Something broken) · `chore` (Infrastructure, refactor)
- `priority:high` (High priority) · `priority:low` (Low priority) · `blocked` (Unresolved dependency - do not pick)
- Read sequence: High first, then unlabeled, then Low.

---

## Hard Constraints
- **Trunk-Based:** Commit and push **directly to `master`**. Do **NOT** open pull requests, and do **NOT** create `dev/[ID]` branches for ordinary work. `master` is the default branch and is intentionally unprotected.
- **No PR Review Bots:** CodeRabbit is disabled repo-wide via `.coderabbit.yaml`. Do not re-enable it or add other PR review automation.
- **Workflow Isolation:** SSU, PLAN, CLAIM, and BUILD are mutually exclusive. PLAN does no writes. CLAIM does no file writes. BUILD does no design work.
- **File Restrictions:** **NEVER** create `middleware.ts`. Auth lives in `proxy.ts`.
- **Claim Gate:** **NEVER** call `create_or_update_file` or `push_files` before CLAIM is complete.
- **DB & Auth Security:** **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client. **NEVER** bypass Clerk auth on protected routes.
- **Verification Gate:** **NEVER** mark Done on static analysis alone. The Vercel deployment for the pushed `master` commit must be READY and CI green.
- **Agent Coexistence:** Antigravity and Claude.ai must not conflict. Claude reads `implementation_plan.md` in the brain directory if it exists to synchronize state; Antigravity formats its plan to match PLAN output.
- **Technical Guidelines:** Detailed rules on RLS helpers, Clerk edge proxying, 390px mobile-first responsive styling, the Dual Layout Law, and co-location live in **`docs/ai/RULES.md`** and **`.cursor/rules/`**.

---

## Commands

### SSU — System Startup
Run at the start of every session to warm up and establish ground truth.

1. **Warm-up:** Verify GitHub connection by reading `CLAUDE.md` and listing open issues. (If GitHub is offline, STOP).
2. **Handoff check:**
   - **Unpushed work on `master`:** Read the latest commit to resume in-flight work.
   - **CLAIM-complete issue:** Ready for SHAPE.
   - **Nothing in flight:** Ready to pick the next highest priority issue.
   - **Antigravity Check:** If running as Antigravity, verify `implementation_plan.md`/`task.md` in `C:\Users\fefence\.gemini\antigravity\brain\43df2aa7-2363-43af-a9ea-7c68fe1aaecd` to synchronize state.

**SSU Output Format:**
```
| GitHub    | ✅/❌ |
| In flight | [ID] <title> / None |
| Handoff   | IN PROGRESS: <next action> / CLAIM-complete / Clean |
| Commands  | SSU · PLAN · CLAIM · BUILD · GCR |
```

### PLAN · CLAIM · BUILD · GCR
- **PLAN:** Read-only design. Produces a DoD, affected files, and gotchas. See `docs/ai/PLAN.md`.
- **CLAIM:** Issue scaffolding. Creates the GitHub issue only — no branch. See `docs/ai/CLAIM.md`.
- **BUILD:** Default execution mode against a CLAIM-complete issue. See `docs/ai/BUILD.md`.
- **GCR:** Address Gemini Code Review. See `docs/ai/GCR.md`.

---

## CLAIM-Complete Definition
An issue is CLAIM-complete (ready for BUILD) when its body contains:
```markdown
## Design Checklist
- [x] DoD defined (specific, file-path-level)
- [x] Affected files listed by path
- [x] Gotchas flagged against docs/ai/GOTCHAS.md
- [x] Blocking unknowns: none
```
BUILD verifies this section at startup. If missing, it refuses to proceed.

---

## Gotchas
See `docs/ai/GOTCHAS.md`. Read in full during SHAPE and GATHER.
