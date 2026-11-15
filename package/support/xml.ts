import assert from "node:assert/strict"
import { utils } from "blockly"

export function assertXmlEqual(actual: Element, expected: Element): void {
    assert.ok(withoutWhitespace(actual).isEqualNode(withoutWhitespace(expected)), `Expected\n${utils.xml.domToText(actual)}\nto equal\n${utils.xml.domToText(expected)}`)
}

function withoutWhitespace(element: Element): Element {
    const clone = element.cloneNode(true) as Element
    removeWhitespace(clone)
    return clone
}

function removeWhitespace(node: Node): void {
    for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === child.TEXT_NODE && !child.textContent?.trim()) {
            child.remove()
        } else {
            removeWhitespace(child)
        }
    }
}
