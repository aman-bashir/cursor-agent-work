# cursor-agent-work

Central workspace for Aman Bashir and the AI agent. All project work happens in this single repository. We will not create separate repos for new projects; instead, each project will live in its own subdirectory here.

## Goals and Principles
- Single home for all projects and experiments
- Projects are isolated, self-contained, and reproducible
- Clear, minimal conventions so we can move fast
- Documentation-first: every project has its own README
- No secrets in git; use environment variables with an example file

## Repository Structure
```
/ (repo root)
├─ projects/                # Each project lives in a subfolder here
│  └─ <project-name>/
│     ├─ src/               # Source code (language-specific)
│     ├─ tests/             # Automated tests
│     ├─ README.md          # Project-specific docs (required)
│     ├─ .env.example       # Example environment variables (required if env needed)
│     └─ <manifest>         # e.g., package.json, pyproject.toml, go.mod, etc.
├─ shared/                  # Optional shared libs/assets used by multiple projects
├─ scripts/                 # Automation scripts usable across projects
├─ docs/                    # Cross-cutting docs, design notes, decisions
└─ readme.md                # You are here
```

## Start a New Project
1. Create a new directory under `projects/` using kebab-case: `projects/<project-name>`.
2. Add a `README.md` that explains:
   - What it does and why it exists
   - How to run it locally (commands)
   - How to test it
   - Any deployment or packaging steps (if applicable)
3. Add a manifest for your tech stack (examples):
   - Node: `package.json`
   - Python: `pyproject.toml` or `requirements.txt`
   - Go: `go.mod`
   - Rust: `Cargo.toml`
4. If the project needs configuration, add `.env.example` with safe placeholder values. Do not commit real secrets.
5. Provide run/test scripts (Makefile or package scripts) for a one-command experience.

## Conventions
- Project folder names: kebab-case (e.g., `image-optimizer`, `data-pipeline`)
- Each project is self-contained; do not import files across projects directly
- Reusable code belongs in `shared/` with clear versioning or interfaces
- Pin dependencies when possible to ensure reproducible builds

## Git Workflow
- Default branch is `main` (protected). Work on short-lived branches:
  - `feature/<scope>-<short-desc>`
  - `fix/<scope>-<short-desc>`
  - `chore/<scope>-<short-desc>`
- Prefer Conventional Commits for messages:
  - `feat: add user signup flow`
  - `fix(auth): handle token refresh edge case`
  - `docs(readme): update project setup`
- Open small, focused PRs. Include:
  - What changed and why
  - How to test
  - Any follow-ups or risks

## Environment & Secrets
- Never commit secrets. Use environment variables.
- Provide `.env.example` for each project that needs configuration.
- Use `.gitignore` to exclude local `.env` files and other generated artifacts.

## Tooling (Recommended, optional per project)
- Lint/format: ESLint + Prettier (JS/TS), Ruff/Black (Python), `gofmt`/`golangci-lint` (Go)
- Testing: Jest/Vitest (JS/TS), Pytest (Python), Go test, Cargo test
- Package management: npm/pnpm, uv/pip/poetry, go, cargo
- Task runners: npm scripts / Makefile

## Ownership
- Repository owner: Aman Bashir
- Working agreement: We will do all work in this repository and create each new project inside `projects/`.

## License
Specify a license at the repo root (e.g., MIT) when ready. If omitted, assume all rights reserved until decided.
