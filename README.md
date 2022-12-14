# filter-xlf

Node command line util to filter XLF files using XPath. Supports filtering on attribute values

```
ts-node index.ts  -id !b3i -s ./src/assets/i18n/source.xlf -t ./src/assets/i18n/target.xlf
```

| idStartsWith |               xpathFilterPattern                |
| :----------: | :---------------------------------------------: |
|    `b3i`     |  `//ns:trans-unit[(starts-with(@id, "b3i"))]`   |
|    `!b3i`    | `//ns:trans-unit[not(starts-with(@id, "b3i"))]` |

nodes which are selected by the pattern are filtered out
