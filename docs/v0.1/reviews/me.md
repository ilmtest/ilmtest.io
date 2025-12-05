Reviewed: December 1, 2025, 9:56 PM

- The `Heading` is messy. Outside the comments it is not clear when each field should be set.
Instead of having some fields as optional (ie: pp being optional for Qur'an heading), we should have a base type which has all the fields necessary, and then a type for the Qu'ran with the appropriate fields it does  "&" with with the base type, and likewise for the hadith type. The `meta` property would be explicitly defined in each of these sub-types instead of existing in the base type. At the right places, the code would only be working with one of these types explicitly so all those fields should be present.

- Bunch of type definitions like TranslatorsManifest, HeadingsManifest are unused, let's get rid of them. We should only introduce these when we actually use it.

- What we do in migrations-scripts-v1 here:
```
type: e.type === 2 || e.id.startsWith('C') || e.id.startsWith('B') ? 'chapter-title' : 'hadith',
```

is wrong. If !e.type, then it's not a hadith, `type` should be omitted since it's just a regular text.

- I want you to also turn all the async function signatures to be arrow functions instead.
- Clean up the logs, get rid of all the unnecessary symbols and decoration markers on them, just add the necessary logs to make it professional looking.
- Add more logging in the migration script to be able to easily pinpoint what went wrong.