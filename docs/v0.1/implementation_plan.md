# Unified Islamic Text Data Architecture

A comprehensive data structure design for Qur'an, Hadith, Fiqh, and Tafsir texts optimized for Cloudflare's free tier with JSON-based storage.

## Background

The application needs to consolidate multiple types of Islamic texts into a common data structure that:
- Handles different text types (Qur'an verses, ahadith, fiqh rulings, tafsir commentaries)
- Supports bi-directional cross-references (e.g., tafsir → verse, hadith → narrator)
- Enables efficient lookups by various identifiers (surah:verse, book#hadith, page numbers)
- Remains performant on Cloudflare's edge network without a database
- Allows for future extensibility (narrators, cross-book references)

## Core Concept: The "Excerpt" Model

All segmented texts (verses, ahadith, chapter titles, etc.) are unified as **excerpts** - atomic, referenceable units of content with standardized metadata.

## Proposed Data Structure

### 1. Books Metadata (`/public/data/books.json`)

```json
{
  "books": [
    {
      "id": 1,
      "slug": "quran",
      "type": "scripture",
      "title": "Qurʾān",
      "unwan": "القرآن",
      "author": null,
      "refTemplate": "https://quran.com/{{surah}}:{{verse}}",
      "totalExcerpts": 6236,
      "totalPages": 604,
      "indexFiles": [
        "surah-verse",
        "page",
        "juz"
      ]
    },
    {
      "id": 2576,
      "slug": "sahih-bukhari",
      "type": "hadith",
      "title": "al-Jāmiʿ al-Musnad al-Ṣaḥīḥ",
      "unwan": "الجامع المسند الصحيح",
      "author": "Muḥammad ibn Ismāʿīl al-Bukhārī",
      "refTemplate": "https://shamela.ws/book/3310/{{page}}",
      "totalExcerpts": 7563,
      "totalPages": 11500,
      "indexFiles": [
        "hadith-num",
        "page",
        "volume-page"
      ]
    },
    {
      "id": 3001,
      "slug": "tafsir-tabari",
      "type": "tafsir",
      "title": "Jāmiʿ al-Bayān ʿan Taʾwīl Āy al-Qurʾān",
      "unwan": "جامع البيان عن تأويل آي القرآن",
      "author": "Muḥammad ibn Jarīr al-Ṭabarī",
      "refTemplate": "https://shamela.ws/book/12/{page}}",
      "commentaryOn": 1,
      "totalExcerpts": 45000,
      "totalPages": 15000,
      "indexFiles": [
        "page",
        "surah-commentary"
      ]
    }
  ]
}
```

**Key Fields:**
- `type`: Categorizes book type (scripture, hadith, fiqh, tafsir, narrator-bio, etc.)
- `slug`: URL-friendly identifier
- `refTemplate`: URL template for external source validation (asl)
- `commentaryOn`: Book ID this text comments on (for tafsir)
- `indexFiles`: Available index types for fast lookups

---

### 2. Translators Metadata (`/public/data/translators.json`)

Remains mostly unchanged but add type distinction:

```json
{
  "translators": [
    {
      "id": 13,
      "name": "Muhammad Muhsin Khan",
      "type": "human",
      "img": "https://..."
    },
    {
      "id": 873,
      "name": "GPT-4o",
      "type": "ai",
      "model": "gpt-4o-2024-08-06"
    }
  ]
}
```

---

### 3. Unified Excerpt Content (`/public/data/books/{bookId}/content.json`)

**Core Structure:**

```json
{
  "content": [
    {
      "id": "1:1",
      "eid": 1,
      "type": "verse",
      "nass": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "text": "In the Name of Allāh...",
      "roman": "Bismi Llāhi r-Raḥmāni r-Raḥīm",
      "translator": 13,
      "page": 1,
      "meta": {
        "surah": 1,
        "verse": 1,
        "juz": 1
      },
      "refs": {
        "chapter": "quran-surah-1"
      },
      "tags": ["basmala"]
    },
    {
      "id": "2576:1",
      "eid": 1,
      "type": "hadith",
      "nass": "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ...",
      "text": "Actions are only by intentions...",
      "translator": 873,
      "page": 10,
      "meta": {
        "volume": 1,
        "pp": 6,
        "hadithNum": 1
      },
      "refs": {
        "chapter": "bukhari-book-1-ch-1",
        "narrators": ["umar-ibn-khattab", "alqama-ibn-waqqas"]
      }
    },
    {
      "id": "2576:C43",
      "eid": "C43",
      "type": "chapter-title",
      "nass": "بَابُ سُؤَالِ جِبْرِيلَ...",
      "text": "Chapter: Jibrīl's questioning...",
      "translator": 873,
      "page": 95,
      "meta": {
        "volume": 1,
        "pp": 19
      },
      "refs": {
        "parent": "bukhari-book-1",
        "verses": ["57:27"]
      }
    }
  ]
}
```

**Field Definitions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier across entire corpus (`bookId:localId`) |
| `eid` | number/string | Excerpt ID within the book (numeric for verses/hadith, alphanumeric for chapters) |
| `type` | enum | `verse`, `hadith`, `chapter-title`, `chapter-subtitle`, `foreword`, `footnote`, `commentary` |
| `nass` | string | Arabic text |
| `text` | string | English translation |
| `roman` | string? | Optional ALA-LC transliteration |
| `translator` | number | ID from translators.json |
| `page` | number | Page number in the physical/digital source |
| `meta` | object | Book-specific metadata (flexible schema) |
| `refs` | object | Cross-references to other content |
| `tags` | string[]? | Optional semantic tags |
| `commentary` | string? | Editorial notes (not part of main text) |
| `flags` | string? | Special markers (legacy field, can be migrated to `tags`) |

**Meta Field Examples:**

```typescript
// For Qur'an
meta: {
  surah: number,
  verse: number,
  juz?: number,
  hizb?: number,
  sajda?: boolean
}

// For Hadith
meta: {
  volume: number,
  pp: number,           // Part page
  hadithNum?: number,   // Extracted from nass
  grading?: string      // Sahih, Hasan, Daif
}

// For Tafsir
meta: {
  volume?: number,
  page: number
}
```

**Refs Field Examples:**

```typescript
refs: {
  chapter?: string,              // ID of chapter this excerpt belongs to
  parent?: string,               // Parent heading (for sub-chapters)
  verses?: string[],             // Qur'an verses referenced (e.g., ["2:255", "3:1-5"])
  narrators?: string[],          // Narrator IDs for hadith chain
  relatedHadith?: string[],      // Cross-references to other ahadith
  commentary?: string[]          // Links to tafsir/sharh excerpts
}
```

---

### 4. Hierarchical Headings (`/public/data/books/{bookId}/headings.json`)

```json
{
  "headings": [
    {
      "id": "quran-surah-1",
      "nass": "الفاتحة",
      "text": "The Opening",
      "roman": "al-Fātiḥah",
      "translator": 13,
      "num": 1,
      "page": 1,
      "level": 1,
      "meta": {
        "type": "surah",
        "verses": 7,
        "revelation": "meccan"
      }
    },
    {
      "id": "bukhari-book-1",
      "nass": "كتاب بدء الوحي",
      "text": "Book of the Beginning of Revelation",
      "translator": 891,
      "num": 1,
      "page": 9,
      "level": 1,
      "meta": {
        "type": "book"
      }
    },
    {
      "id": "bukhari-book-1-ch-1",
      "nass": "باب كيف كان بدء الوحي",
      "text": "Chapter: How the revelation began",
      "translator": 891,
      "page": 9,
      "parent": "bukhari-book-1",
      "level": 2,
      "meta": {
        "type": "chapter"
      }
    }
  ]
}
```

**Field Definitions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Globally unique heading identifier |
| `num` | number? | Sequential number (surah #, book #, chapter #) |
| `page` | number | First page where this heading's content begins |
| `parent` | string? | Parent heading ID (for hierarchical structure) |
| `level` | number | Hierarchical depth (1=top, 2=sub, etc.) |
| `meta` | object | Heading-specific metadata |

This structure allows easy breadcrumb generation: `Book 1 > Chapter 43 > Hadith 50`

---

### 5. Index Files for Fast Lookups

Create separate index files for common lookup patterns. Indexes are small JSON maps stored as separate files for caching efficiency.

#### `/public/data/books/1/indexes/surah-verse.json`

```json
{
  "1:1": { "eid": 1, "page": 1 },
  "1:2": { "eid": 2, "page": 1 },
  "2:255": { "eid": 286, "page": 42 },
  "114:6": { "eid": 6236, "page": 604 }
}
```

#### `/public/data/books/2576/indexes/hadith-num.json`

```json
{
  "1": { "eid": "P10", "page": 10 },
  "49": { "eid": "P94", "page": 94 },
  "7563": { "eid": "P11500", "page": 11500 }
}
```

#### `/public/data/books/2576/indexes/page.json`

```json
{
  "10": { "start": 1, "end": 3 },
  "94": { "start": 43, "end": 43 },
  "95": { "start": 44, "end": 46 }
}
```

**Index File Benefits:**
- Small files (few KB) that Cloudflare caches aggressively
- O(1) lookup for common queries
- Can be generated during build/preprocessing
- Easy to invalidate specific indexes

---

### 6. Cross-Reference System

#### `/public/data/cross-refs/verse-to-tafsir.json`

```json
{
  "1:1": [
    { "book": 3001, "excerpts": ["3001:1", "3001:2"] },
    { "book": 3002, "excerpts": ["3002:45"] }
  ],
  "2:255": [
    { "book": 3001, "excerpts": ["3001:5432", "3001:5433", "3001:5434"] }
  ]
}
```

#### `/public/data/cross-refs/narrator-profiles.json`

```json
{
  "umar-ibn-khattab": {
    "name": "ʿUmar ibn al-Khaṭṭāb",
    "arabicName": "عمر بن الخطاب",
    "bioBook": 4001,
    "bioExcerpt": "4001:234"
  },
  "alqama-ibn-waqqas": {
    "name": "ʿAlqamah ibn Waqqāṣ",
    "arabicName": "علقمة بن وقاص",
    "bioBook": 4001,
    "bioExcerpt": "4001:567"
  }
}
```
These are separate from main content for efficient partial updates and can be split by surah/book to keep file sizes manageable.

---

## File Organization Strategy (Implemented)

```
public/data/
├── books.json                          # ~5 KB
├── translators.json                    # ~3 KB
├── books/
│   ├── 1/                              # Qur'an
│   │   ├── content/                    # Content chunks (500 verses each)
│   │   │   ├── 0.json                  # Verses 1-500
│   │   │   └── ...
│   │   ├── headings.json               # Surahs (with precomputed ranges)
│   │   └── indexes.json                # Consolidated index (~150 KB)
│   │       ├── surahs                  # Surah:Verse -> Global Index
│   │       ├── pages                   # Page -> Index Range
│   │       └── ids                     # ID -> Global Index
│   ├── 2576/                           # Sahih al-Bukhari
│   │   ├── content/                    # Content chunks (500 hadiths each)
│   │   │   ├── 0.json                  # Hadiths 1-500
│   │   │   └── ...
│   │   ├── headings.json               # Chapter titles (with ranges)
│   │   └── indexes.json                # Consolidated index (~1 MB)
│   │       ├── hadiths                 # Hadith Num -> Global Index
│   │       ├── pages                   # Page -> Index Range
│   │       └── ids                     # ID -> Global Index
│   └── 3001/                           # Tafsir al-Tabari
│       └── ...
└── cross-refs/
    ├── verse-to-tafsir.json            # ~500 KB
    ├── verse-to-hadith.json            # ~300 KB
    └── narrator-profiles.json          # ~150 KB
```

### Chunking Strategy (Implemented)

Content is split into fixed-size chunks (default: 500 items) to ensure optimal caching and fast initial loads.

```json
// /public/data/books/1/content/0.json
{
  "content": [ ... 500 items ... ]
}
```

The client calculates which chunk to fetch based on the global index:
`chunkId = floor(globalIndex / chunkSize)`

This deterministic strategy avoids the need for a separate manifest file.

---

## API/Data Access Patterns

### Pattern 1: Navigate to Specific Verse

```
User wants: Surah 2, Verse 255 (Ayat al-Kursi)
```

1. Load `/public/data/books/1/indexes/surah-verse.json`
2. Lookup `"2:255"` → `{ eid: 286, page: 42 }`
3. Load `/public/data/books/1/content.json` (or use cached version)
4. Find excerpt with `eid: 286`
5. Load tafsir: `/public/data/cross-refs/verse-to-tafsir.json["2:255"]`

### Pattern 2: Navigate to Hadith by Number

```
User wants: Sahih al-Bukhari #1
```

1. Load `/public/data/books/2576/indexes/hadith-num.json`
2. Lookup `"1"` → `{ eid: "P10", page: 10 }`
3. Determine chunk from page (volume 1)
4. Load `/public/data/books/2576/content-chunked/volume-1.json`
5. Find excerpt with `eid: "P10"`

### Pattern 3: List All Surahs

```
User wants: Browse all Qur'an chapters
```

1. Load `/public/data/books.json` to get book info
2. Load `/public/data/books/1/headings.json`
3. Filter `level: 1` headings
4. Display title, unwan, num, and page

### Pattern 4: Narrator Profile

```
User clicks narrator "ʿUmar ibn al-Khaṭṭāb" in a hadith
```

1. Load `/public/data/cross-refs/narrator-profiles.json`
2. Lookup `"umar-ibn-khattab"` → `{ bioBook: 4001, bioExcerpt: "4001:234" }`
3. Navigate to Book 4001 (Tahdhib al-Tahdhib), excerpt 234

---

## Hadith Number Extraction

For hadith collections, extract the hadith number from the Arabic text using regex:

```javascript
function extractHadithNumber(nass) {
  // Match Arabic numerals at start: "٤٩ - " or "٦٠٦١ - "
  const match = nass.match(/^([٠-٩]+)\s*-/);
  if (match) {
    return arabicToWestern(match[1]);
  }
  return null;
}

function arabicToWestern(arabicNum) {
  const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
  return parseInt(arabicNum.replace(/[٠-٩]/g, d => map[d]));
}
```

This number is stored in `meta.hadithNum` and indexed in `hadith-num.json`.

---

## Migration Path from Current Structure

### Qur'an (Book 1)

**Current:**
```json
{
  "id": 1,
  "nass": "...",
  "text": "...",
  "translator": 13,
  "page": 1,
  "surah": 1,
  "verse": 1,
  "chapter": 60518
}
```

**New:**
```json
{
  "id": "1:1",
  "eid": 1,
  "type": "verse",
  "nass": "...",
  "text": "...",
  "translator": 13,
  "page": 1,
  "meta": { "surah": 1, "verse": 1 },
  "refs": { "chapter": "quran-surah-1" }
}
```

### Sahih al-Bukhari (Book 2576)

**Current:**
```json
{
  "id": "P10",
  "nass": "١ - حَدَّثَنَا...",
  "text": "...",
  "translator": 873,
  "page": 10,
  "pp": 6,
  "volume": 1
}
```

**New:**
```json
{
  "id": "2576:1",
  "eid": "P10",
  "type": "hadith",
  "nass": "١ - حَدَّثَنَا...",
  "text": "...",
  "translator": 873,
  "page": 10,
  "meta": { "volume": 1, "pp": 6, "hadithNum": 1 },
  "refs": { "chapter": "bukhari-book-1-ch-1" }
}
```

### Chapter Headings

**Current:**
```json
{
  "id": "C43",
  "type": 2,
  "nass": "بَابُ...",
  "text": "Chapter...",
  "translator": 873,
  "page": 95,
  "volume": 1,
  "pp": 19
}
```

**New (in content.json):**
```json
{
  "id": "2576:C43",
  "eid": "C43",
  "type": "chapter-title",
  "nass": "بَابُ...",
  "text": "Chapter...",
  "translator": 873,
  "page": 95,
  "meta": { "volume": 1, "pp": 19 },
  "refs": { "parent": "bukhari-book-1" }
}
```

**And in headings.json:**
```json
{
  "id": "bukhari-book-1-ch-43",
  "nass": "بَابُ...",
  "text": "Chapter...",
  "translator": 873,
  "page": 95,
  "parent": "bukhari-book-1",
  "level": 2
}
```

---

## Performance Optimization for Cloudflare

### 1. Aggressive Caching

```javascript
// Cloudflare Workers cache strategy
const CACHE_DURATIONS = {
  'books.json': 86400 * 30,        // 30 days
  'translators.json': 86400 * 30,
  'indexes/*': 86400 * 7,           // 7 days
  'headings.json': 86400 * 7,
  'content.json': 86400 * 1,        // 1 day
  'cross-refs/*': 86400 * 1
};
```

### 2. Compression

- All JSON files served with Brotli compression
- Expected compression: 70-80% reduction
- Example: 190MB hadith file → ~40MB compressed

### 3. Range Requests

For very large `content.json` files, support HTTP range requests:

```javascript
// Fetch only excerpts 1000-2000
fetch('/data/books/1/content.json', {
  headers: { 'Range': 'bytes=2500000-5000000' }
});
```

### 4. Index-First Loading

Always load indexes first (small files), then lazy-load content:

```javascript
// Fast: Load 150KB index
const index = await fetch('/data/books/1/indexes/surah-verse.json');
const { eid, page } = index['2:255'];

// Slow but necessary: Load 3.9MB content
const content = await fetch('/data/books/1/content.json');
const excerpt = content.find(e => e.eid === eid);
```

### 5. Pre-generated Static Pages

For popular excerpts (e.g., Ayat al-Kursi, Hadith 1), pre-generate static HTML:

```
/quran/2/255/index.html     # Pre-rendered
/quran/2/256/index.html     # Pre-rendered
/bukhari/1/index.html       # Pre-rendered
```

Reduces TTI (Time to Interactive) from seconds to milliseconds.

---

## Future Extensibility

### Adding Narrators

1. Create `/public/data/narrators/` directory
2. Add narrator bio books (Tahdhib al-Tahdhib, etc.)
3. Populate `narrator-profiles.json` cross-reference
4. Link hadith via `refs.narrators`

### Adding More Tafsir

1. Add book entry to `books.json` with `type: "tafsir"` and `commentaryOn: 1`
2. Create book directory with content/headings/indexes
3. Update `cross-refs/verse-to-tafsir.json` with new book references

### Adding Fiqh Books

1. Similar structure to hadith
2. `type: "fiqh"` in books.json
3. Can reference hadith and verses via `refs` field

### Multi-translation Support

```json
{
  "id": "1:1",
  "eid": 1,
  "nass": "بِسْمِ ٱللَّهِ...",
  "translations": [
    { "lang": "en", "text": "In the Name...", "translator": 13 },
    { "lang": "en", "text": "In the name...", "translator": 15 },
    { "lang": "ur", "text": "اللہ کے نام سے...", "translator": 20 }
  ],
  "page": 1,
  "meta": { "surah": 1, "verse": 1 }
}
```

Alternatively, create separate `content-{lang}.json` files for each translation.

---

## Build/Preprocessing Pipeline

Recommended tooling:

```bash
# 1. Validate all JSON schemas
npm run validate-schemas

# 2. Generate indexes from content files
npm run generate-indexes

# 3. Extract hadith numbers
npm run extract-hadith-numbers

# 4. Build cross-reference maps
npm run build-cross-refs

# 5. Chunk large files
npm run chunk-large-books

# 6. Compress and optimize
npm run optimize-json

# 7. Pre-render popular pages
npm run prerender-pages
```

This pipeline runs on each data update before deployment.

---

## SQL-less Full-Text Search

For search functionality without a database:

### Option 1: Client-Side Search (Simple)

Build a flattened search index:

```json
// /public/data/search-index.json
{
  "terms": {
    "rahman": [
      { "book": 1, "id": "1:1", "score": 10 },
      { "book": 1, "id": "1:3", "score": 10 }
    ],
    "mercy": [
      { "book": 1, "id": "1:1", "score": 5 },
      { "book": 2576, "id": "2576:50", "score": 3 }
    ]
  }
}
```

Limit to ~10-20MB for reasonable client-side performance.

### Option 2: Cloudflare KV (Advanced)

Store search index in Cloudflare KV:

```javascript
// Key: "search:rahman"
// Value: [{"book":1,"id":"1:1","score":10},...]

const results = await SEARCH_KV.get('search:' + query, 'json');
```

KV is free for up to 100k reads/day.

### Option 3: Pagefind (Recommended)

Use [Pagefind](https://pagefind.app/) for static site search:
- Builds search index at build time
- ~1KB per page overhead
- Works entirely client-side
- Perfect for Cloudflare Pages

---

## Example URL Structure

```
/books                          # List all books
/books/quran                    # Qur'an overview (surah list)
/books/quran/2                  # Surah 2 overview
/books/quran/2/255              # Ayat al-Kursi
/books/sahih-bukhari            # Bukhari overview (volume/book list)
/books/sahih-bukhari/1          # Book 1 of Bukhari
/books/sahih-bukhari/hadith/1   # Hadith #1 by number
/books/tafsir-tabari/2/255      # Tabari's tafsir on 2:255
```

Clean, semantic URLs that map directly to data structure.

---

## Schema Validation

Use JSON Schema for validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "eid", "type", "nass", "text", "translator", "page"],
  "properties": {
    "id": { "type": "string", "pattern": "^\\d+:[\\w\\d]+$" },
    "eid": { "type": ["number", "string"] },
    "type": {
      "type": "string",
      "enum": ["verse", "hadith", "chapter-title", "chapter-subtitle", "foreword", "footnote", "commentary"]
    },
    "nass": { "type": "string", "minLength": 1 },
    "text": { "type": "string", "minLength": 1 },
    "translator": { "type": "number" },
    "page": { "type": "number", "minimum": 1 },
    "meta": { "type": "object" },
    "refs": { "type": "object" }
  }
}
```

---

## Estimated File Sizes (Post-Optimization)

| File | Raw | Compressed | Cacheable |
|------|-----|------------|-----------|
| books.json | 5 KB | 2 KB | 30 days |
| translators.json | 3 KB | 1 KB | 30 days |
| Qur'an content.json | 3.9 MB | 800 KB | 1 day |
| Bukhari volume-1.json | 20 MB | 4 MB | 1 day |
| surah-verse index | 150 KB | 30 KB | 7 days |
| hadith-num index | 180 KB | 35 KB | 7 days |
| verse-to-tafsir.json | 500 KB | 100 KB | 1 day |

**Total bandwidth for typical session:**
- Initial: ~50 KB (books + translators + indexes)
- First verse: +800 KB (Qur'an content)
- First hadith: +4 MB (Bukhari vol 1)
- Subsequent navigations: <5 KB (cache hits)

**Cloudflare Free Tier:**
- 100k requests/day → ~3M requests/month
- Unlimited bandwidth (for cached content)
- Should easily handle 10k-50k DAU

---

## Key Architectural Principles

1. **Excerpt-Centric**: Everything is an excerpt with metadata
2. **Index-First**: Small indexes enable fast routing to large content
3. **Normalized IDs**: Globally unique, predictable identifiers
4. **Chunked Content**: Large books split into cacheable volumes
5. **Cross-Reference via IDs**: Links use stable IDs, not embedded data
6. **Multi-Tier Caching**: Browser → Cloudflare CDN → Origin
7. **Static-First**: No runtime database queries
8. **Schema-Validated**: All JSON conforms to defined schemas
9. **URL-Routable**: Data structure maps 1:1 with URL structure
10. **Future-Proof**: Extensible meta/refs fields for new features

This architecture provides a solid foundation that can scale to millions of excerpts across hundreds of books while remaining performant on Cloudflare's free tier.
