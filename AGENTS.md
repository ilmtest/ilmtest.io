# Agent Guidelines

Welcome! Please read these notes before modifying the repository:

- Always search for nested `AGENTS.md` files inside the directories you plan to modify; their guidance overrides this document.
- Use Bun for all package management and scripts. Prefer `bun install`, `bun run build`, and `bun run dev`.
- Keep feature work aligned with the Next.js App Router architecture (see `src/app`). Components default to server components unless `"use client"` is required.
- The project exports a fully static site (`output: 'export'`). Avoid introducing features that require a Node.js server runtime.
- Run `bun run build` before handing work off. For local QA, `bun dev` should boot without warnings.
- When touching UI components inside `src/components`, favour accessible markup (ARIA attributes, keyboard focus) and keep styling Tailwind-first.
- Documentation belongs in Markdown files in the repo root unless a more specific location is required.

Thanks and happy hacking!
