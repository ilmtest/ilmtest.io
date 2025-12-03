# IlmTest.io

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/259f7be9-9cf1-4d32-9cfa-c17c9ae69a1a.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/259f7be9-9cf1-4d32-9cfa-c17c9ae69a1a)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/ilmtestio)](https://ilmtestio.vercel.app)

**Islām In Its Original Form**

IlmTest is an ambitious platform designed to translate and make accessible every Islamic text from Arabic to English, serving students of knowledge, translators, publishers, researchers, and everyday Muslims.

## 🌟 Mission

To translate each and every Islamic text from Arabic to English and have it easily accessible for the everyday Muslim, following the understanding of the first generation.

## ✨ Features

- **Developer API** - Unified platform for Islamic apps to integrate with for consistent, authentic information
- **Automatic ALA-LC Transliterations** - Type naturally and let the platform handle formatting
- **Free & Earn** - Completely free services with cryptocurrency token rewards for contributors
- **Collaboration** - Peer-review translations, critique, and perfect accuracy together
- **Audio Transcriptions** - Convert lectures into browsable transcriptions
- **Social Media Integration** - Post benefits directly and schedule content
- **Corrections & Revisions** - Fix inaccuracies in existing digital libraries
- **Tagging System** - Organize notes, translations, and excerpts for efficient research
- **Explanations** - Browse scholarly interpretations and explanations of texts
- **Glossary** - Technical Islamic concepts and Arabic vocabulary
- **Authentication** - Differentiate weak narrations from authentic ones
- **Deep Research** - Narrator biographies, author information, and historical context

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with the App Router, typed routes, and View Transitions enabled
- **Runtime:** Bun ≥1.3.0
- **UI Components:** Radix UI primitives with optimized package imports
- **Styling:** Tailwind CSS 4.1 with the PostCSS pipeline
- **Animations:** Framer Motion 12
- **Icons:** Tabler Icons & Lucide React
- **Language:** TypeScript 5.9
- **Code Quality:** Biome 2.2 for formatting & linting

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/ilmtest/ilmtest.io.git
cd ilmtest.io

# Install dependencies
bun install
```

> **Need the bleeding edge?** When network access is available run `bun update --latest` to pull the newest stable releases. The repository configuration already enables the recommended feature flags so no code changes are needed after upgrading.

### Development

```bash
# Start development server with Turbopack
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
bun run build

# Start production server
bun run start
```

### Code Quality

```bash
# Format code
bun run format

# Lint code
bun run lint
```

## 📚 Current Implementation (v1.0)

### Data Architecture

The project uses a **unified JSON-based data structure** optimized for static CDN delivery:

**Key Features:**
- **Discriminated union types** for type-safe content handling
- **Chunked content** (500 items per chunk) for efficient loading
- **Consolidated indexes** with O(1) lookups for verses, hadith numbers, and pages
- **Smart chunk loading** using `indexRange` metadata
- **Version-controlled indexes** for cache busting

### Data Structure

```typescript
// Discriminated unions for type safety
type VerseExcerpt = {
    type: 'verse';
    meta: { surah: number; verse: number };
    // ...
};

type HadithExcerpt = {
    type: 'hadith';
    meta: { volume: number; pp: number; hadithNum?: number };
    // ...
};

// Strict heading types
type QuranHeading = {
    type: 'quran';
    surah: number;
    // ...
};

type HadithHeading = {
    type: 'hadith';
    volume: number;
    pp: number;
    parent?: string;
    // ...
};
```

### Migration System

Use the migration scripts to transform source data:

```bash
# Run migrations (requires HuggingFace token)
export HF_TOKEN="your_token"
export HF_FILE_TEMPLATE="rhaq/shamela_translations/resolve/main/{{bookId}}.json.zip"
export ILMTEST_API_URL="https://api.ilmtest.com"
bun run migrate
```

**What gets migrated:**
- Qur'an from API (6,236 verses, 114 surahs)
- Hadith collections from HuggingFace (e.g., Sahih al-Bukhari: 10,967 excerpts, 4,146 headings)

### Browse UI

Visit `/browse` to explore:
- **Books list** - View available collections
- **Headings** - Navigate surahs (Qur'an) or books/chapters (Hadith)
- **Excerpts** - Read verses or hadith with Arabic \u0026 English translation

**Features:**
- Static export ready (all pages pre-generated)
- Arabic text with IBM Plex Sans Arabic font
- RTL text rendering
- Dark mode support
- Breadcrumb navigation

```bash
# Build static site
bun run build  # Generates ~120 static HTML pages in out/
```

## 📖 Project History

IlmTest evolved from a series of BlackBerry 10 applications developed in collaboration with students of knowledge:

- **2012** - [Salat10](https://code.google.com/archive/p/salat10/) launched as the first native prayer time calculator for BlackBerry 10, later expanded with fiqh articles
- **Quran10** - Comprehensive Quran app with integrated tafsir, recitations, similar verses, and multiple translations ([Demo](https://youtu.be/YOXtjnNWVZM))
- **Sunnah10** - Hadith books with similar narration grouping and scholarly explanations ([Demo](https://youtu.be/S1S_adzlGpM))

The platform originated from a need to verify translations and provide Arabic sources for Islamic texts shared in study groups.

## 🤝 Our Beliefs

- **ʿAqīdah & Manhaj** - Following the Quran and Sunnah according to the understanding of the Companions
- **Unity** - Inviting Muslims to unite upon truth, not innovation
- **Ijtihād** - Every Muslim should strive to attain unfiltered truth from revelation
- **Tawḥīd** - Worship Allah alone, affirming His Names and Attributes
- **Taqlīd** - Learn evidences from sources of revelation; truth is not known by men
- **Freedom** - Knowledge should be free from monetization and copyright restrictions

## 🌐 Connect With Us

- [Telegram Channel](https://t.me/ilmtest)
- [Telegram Project Group](https://t.me/ilmtest_project)
- [Telegram Research Channel](https://t.me/ilmtest_research)
- [Instagram](https://instagram.com/ilmtest)
- [X (Twitter)](https://x.com/ilmtest_)
- [YouTube](https://youtube.com/@ilmtest)
- [Facebook](https://fb.me/ilmtest)
- [Tumblr](https://ilmtest.tumblr.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Contributions

Found a bug or have a feature request? Please open an issue on our [GitHub Issues](https://github.com/ilmtest/ilmtest.io/issues) page.

## 🙏 Acknowledgments

Special thanks to all contributors and students of knowledge who have collaborated on this project throughout its evolution.

---

*"Be like a person whose feet are on the ground, his ambitions in the heavens."*  
*فكن رجلا رجله فِي الثرى وهامة همته فِي الثريا*