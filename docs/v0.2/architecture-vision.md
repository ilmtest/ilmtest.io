# Architecture Vision: Evolving IlmTest.io

## The Vision
The goal is to evolve IlmTest from a static reference site into a dynamic, AI-powered platform for Islamic knowledge. Key features include:
1.  **Community Corrections**: Users suggest fixes -> AI Agent (LangGraph) verifies -> Human approval.
2.  **AI Semantic Search**: Vector-based lookups using existing embeddings (Gemini).
3.  **Social Knowledge Sharing**: Users post content referencing specific verses/hadith via markdown links.

## Architectural Options

### Option 1: Unified Next.js Monolith (Recommended)
**Concept**: Leverage Next.js as a full-stack framework. Keep the current static optimization for content (`output: 'export'` for public pages) but add dynamic API routes or Server Actions for authenticated features.

*   **Frontend**: React/Next.js (Existing).
*   **Backend**: Next.js API Routes / Server Actions (Node.js runtime).
*   **Database**: Postgres (Supabase/Neon) for user data, submissions, and social posts.
*   **AI/Vectors**: 
    *   Use `pgvector` in Postgres for embeddings.
    *   Call AI Agents (LangGraph) via API routes (or a separate Python worker if heavy).

**Pros:**
*   **Single Codebase**: Shared types, utilities, and deployment pipeline.
*   **Seamless Integration**: Easy to mix static (browse) and dynamic (social) pages.
*   **Performance**: Can still statically export the "Browse" section while using SSR/CSR for "Social".
*   **Deployment**: Vercel/Cloudflare support this hybrid model out of the box.

**Cons:**
*   **Heavy Compute**: Running complex LangGraph agents in Node.js serverless functions might be tricky (timeouts). Might need a separate worker for long-running AI tasks.

**Migration Path:**
1.  Remove `output: 'export'` (or keep it conditional) to enable API routes.
2.  Integrate a database (e.g., Supabase).
3.  Build Auth (Clerk/Supabase Auth).
4.  Implement API routes for submissions.

### Option 2: Micro-frontends / Microservices
**Concept**: Keep the current site purely static. Build a completely separate backend API and potentially separate frontends for "Social" or "Admin".

*   **Frontend**: Current Repo (Static).
*   **Backend API**: Python (FastAPI) or Node (NestJS) hosted separately (e.g., Railway/Render).
*   **AI Service**: Dedicated Python service for LangGraph/Embeddings.

**Pros:**
*   **Best Tool for Job**: Python is native for LangGraph and AI orchestration.
*   **Decoupling**: The reading experience remains 100% static and unhackable.
*   **Scale**: Scale the AI worker independently of the web server.

**Cons:**
*   **Complexity**: Two repos, two deployments, CORS issues, duplicated types.
*   **Fragmented UX**: Harder to share state (e.g., "Logged in" status) between the static site and the dynamic app without complex auth flows (JWT sharing).

**Migration Path:**
1.  Leave current repo as is.
2.  Spin up a new repo for the API.
3.  Update current frontend to fetch from that API for dynamic features.

### Option 3: Serverless / Edge Hybrid
**Concept**: Use Cloudflare ecosystem. Keep site on Cloudflare Pages. Use Cloudflare Workers for API and D1 (SQLite) or Vectorize for data.

*   **Frontend**: Next.js (Static).
*   **Backend**: Cloudflare Workers (Edge).
*   **Database**: Cloudflare D1 + Vectorize.

**Pros:**
*   **Global Latency**: Extremely fast, runs on the edge.
*   **Cost**: Very cheap for high volume.
*   **Integrated**: Vector search is native to the platform.

**Cons:**
*   **Ecosystem Limits**: Node.js compatibility in Workers is improving but not 100%. Running heavy AI libraries might be hard.
*   **Vendor Lock-in**: Heavily tied to Cloudflare specific APIs.

## Recommendation
**Start with Option 1 (Unified Next.js)**, but offload the **heavy AI Agent work** to a separate Python microservice (or serverless function) if needed.

**Why?**
*   Next.js is already set up.
*   You want to "mix" features (e.g., link to a hadith in a social post). This is easiest when they share the same domain and routing system.
*   You can use **Supabase** for the database + **pgvector** for the AI lookups, which integrates perfectly with Next.js.
*   For the **LangGraph** typo checker: If it's complex, build a small Python API just for that, but call it from your Next.js backend. This gives you the "Monolith" DX with the "Microservice" power where strictly necessary.

## Proposed Stack for Vision
1.  **App**: Next.js (Hybrid Static/Dynamic).
2.  **DB**: Supabase (Postgres + Auth + pgvector).
3.  **AI**: 
    *   **Lookups**: Embeddings stored in pgvector.
    *   **Agents**: Python function (deployed on Vercel/Railway) called by Next.js API.
