# Islamic Text Library - Project Milestones

## Milestone v1.0: Core Browsing (MVP)

### Phase 1: Data Migration ✅
- [x] Set up project structure
  - [x] Initialize Bun project (`bun init`)
  - [x] Install dependencies (TypeScript, testing framework)
  - [x] Configure tsconfig.json
- [x] Run migration scripts
  - [x] Migrate Qur'an content (6,236 verses)
  - [x] Migrate Qur'an headings (114 surahs)
  - [x] Migrate Sahih al-Bukhari content (11,359 excerpts)
  - [x] Migrate Sahih al-Bukhari headings
- [x] Generate indexes
  - [x] Qur'an surah:verse index (6,236 entries)
  - [x] Qur'an page index (604 pages)
  - [x] Bukhari hadith number index (7,325 entries)
  - [x] Bukhari page index (11,104 pages)
- [x] Validate data integrity
  - [x] All verses have valid surah:verse
  - [x] All hadith numbers extracted correctly
  - [x] All indexes point to valid excerpts
  - [x] No broken references
- [x] Static Site Optimization
  - [x] Content chunking (500 items/chunk)
  - [x] Consolidated global indexes
  - [x] Optimized headings with ranges

### Phase 2: Core API/Data Access ✅
- [x] Refactor Data Types
  - [x] Implement discriminated unions for Excerpt (VerseExcerpt, HadithExcerpt, ChapterTitleExcerpt, TextExcerpt)
  - [x] Create strict Heading types (QuranHeading, HadithHeading)
  - [x] Add `version` to GlobalIndex
  - [x] Update migration utilities for new types
- [x] Update Migration Scripts
  - [x] Fix hadith headings extraction (4,146 headings extracted)
  - [x] Fix `download-old-data.ts` for dynamic JSON file detection
  - [x] Add `version: "1.0.0"` to GlobalIndex output
  - [ ] Generate `toc.json` (deferred)
- [x] Implement data loading utilities
  - [x] Load books.json
  - [x] Load book headings
  - [x] Load content chunks
  - [x] Load heading excerpts with smart chunk loading
  - [x] Top-level heading filtering

### Phase 3: Minimal Browse UI ✅
- [x] Books list page (`/browse`)
  - [x] Display all books with Arabic \u0026 English
  - [x] generateStaticParams for static export
- [x] Headings list page (`/browse/[bookId]`)
  - [x] Show top-level headings (surahs or hadith books)
  - [x] generateStaticParams for all books
- [x] Excerpts view page (`/browse/[bookId]/[headingId]`)
  - [x] Load excerpts using indexRange
  - [x] Display chapter titles inline
  - [x] Arabic font support (IBM Plex Sans Arabic)
  - [x] RTL text rendering
  - [x] generateStaticParams for all headings
- [x] Navigation \u0026 Styling
  - [x] Breadcrumb navigation
  - [x] Added Browse link to navbar
  - [x] Dark mode support
  - [x] Responsive layout

### Phase 3: Testing (TDD)
- [ ] Unit tests for data types
  - [ ] Book type validation
  - [ ] Excerpt type validation
  - [ ] Heading type validation
  - [ ] Index type validation
- [ ] Unit tests for utilities
  - [ ] Arabic number extraction
  - [ ] Hadith number extraction
  - [ ] Index generation
- [ ] Integration tests
  - [ ] Load Qur'an verse by surah:verse
  - [ ] Load hadith by number
  - [ ] Navigate between excerpts
  - [ ] Breadcrumb generation
- [ ] Performance tests
  - [ ] Index lookup < 10ms
  - [ ] Content load < 500ms
  - [ ] Memory usage < 100MB

### Phase 4: UI Components (Framework TBD)
- [ ] Books list page
  - [ ] Display all books
  - [ ] Show title (English + Arabic)
  - [ ] Link to book detail
- [ ] Book detail page (Qur'an)
  - [ ] List all surahs
  - [ ] Show surah number, name (English + Arabic)
  - [ ] Link to verses
- [ ] Book detail page (Hadith)
  - [ ] List all books/chapters
  - [ ] Show hierarchy (book → chapters)
  - [ ] Link to hadith
- [ ] Excerpt view (Verse)
  - [ ] Display Arabic text (large, RTL)
  - [ ] Display English translation
  - [ ] Show translator name
  - [ ] Show page number + link to source
  - [ ] Previous/Next verse navigation
  - [ ] Breadcrumbs (Qur'an → Surah → Verse)
- [ ] Excerpt view (Hadith)
  - [ ] Display Arabic text (large, RTL)
  - [ ] Display English translation
  - [ ] Show hadith number (if available)
  - [ ] Show volume:page citation
  - [ ] Show translator name
  - [ ] Link to source
  - [ ] Breadcrumbs (Bukhari → Book → Chapter → Hadith)

### Phase 5: Deployment
- [ ] Optimize JSON files
  - [ ] Compress with Brotli
  - [ ] Validate file sizes
  - [ ] Test CDN caching
- [ ] Deploy to Cloudflare Pages
  - [ ] Configure build command
  - [ ] Set up custom domain
  - [ ] Configure caching headers
  - [ ] Test from multiple regions
- [ ] Performance validation
  - [ ] Lighthouse score > 90
  - [ ] First Contentful Paint < 1.5s
  - [ ] Time to Interactive < 3s
  - [ ] Cache hit rate > 95%

---

## Milestone v2.0: Tags & Cross-References

### Phase 1: Tags System
- [ ] Design tag taxonomy
  - [ ] Define core categories (worship, belief, transactions, etc.)
  - [ ] Create hierarchical structure
  - [ ] Add tag descriptions
- [ ] Implement tag data structures
  - [ ] Create taxonomy.json
  - [ ] Generate tag indexes
  - [ ] Add tags to excerpts
- [ ] Tag curation
  - [ ] Tag all Ramadan-related content
  - [ ] Tag all prayer-related content
  - [ ] Tag all fasting-related content
  - [ ] Tag high-traffic verses/hadith
- [ ] Tag browsing UI
  - [ ] Tag list page
  - [ ] Tag detail page
  - [ ] Tagged excerpts list
  - [ ] Related tags suggestions

### Phase 2: Tafsir Cross-References
- [ ] Add tafsir books
  - [ ] Tafsir al-Tabari
  - [ ] Tafsir Ibn Kathir
  - [ ] Migrate tafsir content
- [ ] Build cross-reference indexes
  - [ ] verse-to-tafsir.json
  - [ ] Map all Qur'an verses to tafsir
- [ ] Tafsir UI
  - [ ] Show tafsir panel on verse page
  - [ ] List available tafsir sources
  - [ ] Link to tafsir book page

### Phase 3: Narrator Profiles
- [ ] Add narrator biography books
  - [ ] Tahdhib al-Tahdhib
  - [ ] Siyar A'lam al-Nubala
- [ ] Extract narrators from hadith
  - [ ] Build narrator extraction algorithm
  - [ ] Create narrator profiles index
  - [ ] Link hadith to narrators
- [ ] Narrator UI
  - [ ] Clickable narrator names in hadith
  - [ ] Narrator profile page
  - [ ] List narrator's hadith
  - [ ] Show reliability grade

### Phase 4: Enhanced Metadata
- [ ] Qur'an metadata
  - [ ] Add juz divisions
  - [ ] Add hizb divisions
  - [ ] Mark sajda verses
  - [ ] Add revelation context (Meccan/Medinan)
- [ ] Hadith metadata
  - [ ] Add grading (sahih/hasan/daif)
  - [ ] Add full isnad chains
  - [ ] Add fiqh topic categorization

---

## Milestone v3.0: Translations & Enhancements

### Phase 1: Multi-Translation Support
- [ ] Add additional translators
  - [ ] Sahih International
  - [ ] Dr. Mustafa Khattab
  - [ ] Urdu translation
- [ ] Implement translation switching
  - [ ] Translation selector UI
  - [ ] Store user preference
  - [ ] Load appropriate content file
- [ ] Comparative view
  - [ ] Show multiple translations side-by-side
  - [ ] Highlight differences

### Phase 2: Transliteration (Romanization)
- [ ] Add ALA-LC romanization
  - [ ] Generate for all Qur'an verses
  - [ ] Generate for key hadith
- [ ] Romanization UI
  - [ ] Toggle romanization display
  - [ ] Copy romanization to clipboard

### Phase 3: Commentary & Footnotes
- [ ] Add translator footnotes
- [ ] Add scholarly commentary
- [ ] Footnote UI
  - [ ] Inline footnote markers
  - [ ] Footnote popover/modal
  - [ ] Link to external resources

---

## Milestone v4.0: Search & Discovery

### Phase 1: Full-Text Search
- [ ] Choose search solution
  - [ ] Evaluate Pagefind
  - [ ] Evaluate Cloudflare KV
  - [ ] Evaluate client-side index
- [ ] Build search index
  - [ ] Index all Arabic text
  - [ ] Index all English translations
  - [ ] Add keyword stemming
- [ ] Search UI
  - [ ] Search bar with autocomplete
  - [ ] Search results page
  - [ ] Filter by book/type
  - [ ] Sort by relevance

### Phase 2: Audio Recitations
- [ ] Add recitation files
  - [ ] Mishary Rashid Alafasy
  - [ ] Abdul Basit Abdul Samad
  - [ ] Multiple reciters
- [ ] Audio player UI
  - [ ] Inline audio player
  - [ ] Autoplay next verse
  - [ ] Playback speed control
  - [ ] Download recitation

---

## Milestone v5.0: Performance & Scale

### Phase 1: Book Chunking (Moved to v1.0 ✅)
- [x] Chunk large books
  - [x] Split Sahih al-Bukhari by volume/chunk
  - [x] Split other large hadith collections
  - [x] Create chunk manifests (replaced by deterministic chunking)
- [x] Lazy loading
  - [ ] Load chunks on demand (Client-side implementation pending)
  - [ ] Prefetch next chunk (Client-side implementation pending)
  - [ ] Cache management (Client-side implementation pending)

### Phase 2: Advanced Optimization
- [ ] Image optimization
  - [ ] Compress translator images
  - [ ] Use WebP format
  - [ ] Lazy load images
- [ ] Code splitting
  - [ ] Route-based splitting
  - [ ] Component lazy loading
  - [ ] Tree shaking
- [ ] CDN optimization
  - [ ] Optimize cache headers
  - [ ] Use service workers
  - [ ] Implement stale-while-revalidate

---

## Future Considerations (Post v5.0)

### Mobile Apps
- [ ] React Native app
- [ ] Offline support
- [ ] Push notifications for daily ayah

### Advanced Features
- [ ] User accounts
- [ ] Bookmarks
- [ ] Personal notes
- [ ] Study groups
- [ ] Sharing/social features

### Content Expansion
- [ ] More hadith collections (Muslim, Abu Dawud, etc.)
- [ ] Fiqh books (al-Muwatta, etc.)
- [ ] Historical texts
- [ ] Arabic language tools (dictionary, grammar)

---

## Definition of Done

### v1.0 Complete When:
- ✅ Can browse all books
- ✅ Can view any verse by surah:verse
- ✅ Can view any hadith by number
- ✅ All data validated and tested
- ✅ Deployed to Cloudflare
- ✅ Lighthouse score > 90

### v2.0 Complete When:
- ✅ Tags system fully functional
- ✅ Tafsir cross-references working
- ✅ Narrator profiles linked
- ✅ All enhanced metadata added
- ✅ User can discover content by topic

### v3.0 Complete When:
- ✅ Multiple translations available
- ✅ Romanization toggle working
- ✅ Footnotes & commentary displayed

### v4.0 Complete When:
- ✅ Full-text search functional
- ✅ Audio recitations playable
- ✅ Search results < 100ms

### v5.0 Complete When:
- ✅ All books chunked appropriately
- ✅ Performance optimized
- ✅ Can handle 50k+ DAU on free tier
