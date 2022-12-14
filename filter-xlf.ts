#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import { outputFileSync } from 'fs-extra';
import { FilterUtils } from './src/utils/filter-utils';

const namespaces = { ns: 'urn:oasis:names:tc:xliff:document:1.2' };

export namespace FilterXlf {
    export function main(argv: string[]) {
        program
            .version('1.0.0')
            .command('filter', { isDefault: true })
            .description('filter source xlf file on id attribute pattern')
            .option('-id, --id-starts-with <required>', 'required attribute pattern')
            .option('-s, --source-file <required>', 'required source xlf file')
            .option('-t --target-file <required>', 'required target xlf file')
            .action(optional => {
                const { idStartsWith, sourceFile, targetFile } = optional;
                execFilterAction(idStartsWith, sourceFile, targetFile);
            });

        program.parse(argv);
    }

    function execFilterAction(idStartsWith: string, sourceFile: string, targetFile: string): void {
        // read file
        const sourceFileContent = readFileSync(sourceFile, 'utf-8');

        // build xpath filter
        // idStartsWith    xpathFilterPattern
        // `b3i`           `//ns:trans-unit[(starts-with(@id, "b3i"))]`
        // `!b3i`          `//ns:trans-unit[not(starts-with(@id, "b3i"))]`
        // nodes which are selected by the pattern are filtered out
        let notPrefix = '';
        if (idStartsWith.startsWith('!')) {
            notPrefix = 'not';
            idStartsWith = idStartsWith.substring(1);
        }
        const xpathFilterPattern = `//ns:trans-unit[${notPrefix}(starts-with(@id, "${idStartsWith}"))]`;
        console.log({ idStartsWith, sourceFile, targetFile, xpathFilterPattern, namespaces });
        // apply filter
        const targetFileContent = FilterUtils.applyXPathFilter(sourceFileContent, xpathFilterPattern, namespaces);

        //  write file
        outputFileSync(targetFile, targetFileContent);
    }
}

FilterXlf.main(process.argv);
