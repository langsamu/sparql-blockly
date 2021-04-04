import "../src/blocks"
import "jest"
import * as Blockly from "blockly"
import { readFileSync } from "fs"
import CodeGenerator from "../src/CodeGenerator"

describe("Code generation", function () {
    const text = readFileSync("test/CodeGeneratorTests.xml", "utf-8");
    const suite = new DOMParser().parseFromString(text, "text/xml");

    const tests = suite.evaluate("test", suite.documentElement, null, 4);
    for (let test = tests.iterateNext() as Element; test; test = tests.iterateNext() as Element) {
        const testName = test.getAttribute("name")
        const expected = test.getElementsByTagName("sparql")[0].textContent
        const blocklyElement = test.getElementsByTagName("xml")[0] as Element

        it(testName, function () {
            const generator = new CodeGenerator()
            const demoWorkspace = new Blockly.Workspace()
            Blockly.Xml.domToWorkspace(blocklyElement, demoWorkspace)
            const actual = generator.workspaceToCode(demoWorkspace)

            expect(actual).toStrictEqual(expected);
        })
    }
})
