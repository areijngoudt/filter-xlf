# filter-xlf

Node command line util to filter XLF files on attribute values that start with a value.

Supports XLF version 1.2.

Angular `extract-i18n` scans both source files and node_modules and extract i18n labels.
With this tool the labels from node_modules can be removed.

Or, when a repo contains several lib packages, `extract-i18n` generates 1 xlf file. With this tool,
the xlf file can be spit per lib-package and added to the libs.

```
ts-node index.ts  -id !lib -s ./src/assets/i18n/source.xlf -t ./src/assets/i18n/target.xlf
```

`-id` = id starts with value. Prefix with `!` to select nodes that do not start with that value
`-s` = source XML document path
`-t` = target XML document path

| idStartsWith |               xpathFilterPattern                |
| :----------: | :---------------------------------------------: |
|    `lib`     | `//ns:trans-unit[not(starts-with(@id, "lib"))]` |
|    `!lib`    |  `//ns:trans-unit[(starts-with(@id, "lib"))]`   |

nodes which are selected by the xpathFilterPattern are filtered out
