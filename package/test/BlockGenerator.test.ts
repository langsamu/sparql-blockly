import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { utils } from "blockly"
import "../src/defineCustomBlocks"
import BlockGenerator from "../src/BlockGenerator"
import { parseSparql } from "../src/parser"
import { assertXmlEqual } from "./xml"

describe("Block generation", function () {
    const text = readFileSync(join(__dirname, "..", "..", "BlockGeneratorTests.xml"), "utf-8")
    const suite = utils.xml.textToDom(text)

    for (const test of Array.from(suite.getElementsByTagName("test"))) {
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
