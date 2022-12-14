import { DOMParser } from 'xmldom';
import { FilterUtils } from './filter-utils';

const xmlStart = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template">
    <body>`;
const xmlEnd = `
    </body>
  </file>
</xliff>`;
const binderNodes = `
        <trans-unit id="binder.navbar.binder-details" datatype="html">
          <source>Binder Details</source>
          <context-group purpose="location">
            <context context-type="sourcefile">libs/binder-lib/src/lib/components/containers/binder-page-navigation-container/binder-page-navigation-container.config.ts</context>
            <context context-type="linenumber">9</context>
          </context-group>
        </trans-unit>
        <trans-unit id="binder.navbar.audit-trail" datatype="html">
          <source>Audit Trail</source>
          <context-group purpose="location">
            <context context-type="sourcefile">libs/binder-lib/src/lib/components/containers/binder-page-navigation-container/binder-page-navigation-container.config.ts</context>
            <context context-type="linenumber">13,14</context>
          </context-group>
        </trans-unit>`;
const libNodes = `
        <trans-unit id="b3i.ui.confirm-dialog.yes" datatype="html">
          <source>Yes</source>
          <context-group purpose="location">
            <context context-type="sourcefile">node_modules/projects/b3i-ui-lib/src/lib/confirm-dialog/confirm-dialog.component.ts</context>
            <context context-type="linenumber">97,98</context>
          </context-group>
        </trans-unit>
        <trans-unit id="b3i.ui.duration-unit.years" datatype="html">
          <source>Years</source>
          <context-group purpose="location">
            <context context-type="sourcefile">node_modules/projects/b3i-ui-lib/src/lib/utils/duration-helper.ts</context>
            <context context-type="linenumber">30,31</context>
          </context-group>
        </trans-unit>`;
const xmlAllNodes = xmlStart + binderNodes + libNodes + xmlEnd;
const xmlBinderNodes = xmlStart + binderNodes + xmlEnd;
const xmlLibNodes = xmlStart + libNodes + xmlEnd;
const namespaces = { ns: 'urn:oasis:names:tc:xliff:document:1.2' };

describe('FileUtils', () => {
    it('should filter XML lib nodes', () => {
        const xpathFilterPattern = '//ns:trans-unit[(starts-with(@id, "b3i"))]';
        const actual = FilterUtils.applyXPathFilter(xmlAllNodes, xpathFilterPattern, namespaces);
        const expected = xmlBinderNodes;
        expect(actual).toEqual(expected);
    });

    it('should filter XML none lib nodes', () => {
        const xpathFilterPattern = '//ns:trans-unit[not(starts-with(@id, "b3i"))]';
        const actual = FilterUtils.applyXPathFilter(xmlAllNodes, xpathFilterPattern, namespaces);
        const expected = xmlLibNodes;
        expect(actual).toEqual(expected);
    });

    it('should return same xml for null xpathPattern', () => {
        const actual = FilterUtils.applyXPathFilter(xmlAllNodes, null, namespaces);
        const expected = xmlAllNodes;
        expect(actual).toEqual(expected);
    });
});
