import { describe, it } from "node:test"
import * as assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import "../src/defineCustomBlocks"
import * as Blockly from "blockly"
import CodeGenerator from "../src/CodeGenerator"

describe("Code generation", function () {
    const text = readFileSync("test/CodeGeneratorTests.xml", "utf-8")
    const suite = Blockly.utils.xml.textToDom(text)

    for (const test of Array.from(suite.getElementsByTagName("test"))) {
        const testName = test.getAttribute("name")
        const expected = test.getElementsByTagName("sparql")[0].textContent
        const blocklyElement = test.getElementsByTagName("xml")[0]

        it(testName, function () {
            const generator = new CodeGenerator()
            const demoWorkspace = new Blockly.Workspace()
            Blockly.Xml.domToWorkspace(blocklyElement, demoWorkspace)
            const actual = generator.workspaceToCode(demoWorkspace)

            assert.equal(actual, expected)
        })
    }
})
