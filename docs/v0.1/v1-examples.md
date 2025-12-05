# v1 Example Data Files

## 1. books.json (Minimal)

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
      "refTemplate": "https://quran.com/{{surah}}:{{verse}}"
    },
    {
      "id": 2576,
      "slug": "sahih-bukhari",
      "type": "hadith",
      "title": "al-Jāmiʿ al-Musnad al-Ṣaḥīḥ",
      "unwan": "الجامع المسند الصحيح",
      "author": "Muḥammad ibn Ismāʿīl al-Bukhārī",
      "refTemplate": "https://shamela.ws/book/3310/{{page}}"
    }
  ]
}
```

## 2. translators.json (Minimal)

```json
{
  "translators": [
    {
      "id": 13,
      "name": "Muhammad Muhsin Khan"
    },
    {
      "id": 873,
      "name": "Abu al-Yaman Khalil Klopfenstein",
      "img": "https://res.cloudinary.com/.../image.jpg"
    }
  ]
}
```

## 3. books/1/content.json (Qur'an - Excerpt)

```json
{
  "content": [
    {
      "id": "1:1",
      "eid": 1,
      "type": "verse",
      "nass": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "text": "In the Name of Allāh, the Most Merciful, the Especially Merciful.",
      "translator": 13,
      "page": 1,
      "meta": {
        "surah": 1,
        "verse": 1
      }
    },
    {
      "id": "1:2",
      "eid": 2,
      "type": "verse",
      "nass": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "text": "All praise is due to Allāh, the Rabb of all creation.",
      "translator": 13,
      "page": 1,
      "meta": {
        "surah": 1,
        "verse": 2
      }
    },
    {
      "id": "1:286",
      "eid": 286,
      "type": "verse",
      "nass": "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا...",
      "text": "Allāh does not burden any soul beyond its capacity...",
      "translator": 13,
      "page": 42,
      "meta": {
        "surah": 2,
        "verse": 286
      }
    }
  ]
}
```

## 4. books/1/headings.json (Qur'an Surahs)

```json
{
  "headings": [
    {
      "id": "quran-surah-1",
      "nass": "الفاتحة",
      "text": "The Opening",
      "translator": 13,
      "num": 1,
      "page": 1,
      "level": 1
    },
    {
      "id": "quran-surah-2",
      "nass": "البقرة",
      "text": "The Cow",
      "translator": 13,
      "num": 2,
      "page": 2,
      "level": 1
    },
    {
      "id": "quran-surah-114",
      "nass": "الناس",
      "text": "Mankind",
      "translator": 13,
      "num": 114,
      "page": 604,
      "level": 1
    }
  ]
}
```

## 5. books/1/indexes/surah-verse.json

```json
{
  "1:1": { "eid": 1, "page": 1 },
  "1:2": { "eid": 2, "page": 1 },
  "1:7": { "eid": 7, "page": 1 },
  "2:1": { "eid": 8, "page": 2 },
  "2:255": { "eid": 286, "page": 42 },
  "114:6": { "eid": 6236, "page": 604 }
}
```

## 6. books/1/indexes/page.json

```json
{
  "1": { "start": 0, "end": 6 },
  "2": { "start": 7, "end": 11 },
  "42": { "start": 285, "end": 286 },
  "604": { "start": 6230, "end": 6235 }
}
```

## 7. books/2576/content.json (Sahih al-Bukhari - Excerpt)

```json
{
  "content": [
    {
      "id": "2576:P10",
      "eid": "P10",
      "type": "hadith",
      "nass": "١ - حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللهِ بْنُ الزُّبَيْرِ...",
      "text": "Al-Ḥumaydī 'Abd Allāh ibn al-Zubayr narrated to us...",
      "translator": 873,
      "page": 10,
      "meta": {
        "volume": 1,
        "pp": 6,
        "hadithNum": 1
      }
    },
    {
      "id": "2576:C43",
      "eid": "C43",
      "type": "chapter-title",
      "nass": "بَابُ سُؤَالِ جِبْرِيلَ النَّبِيَّ ﷺ...",
      "text": "Chapter: Jibrīl's questioning of the Prophet ﷺ...",
      "translator": 873,
      "page": 95,
      "meta": {
        "volume": 1,
        "pp": 19
      }
    },
    {
      "id": "2576:P94",
      "eid": "P94",
      "type": "hadith",
      "nass": "٤٩ - أَخْبَرَنَا قُتَيْبَةُ بْنُ سَعِيدٍ...",
      "text": "Qutaybah ibn Sa'īd informed us...",
      "translator": 873,
      "page": 94,
      "meta": {
        "volume": 1,
        "pp": 19,
        "hadithNum": 49
      }
    }
  ]
}
```

## 8. books/2576/headings.json (Bukhari Books/Chapters)

```json
{
  "headings": [
    {
      "id": "bukhari-book-1",
      "nass": "كتاب بدء الوحي",
      "text": "Book of the Beginning of Revelation",
      "translator": 873,
      "num": 1,
      "page": 9,
      "level": 1
    },
    {
      "id": "bukhari-book-1-ch-1",
      "nass": "باب كيف كان بدء الوحي",
      "text": "Chapter: How the revelation began",
      "translator": 873,
      "page": 9,
      "parent": "bukhari-book-1",
      "level": 2
    }
  ]
}
```

## 9. books/2576/indexes/hadith-num.json

```json
{
  "1": { "eid": "P10", "page": 10 },
  "49": { "eid": "P94", "page": 94 },
  "50": { "eid": "P96", "page": 96 },
  "7563": { "eid": "P11500", "page": 11500 }
}
```

## 10. books/2576/indexes/page.json

```json
{
  "10": { "start": 1, "end": 3 },
  "94": { "start": 43, "end": 43 },
  "95": { "start": 44, "end": 46 },
  "11500": { "start": 7562, "end": 7562 }
}
```

---

## Key Differences from Original Format

### Before (Qur'an):
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

### After (v1):
```json
{
  "id": "1:1",
  "eid": 1,
  "type": "verse",
  "nass": "...",
  "text": "...",
  "translator": 13,
  "page": 1,
  "meta": {
    "surah": 1,
    "verse": 1
  }
}
```

### Changes:
- ✅ `id` now global: `"1:1"` instead of `1`
- ✅ Added `eid` for local excerpt ID
- ✅ Added `type` field
- ✅ Moved `surah`, `verse` into `meta` object
- ✅ Removed `chapter` (will use headings instead)
