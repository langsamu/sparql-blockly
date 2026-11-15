import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { utils } from "blockly"
import "../src/defineCustomBlocks.ts"
import BlockGenerator from "../src/BlockGenerator.ts"
import { parseSparql } from "../src/parser.ts"
import { assertXmlEqual } from "../support/xml.ts"

describe("Block generation", function () {
    const text = readFileSync(new URL("./BlockGeneratorTests.xml", import.meta.url), "utf-8")
    const suite = utils.xml.textToDom(text)

    for (const test of suite.getElementsByTagName("test")) {
        const testName = test.getAttribute("name")

        const sparql = test.getElementsByTagName("sparql")[0].textContent
        const query = parseSparql(sparql)
        const expected = test.getElementsByTagName("xml")[0]

        it(testName, function () {
            const visitor = new BlockGenerator()
            const block = visitor.visit(query)
            assertXmlEqual(block.xml, expected)
        })
    }
})
