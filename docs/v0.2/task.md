# v0.2 Implementation Checklist: Dynamic Platform

## Phase 1: Foundation (Hybrid Architecture)
- [ ] **Configure Hybrid Build**
    - [ ] Update `next.config.ts` to support hybrid mode (remove global `output: 'export'` restriction or make it conditional).
    - [ ] Verify `/browse` pages still generate statically.
    - [ ] Verify dynamic routes work in `bun dev`.

- [ ] **Database Setup (Supabase)**
    - [ ] Initialize Supabase project.
    - [ ] Enable `pgvector` extension.
    - [ ] Define schema for `users`, `submissions`, `posts`.
    - [ ] Generate TypeScript types from schema.

- [ ] **Authentication**
    - [ ] Install Supabase Auth / Clerk.
    - [ ] Create `/login` and `/dashboard` pages.
    - [ ] Protect dynamic routes.

## Phase 2: AI & Agents (TypeScript)
- [ ] **LangGraph Setup**
    - [ ] Install `@langchain/langgraph` and `@langchain/google-genai`.
    - [ ] Configure Gemini API keys.

- [ ] **Typo Correction Agent**
    - [ ] Design graph: `Receive Input` -> `Check vs Source` -> `Verify Language` -> `Output Decision`.
    - [ ] Implement as Next.js API Route (or Server Action).
    - [ ] Connect to `submissions` table in Supabase.

- [ ] **Semantic Search**
    - [ ] Script to hydrate `pgvector` with existing embeddings (from HuggingFace).
    - [ ] Create search API endpoint using vector similarity.
    - [ ] Build Search UI component.

## Phase 3: Social Features
- [ ] **Markdown Parsing**
    - [ ] Create parser for reference syntax (e.g., `[Quran 2:255]`).
    - [ ] Implement "hover cards" for references.

- [ ] **Posting System**
    - [ ] CRUD for user posts.
    - [ ] Feed view.
