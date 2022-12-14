import { isNil } from 'lodash';
import { DOMParser, XMLSerializer } from 'xmldom';
import { useNamespaces } from 'xpath';

const TEXT_NODE = 3;
// regex pattern to detect if string has at least one non-whitespace character
const nonSpaceDetector = /\S/;

export namespace FilterUtils {
    /**
     * Apply a given XPath pattern to the xml document and return the xml document
     * without nodes that match the pattern as a string.
     *
     * @param xmlDocumentAsString the source XML document as string
     * @param xpathPattern the pattern to apply on trans-unit nodes to filter
     *                     nodes that match the pattern are filtered out
     * @param namespaceMap the namespace map to use for the xpath pattern
     * @returns XML documents without trans-unit nodes that match the pattern
     */
    export function applyXPathFilter(
        xmlDocumentAsString: string,
        xpathPattern: string,
        namespaceMap: { [name: string]: string }
    ): string {
        if (isNil(xpathPattern)) {
            return xmlDocumentAsString;
        }

        const root = new DOMParser().parseFromString(xmlDocumentAsString, 'text/xml');
        const select = useNamespaces(namespaceMap);
        const nodesToFilter = select(xpathPattern, root) as Node[];

        for (let node of nodesToFilter) {
            const parent = node.parentNode;
            const previousNode = node.previousSibling;
            // remove also the preceding whitespace if there is some.
            // this prevents empty lines when the input xml is nicely indented.
            if (previousNode && previousNode.nodeType === TEXT_NODE) {
                if (!nonSpaceDetector.test((previousNode as any).data)) {
                    // previous node only contains whitespace, so remove it
                    parent.removeChild(previousNode);
                }
            }
            parent.removeChild(node);
        }

        const xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(root);
    }
}
