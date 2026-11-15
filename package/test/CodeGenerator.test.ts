import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import "../src/defineCustomBlocks.ts"
import * as Blockly from "blockly"
import CodeGenerator from "../src/CodeGenerator.ts"

describe("Code generation", function () {
    const text = readFileSync(new URL("./CodeGeneratorTests.xml", import.meta.url), "utf-8")
    const suite = Blockly.utils.xml.textToDom(text)

    for (const test of suite.getElementsByTagName("test")) {
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
