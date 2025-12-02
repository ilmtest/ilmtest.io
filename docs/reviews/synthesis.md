# Architecture Review Synthesis

**Date:** December 2, 2025
**Status:** Planning Phase

## Summary of Feedback

We received reviews from Claude, Gemini, Grok, and the Lead Developer (User). The consensus is that the **Chunking + Consolidated Index** architecture is solid for a static site, but requires specific refinements in **Type Safety**, **Index Size Optimization**, and **Client-Side Performance** before implementation.

---

## 1. Data Structure & Indexing

| Suggestion | Source | Decision | Rationale |
| :--- | :--- | :--- | :--- |
| **Remove `ids` map from GlobalIndex** | Claude, Grok | **AGREE** | The `ids` map is the largest part (~400KB) and is redundant for initial load. We will move it to a separate lazy-loaded file or calculate it deterministically where possible. |
| **Split Index (Core vs Pages)** | Grok, Gemini | **DEFER** | We will start by removing `ids`. If `indexes.json` is still >500KB, we will split `pages`. |
| **Add `version` to Index** | Claude | **AGREE** | Essential for cache busting and ensuring client-side logic matches data structure version. |
| **Separate TOC (`toc.json`)** | Claude | **AGREE** | `headings.json` is too large (~150KB) for just listing chapters. We need a lightweight `toc.json` for the book detail page. |

## 2. Type Safety & Code Quality

| Suggestion | Source | Decision | Rationale |
| :--- | :--- | :--- | :--- |
| **Discriminated Unions for `Excerpt`** | Claude, Grok | **AGREE** | `meta` field should be strictly typed based on `type`. |
| **Refactor `Heading` Types** | User | **AGREE** | `Heading` is currently a messy bag of optional fields. We will create `BaseHeading`, `QuranHeading`, `HadithHeading` with strict `meta`. |
| **Explicit `type: 'text'`** | Gemini, Claude | **DISAGREE** | User explicitly requested omitting `type` for generic text to save space. We will stick to `type?: ...` but ensure strict narrowing in code. |
| **Fix Migration Logic (`type` assignment)** | User | **AGREE** | Logic for assigning `type` in migration scripts is flawed. We will fix it to omit `type` for generic text. |
| **Arrow Functions & Clean Logs** | User | **AGREE** | Modernize code style and improve logging professionalism. |
| **Remove Unused Types** | User | **AGREE** | Cleanup `TranslatorsManifest`, etc. |

## 3. Client-Side Logic & Testing

| Suggestion | Source | Decision | Rationale |
| :--- | :--- | :--- | :--- |
| **Virtualization for Lists** | Gemini, Grok | **AGREE** | UI implementation detail, but DAL should support fetching ranges. |
| **Mock Network in Tests** | Gemini, Grok | **AGREE** | Essential for TDD of DAL. |
| **Cache Strategy (LRU)** | Gemini, Grok | **AGREE** | DAL must implement in-memory caching for chunks. |

---

## Action Plan (Updated)

1.  **Refactor Types (`src/lib/data-types-v1.ts`)**:
    *   Implement `QuranHeading`, `HadithHeading`.
    *   Implement discriminated unions for `Excerpt`.
    *   Remove unused types.

2.  **Update Migration Scripts**:
    *   **Logic**: Fix `type` assignment.
    *   **Style**: Convert to arrow functions, clean logs.
    *   **Output**: Generate `toc.json` (lightweight headings).
    *   **Output**: Remove `ids` from `indexes.json` (or move to `indexes/ids.json`).
    *   **Robustness**: Update `download-old-data.ts` for zip/mkdir handling.

3.  **TDD for Data Access Layer**:
    *   Implement `loadBook`, `loadTOC`, `loadIndex`.
    *   Implement `getExcerpt...` functions with chunk resolution.

---

## Open Questions / Risks

*   **Deep Linking without `ids` map**: If we remove `ids` map, how do we resolve `2576:P123` to a chunk?
    *   *Solution*: We can keep `ids` map but put it in a separate file `indexes/ids.json` that is only loaded when resolving a specific ID (rare case). Navigation by Verse/HadithNum/Page uses the main index.
