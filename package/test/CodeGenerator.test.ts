import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import "../src/defineCustomBlocks.ts"
import * as Blockly from "blockly"
import CodeGenerator from "../src/CodeGenerator.ts"

interface Fixture {
    name: string
    sparql: string
    workspace: ReturnType<typeof Blockly.serialization.workspaces.save>
}

describe("Code generation", function () {
    const suite: Fixture[] = JSON.parse(readFileSync(new URL("./CodeGeneratorTests.json", import.meta.url), "utf-8"))

    for (const { name, sparql: expected, workspace } of suite) {
        it(name, function () {
            const generator = new CodeGenerator()
            const demoWorkspace = new Blockly.Workspace()
            Blockly.serialization.workspaces.load(workspace, demoWorkspace)
            const actual = generator.workspaceToCode(demoWorkspace)

            assert.equal(actual, expected)
        })
    }
})
