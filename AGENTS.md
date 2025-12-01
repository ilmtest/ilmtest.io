# Agent Guidelines

Welcome! Please read these notes before modifying the repository:

- Always search for nested `AGENTS.md` files inside the directories you plan to modify; their guidance overrides this document.
- Use Bun for all package management and scripts. Prefer `bun install`, `bun run build`, and `bun run dev`.
- When network access is available, refresh dependencies with `bun update --latest` so the app stays on Next.js 16, React 19, Tailwind CSS 4.1, TypeScript 5.9, and Biome 2.2.
- Keep feature work aligned with the Next.js App Router architecture (see `src/app`). Components default to server components unless `"use client"` is required.
- All route metadata should reuse the helpers in `src/lib/seo.ts` for Open Graph and Twitter tags.
- The project exports a fully static site (`output: 'export'`). Avoid introducing features that require a Node.js server runtime.
- Run `bun run build` before handing work off. For local QA, `bun dev` should boot without warnings.
- Always finish by running `bun run format` to keep the codebase lint-clean.
- When touching UI components inside `src/components`, favour accessible markup (ARIA attributes, keyboard focus) and keep styling Tailwind-first.
- Documentation belongs in Markdown files in the repo root unless a more specific location is required.

Thanks and happy hacking!

---

## ACTIVE CONTEXT: v1 Data Migration (2025-12-01)

### Current Status: Planning Complete → Ready for Implementation

We've completed the architectural design and planning phase for a unified data structure to handle Islamic texts (Qur'an, Hadith, Tafsir, Fiqh). **The next AI agent needs to start the implementation phase.**

### What Was Accomplished

#### 1. **Architecture Design** (Complete ✅)
- Designed unified "Excerpt" model for all text types (verses, hadith, chapters)
- Created minimal v1 schema focusing ONLY on core browsing features
- Documented future features (v2-v5) in `docs/future-roadmap.md`
- All future TypeScript definitions preserved for later implementation

#### 2. **Documentation Created** (in `.gemini/antigravity/brain/` - needs to be copied to workspace)
- `data-types-v1.ts` - Minimal v1 TypeScript types (using `type` not `interface`)
- `migration-utils.ts` - Pure utility functions (Arabic conversion, index generation, transformations)
- `migration-scripts-v1.ts` - Main migration script using Bun.file() API
- `future-roadmap.ts` - Complete v2-v5 feature definitions (tags, cross-refs, multi-translation, etc.)
- `tests/` directory with 4 test files (TDD-ready, currently failing)
  - `migration-utils.test.ts` - Unit tests for utilities
  - `index-generation.test.ts` - Index generation tests
  - `migration-integration.test.ts` - End-to-end migration tests with mock data
  - `data-validation.test.ts` - Validates actual migrated JSON files
  - `README.md` - Test suite documentation

#### 3. **Key Design Decisions**
- **No database** - Pure JSON files with CDN caching (Cloudflare optimized)
- **Excerpt IDs**: Global format `"bookId:eid"` (e.g., `"1:255"` for Qur'an 2:255)
- **Indexes**: Separate small JSON files for O(1) lookups
- **Types over interfaces**: Using `type` throughout for consistency
- **Bun-first**: Using `Bun.file()`, `node:` import prefix, ESNext syntax
- **TDD approach**: Tests written first, implementation to follow

#### 4. **File Organization**
```
public/data/
├── books.json                  # Books catalog
├── translators.json            # Translator profiles  
└── books/
    ├── 1/                      # Qur'an
    │   ├── content.json        # All verses
    │   ├── headings.json       # Surahs
    │   └── indexes/
    │       ├── surah-verse.json
    │       └── page.json
    └── 2576/                   # Sahih al-Bukhari
        ├── content.json
        ├── headings.json
        └── indexes/
            ├── hadith-num.json
            └── page.json
```

### What Needs to Be Done Next (Implementation Phase)

#### IMMEDIATE NEXT STEPS:

1. **Copy Files from Brain to Workspace**
   ```bash
   # Copy TypeScript definitions and scripts
   cp ~/.gemini/antigravity/brain/1399879c-9bbb-4f3e-ba73-4a154948dff8/data-types-v1.ts src/lib/
   cp ~/.gemini/antigravity/brain/1399879c-9bbb-4f3e-ba73-4a154948dff8/migration-utils.ts scripts/
   cp ~/.gemini/antigravity/brain/1399879c-9bbb-4f3e-ba73-4a154948dff8/migration-scripts-v1.ts scripts/
   
   # Copy tests
   cp -r ~/.gemini/antigravity/brain/1399879c-9bbb-4f3e-ba73-4a154948dff8/tests/ tests/
   ```

2. **Setup Test Fixtures**
   ```bash
   # Move existing truncated data to test fixtures
   mkdir -p tests/fixtures
   mv public/data/books/1/content.json tests/fixtures/quran-sample.json
   mv public/data/books/2576/content.json tests/fixtures/bukhari-sample.json
   ```

3. **Run Tests (TDD Red → Green)**
   ```bash
   bun test  # Should see failing tests
   ```

4. **Implement Missing Pieces**
   - Ensure all paths in scripts point to correct locations
   - Fix any import path issues
   - Run migration scripts on test fixtures
   - Verify generated output matches expected format

5. **Update Checklist**
   - Check off completed items in `docs/task.md` under "Milestone v1.0"

6. **Git Commit**
   Use this commit message:
   ```
   feat(data): implement v1 unified data architecture with TDD
   
   - Design unified Excerpt model for Qur'an, Hadith, and future texts
   - Create minimal v1 TypeScript types (core browsing only)
   - Extract migration utilities (Arabic conversion, index generation)
   - Implement Bun-based migration scripts with dependency injection
   - Add comprehensive test suite (4 test files, 50+ tests)
   - Document v2-v5 roadmap (tags, cross-refs, multi-translation, search)
   - Use TDD approach with it.each() for parametrized tests
   
   Deferred to v2+: tags, narrator profiles, tafsir cross-refs, 
   multi-translation, transliteration, search, audio recitations
   
   Refs: docs/implementation_plan.md, docs/future-roadmap.md
   ```

### Critical Files to Reference

- **Architecture**: `docs/implementation_plan.md` - Complete data structure design
- **Future Plans**: `docs/future-roadmap.md` - v2-v5 features with TypeScript definitions
- **Milestones**: `docs/task.md` - Detailed checklist for v1-v5
- **Examples**: `docs/v1-examples.md` - JSON format examples

### v1 Scope (DO NOT ADD EXTRA FEATURES)

**What's IN v1:**
- ✅ Browse books (Qur'an, Sahih al-Bukhari)
- ✅ View surahs/chapters (headings)
- ✅ Navigate to specific verse (surah:verse)
- ✅ Navigate to specific hadith (by number)
- ✅ Display Arabic + English translation
- ✅ Show page numbers for source validation
- ✅ Index generation (fast lookups)

**What's OUT (deferred to v2+):**
- ❌ Tags/topics
- ❌ Cross-references (tafsir, narrators)
- ❌ Multi-translation
- ❌ Transliteration (romanization)
- ❌ Search
- ❌ Audio
- ❌ Commentary/footnotes

### Key Technical Constraints

- **Cloudflare Pages** deployment (static export only)
- **No runtime database** - JSON files + aggressive caching
- **Bun package manager** - Use `bun` for all scripts/tests
- **Type safety** - All TypeScript, no `any` types
- **TDD methodology** - Tests first, then implementation
- **Extensibility** - v1 must accept v2+ fields without breaking changes

### Brain Artifact Locations

All planning artifacts are in:
```
~/.gemini/antigravity/brain/1399879c-9bbb-4f3e-ba73-4a154948dff8/
```

Key files:
- `data-types-v1.ts` - Core types
- `migration-utils.ts` - Pure functions
- `migration-scripts-v1.ts` - Main migration script
- `future-roadmap.ts` - v2-v5 complete specs
- `tests/` - Full test suite

### Test Framework

Using **Bun's built-in test runner** with conventions:
- `it('should...')` syntax
- `it.each([...])` for parametrized tests
- Bun matchers: `toBeTrue()`, `toBeArray()`, `toBeString()`, etc.
- Mock data injection (no file mocking needed)

---

**Next Agent: Start with Step 1 above (copy files to workspace) and work through the implementation checklist. All planning is done - it's pure execution now!**
