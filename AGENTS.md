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

## ACTIVE CONTEXT: v1 Browse UI \u0026 Type Safety (2025-12-03)

### Current Status: **✅ PHASE 2 \u0026 3 COMPLETE** → Minimal browse UI live!

Successfully completed type refactoring with discriminated unions and implemented minimal browse UI for Qur'an and Hadith navigation.

### What Was Accomplished (December 2-3, 2025)

#### Phase 2: Type Refactoring \u0026 Migration Improvements ✅

**1. Discriminated Unions for Excerpt**
- Created strict types: `VerseExcerpt`, `HadithExcerpt`, `ChapterTitleExcerpt`, `TextExcerpt`
- `meta` field now properly typed based on `type` discriminator
- Type guards work automatically: `'type' in item \u0026\u0026 item.type === 'verse'`

**2. Strict Heading Types**
- `QuranHeading`: `type: 'quran'` with required `surah`
- `HadithHeading`: `type: 'hadith'` with required `volume`, `pp`, optional `parent`
- Replaced messy optional fields with clean discriminated unions

**3. GlobalIndex Versioning**
- Added `version: "1.0.0"` field for cache busting
- Migration utilities updated to include version in all indexes

**4. Hadith Headings Extraction Fixed**
- Fixed `download-old-data.ts` to dynamically detect extracted JSON files
- Updated `loadOldHadithData` to extract headings from `excerpts.json`
- **Successfully extracted 4,146 hadith headings** from Sahih al-Bukhari

**Migration Results:**
- Qur'an: 6,236 verses + 114 surahs ✓
- Bukhari: 10,967 excerpts + 4,146 headings ✓
- All with correct type discriminators ✓

#### Phase 3: Minimal Browse UI ✅

**1. Data Access Layer** (`src/lib/data-loader.ts`)
- `loadBooks()`, `loadBookHeadings()`, `loadBookContentChunk()`
- `loadHeadingExcerpts()` - Smart chunk loading using `indexRange`
- `getTopLevelHeadings()` - Filters `parent=null` for hadith, returns all for Qur'an

**2. Three-Level Navigation**
- `/browse` - Books list showing Qur'an \u0026 Sahih al-Bukhari
- `/browse/[bookId]` - Headings list (114 surahs OR top-level hadith books)
- `/browse/[bookId]/[headingId]` - Excerpt view with verses/hadith

**3. Static Export Ready**
- Added `generateStaticParams()` to all dynamic routes
- Pre-generates paths for static export (`output: 'export'`)
- Build creates ~120 static HTML pages

**4. UI Features**
- Arabic text with IBM Plex Sans Arabic font from Google Fonts
- RTL support with `dir="rtl"` and `.font-arabic` class
- Responsive layout with dark mode support
- Breadcrumb navigation
- Chapter titles displayed inline with excerpts
- Metadata display (verse #, hadith #, page numbers)

### Current Status: **✅ BROWSE UI COMPLETE** → Ready for Phase 2 (Core API/Data Access)

### What Was Accomplished Today

#### Data Structure Optimizations (Complete ✅)

**Problem Identified:**
- Non-hadith content (forewords, introductions) incorrectly typed as `"hadith"`
- Redundant `eid` and bookId prefix in IDs wasting ~200KB per book
- Hadith headings not extracted (inconsistent with Quran structure)
- Needed better extensibility for future content types (fatawa, fiqh)

**Solutions Implemented:**

1. **Made `type` Field Optional** ✅
   - Changed from: `type: 'verse' | 'hadith' | 'chapter-title' | 'text'`
   - To: `type?: 'verse' | 'hadith' | 'chapter-title'`
   - Generic text/prose now omits the type field entirely
   - Saves ~50KB per book with prose content
   - Better semantic clarity: absence of type = "just text"

2. **Removed ID Redundancy** ✅
   - Removed `eid` field completely
   - Removed bookId prefix from IDs (build dynamically when needed)
   - Before: `{ "eid": "P10", "id": "2576:P10" }`
   - After: `{ "id": "P10" }`
   - Saves ~200KB per book

3. **Extracted Hadith Headings** ✅
   - Created separate `books/{bookId}/headings.json` file
   - Extracted 3,563 headings from Sahih al-Bukhari
   - Matches Quran structure for consistency
   - Enables loading TOC without full content
   - Saves ~30KB in content.json

4. **Domain-Specific Metadata** ✅
   - Kept separate types for semantic clarity:
     - Quran: `VerseMetadata { surah, verse }`
     - Hadith: `HadithMetadata { volume, pp, hadithNum? }`
     - Fatawa/Fiqh: `FatawaMetadata { volume, pp }` (for future)
   - Gzip compresses repeated keys effectively (~90%)
   - Type safety and semantic clarity > minimal byte savings

5. **Updated Heading Structure** ✅
   - Simplified IDs: "1" instead of "quran-surah-1"
   - Replaced generic `num`/`level` with domain-specific fields
   - Quran: `{ id, surah, page }`
   - Hadith: `{ id, volume, pp, page }`

#### Files Modified

**Type Definitions:**
- `src/lib/data-types-v1.ts`
  - Made `type` optional
  - Added `FatawaMetadata` type
  - Renamed `QuranMeta` → `VerseMetadata`, `HadithMeta` → `HadithMetadata`
  - Updated `Heading` structure, simplified index types

**Migration Scripts:**
- `scripts/migration-utils.ts`
  - `transformQuranExcerpt`: Removed bookId prefix
  - `transformHadithExcerpt`: Made type optional, removed bookId prefix, omit type for generic text
  - `transformQuranHeading`: Simplified ID, use `surah` field
  - Added `extractHadithHeadings()` function

- `scripts/migration-scripts-v1.ts`
  - `migrateHadithData`: Extract and return headings
  - `migrateHadith`: Write headings to separate file

**Tests:** (All Updated ✅)
- `tests/migration-utils.test.ts`
- `tests/migration-integration.test.ts`
- `tests/data-validation.test.ts`

#### Migration Results

```bash
📚 Migrating hadith book 2576...
  ✓ 11359 excerpts
  ✓ 3563 headings          ← Extracted!
  ✓ 7325 hadith numbers
  ✓ 11104 pages
```

**Space Savings Per Book:**
- Remove `eid`: ~45KB
- Remove bookId prefix: ~160KB
- Optional `type` for text: ~50KB
- **Total: ~285KB raw (~100-150KB after gzip)**

#### Verification

- ✅ All 73 tests passing
- ✅ Build successful
- ✅ Generated files validated:
  - P8 (foreword): No type field
  - P10 (hadith): `type: "hadith"`, `hadithNum: 1`
  - IDs simplified: "P10" not "2576:P10"
  - Headings file created with 3,563 entries

### File Organization (Current State)

```
public/data/
├── books.json              # Books metadata
├── translators.json        # Translators metadata
└── books/
    ├── 1/                  # Quran
    │   ├── content.json    # Verses (optimized)
    │   ├── headings.json   # Surahs
    │   └── indexes/
    │       ├── surah-verse.json
    │       └── page.json
    └── 2576/               # Sahih al-Bukhari
        ├── content.json    # Hadith excerpts (optimized)
        ├── headings.json   # Chapter/Book titles (NEW!)
        └── indexes/
            ├── hadith-num.json
            └── page.json
```

### Next Steps: Phase 2 - Core API/Data Access

The data structure is now optimized and ready for API implementation:

1. **Data Loading Utilities**
   - Implement `loadBooks()`, `loadTranslators()`
   - Implement `loadBookContent()`, `loadBookHeadings()`, `loadBookIndexes()`

2. **Lookup Functions**
   - `getBookById(id)` - Get book metadata
   - `getExcerptById(globalId)` - Get excerpt by `bookId:eid` format
   - `getExcerptByVerse(bookId, surah, verse)` - Quran verse lookup
   - `getExcerptByHadithNum(bookId, hadithNum)` - Hadith number lookup
   - `getHeadingsByBook(bookId)` - Get all headings
   - `getExcerptsByPage(bookId, page)` - Paginated content

3. **Performance Targets**
   - Lookups < 10ms
   - Lazy loading of content
   - Proper caching strategy

4. **Tests**
   - Unit tests for all lookup functions
   - Performance benchmarks
   - Edge case handling

### Important Notes for Next Agent

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

## ✅ IMPLEMENTATION COMPLETE (2025-12-01)

### What Was Implemented

**1. Data Structure & TypeScript Types**
- ✅ Created `src/lib/data-types-v1.ts` with minimal v1 types
- ✅ All types use `type` (not `interface`) for consistency
- ✅ Supports Qur'an and Hadith with extensible architecture

**2. Migration Utilities & Scripts**
- ✅ Created `scripts/migration-utils.ts` with pure transformation functions
- ✅ Created `scripts/migration-scripts-v1.ts` with Bun-based migration runner
- ✅ Arabic number conversion (٠-٩ → 0-9)
- ✅ Hadith number extraction from nass
- ✅ Index generation (surah:verse, hadith-num, page)

**3. Data Migration Results**
- ✅ **Qur'an**: Migrated 6,236 verses with 604 pages
- ✅ **Sahih al-Bukhari**: Migrated 11,359 excerpts with 7,325 hadith numbers
- ✅ **Headings**: Migrated 114 surahs
- ✅ **Indexes**: Generated all indexes successfully
  - Surah:verse index (6,236 entries)
  - Page indexes (604 + 11,104 pages)
  - Hadith number index (7,325 entries)

**4. Test Suite (TDD)**
- ✅ Created comprehensive test suite with 76 tests
- ✅ **All tests passing** (76 pass, 0 fail, 491 assertions)
- ✅ Test files:
  - `tests/migration-utils.test.ts` - Unit tests for utilities
  - `tests/index-generation.test.ts` - Index generation tests
  - `tests/migration-integration.test.ts` - End-to-end migration tests
  - `tests/data-validation.test.ts` - Validates actual migrated files
- ✅ Test fixtures created in `tests/fixtures/`

**5. Documentation**
- ✅ Updated `docs/task.md` - Phase 1 marked complete
- ✅ Updated `public/data/books.json` - Added v1 schema fields
- ✅ Updated `tsconfig.json` - Excluded non-app directories from build
- ✅ Updated `AGENTS.md` - Documented implementation status

**6. Build & Quality**
- ✅ Build passes successfully (`bun run build`)
- ✅ Tests pass successfully (`bun test`)
- ✅ Code formatted with Biome

### File Structure Created

```
src/lib/
└── data-types-v1.ts          # v1 TypeScript types

scripts/
├── migration-utils.ts         # Pure transformation functions
└── migration-scripts-v1.ts    # Main migration runner

tests/
├── README.md                  # Test suite documentation
├── migration-utils.test.ts    # Unit tests
├── index-generation.test.ts   # Index generation tests
├── migration-integration.test.ts  # Integration tests
├── data-validation.test.ts    # Data validation tests
└── fixtures/
    ├── quran-sample.json      # Test data
    └── bukhari-sample.json    # Test data

public/data/
├── books.json                 # Updated with v1 schema
└── books/
    ├── 1/                     # Qur'an
    │   ├── content/           # Content chunks
    │   │   ├── 0.json         # Verses 1-500
    │   │   └── ...
    │   ├── headings.json      # 114 surahs (with ranges)
    │   └── indexes.json       # Consolidated index (surah, page, id)
    └── 2576/                  # Sahih al-Bukhari
        ├── content/           # Content chunks
        │   ├── 0.json         # Hadiths 1-500
        │   └── ...
        ├── headings.json      # Chapter titles (with ranges)
        └── indexes.json       # Consolidated index (hadith, page, id)
```

### Next Steps: Phase 2 (Core API/Data Access)

**Status: DEFERRED / BLOCKED**
*Reason: Data structure was further optimized for static deployment (chunking + consolidated indexing) before API implementation could begin.*

---

## Session Update: Static Site Optimization (2025-12-01)

### What Was Accomplished
We optimized the data structure to ensure maximum performance on Cloudflare's free tier (static hosting), focusing on minimal initial payload and O(1) lookups.

#### 1. Content Chunking ✅
*   **Problem**: Monolithic `content.json` files were too large (~16MB for Bukhari, ~4MB for Qur'an), causing slow initial loads and inefficient caching.
*   **Solution**: Split content into fixed-size chunks (500 items per file).
*   **Implementation**:
    *   `public/data/books/{id}/content/{chunkId}.json`
    *   Bukhari: 23 chunks
    *   Qur'an: 13 chunks

#### 2. Consolidated Global Index ✅
*   **Problem**: Multiple small index files (`indexes/page.json`, `indexes/hadith-num.json`) required multiple fetches.
*   **Solution**: Created a single `indexes.json` (~1MB) per book containing all lookup maps.
*   **Structure**:
    ```typescript
    interface GlobalIndex {
      hadiths: Record<string, number>; // Hadith Num -> Global Index
      surahs?: Record<string, number>; // Surah:Verse -> Global Index
      ids: Record<string, number>;     // Content ID -> Global Index
      pages: Record<string, { start: number; end: number }>; // Page -> Index Range
      chunkSize: number; // e.g., 500
      totalItems: number;
    }
    ```

#### 3. Optimized Headings ✅
*   **Problem**: Client needed to know which chunks to fetch for a given chapter.
*   **Solution**: Added precomputed ranges to `headings.json`.
*   **New Fields**:
    *   `indexRange`: `{ start: 0, end: 499 }` (Global array indices)
    *   `pageRange`: `{ start: 1, end: 10 }` (Page numbers)
    *   `range`: `{ start: "1:1", end: "1:7" }` (Content IDs)

#### 4. Legacy Cleanup ✅
*   Updated migration scripts to automatically remove obsolete `content.json` and `indexes/` folders.

### Next Steps: Phase 2 - Core API/Data Access (Refinement Phase)

**Status: READY FOR REFINEMENT**
*Reason: Architecture reviews identified critical optimizations needed before full API implementation.*

#### 1. Refactor Data Types (Immediate Priority)
*   **Goal**: Strict type safety for `Excerpt` and `Heading`.
*   **Tasks**:
    *   Implement discriminated unions for `Excerpt` (e.g., `VerseExcerpt`, `HadithExcerpt`).
    *   Create strict `Heading` types (`QuranHeading`, `HadithHeading`).
    *   Remove unused types (`TranslatorsManifest`, etc.).

#### 2. Update Migration Scripts
*   **Goal**: Generate optimized data structures for client performance.
*   **Tasks**:
    *   **Fix Logic**: Ensure `type` is omitted for generic text.
    *   **TOC**: Generate `toc.json` (lightweight headings list) to avoid loading 150KB `headings.json`.
    *   **Index Optimization**: Remove `ids` map from `indexes.json` (move to `indexes/ids.json` if needed).
    *   **Versioning**: Add `version` field to `GlobalIndex`.
    *   **Robustness**: Update `download-old-data.ts` to handle zip extraction and dynamic directory creation.

#### 3. Implement Data Access Layer (TDD)
*   **Goal**: Abstract away the chunking logic from the UI.
*   **Key Functions**:
    *   `loadBook`, `loadTOC`, `loadIndex` (with caching).
    *   `getExcerpt...` functions with chunk resolution.

**Agent handoff complete. Please start with "Refactor Data Types" and "Update Migration Scripts" before writing the API.** 🚀
