# Test Suite Organization

## Overview

The test suite is organized into focused test files for better maintainability and clarity.

## Test Files

### 1. `tests/migration-utils.test.ts`
**Unit Tests for Utility Functions**

Tests pure functions with mock data:
- Arabic number conversion (`arabicToWestern`)
- Hadith number extraction (`extractHadithNumber`)
- Qur'an excerpt transformation
- Hadith excerpt transformation
- Heading transformation
- Type determination logic

**Run:**
```bash
bun test tests/migration-utils.test.ts
```

---

### 2. `tests/index-generation.test.ts`
**Unit Tests for Index Generation**

Tests index generation functions:
- Surah:verse index generation
- Hadith number index generation
- Page index generation
- Edge cases (empty arrays, single items, non-sequential pages)

**Run:**
```bash
bun test tests/index-generation.test.ts
```

---

### 3. `tests/migration-integration.test.ts`
**Integration Tests for Migration Workflows**

Tests complete migration pipelines with realistic mock data:
- `migrateQuranData()` end-to-end
- `migrateHadithData()` end-to-end
- Data integrity checks
- Content order preservation

**Run:**
```bash
bun test tests/migration-integration.test.ts
```

---

### 4. `tests/data-validation.test.ts`
**Validation Tests for Actual Migrated Files**

Tests against real JSON files in `./public/data/`:
- Books metadata validation
- Qur'an content structure
- Hadith content structure
- Index file validation
- Data integrity (unique IDs, valid references)

**Run:**
```bash
bun test tests/data-validation.test.ts
```

**Note:** These tests will fail until you run the migration scripts to generate the actual data files.

---

## Running Tests

### Run All Tests
```bash
bun test
```

### Run Specific Directory
```bash
bun test tests/
```

### Run Single File
```bash
bun test tests/migration-utils.test.ts
```

### Watch Mode
```bash
bun test --watch
```

---

## Test Conventions

### 1. **it() Syntax**
All tests use `it('should...')` convention:
```typescript
it('should extract hadith number', () => {
  expect(extractHadithNumber('١ - حَدَّثَنَا...')).toBe(1);
});
```

### 2. **bun:test Conventions**
Using Bun-specific matchers:
- `toBeTrue()` instead of `toBe(true)`
- `toBeArray()` for array checks
- `toBeString()` for string checks
- `toBeNumber()` for number checks
- `toHaveLength()` for length checks
- `toInclude()` for substring checks
- `toStartWith()` for prefix checks

### 3. **Mock Data**
Tests use mock data passed as parameters (no file I/O in unit/integration tests):
```typescript
const mockData = {
  content: [
    { id: 1, nass: '...', text: '...', ... }
  ]
};

const result = migrateQuranData(mockData);
```

---

## TDD Workflow

1. **Write failing test** for new feature
2. **Run test** - it should fail
3. **Implement feature** in migration-utils.ts or migration-scripts-v1.ts
4. **Run test** - it should pass
5. **Refactor** if needed
6. **Repeat**

---

## Test Coverage Goals

- **Unit Tests:** >90% coverage for utility functions
- **Integration Tests:** Cover all migration workflows
- **Validation Tests:** Ensure data quality in production files

---

## File Dependencies

```
migration-utils.ts
  ├── migration-scripts-v1.ts (uses utilities)
  └── tests/
      ├── migration-utils.test.ts (tests utilities)
      ├── index-generation.test.ts (tests index functions)
      ├── migration-integration.test.ts (tests migration scripts)
      └── data-validation.test.ts (validates output files)
```

---

## Next Steps

1. Run migration scripts:
   ```bash
   bun run migration-scripts-v1.ts
   ```

2. Run all tests:
   ```bash
   bun test
   ```

3. Fix any failing tests

4. Add new tests as features are added
