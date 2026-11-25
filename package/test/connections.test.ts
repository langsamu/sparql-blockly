import { describe, it } from "node:test"
import assert from "node:assert/strict"
import "../src/defineCustomBlocks.ts"
import * as Blockly from "blockly"

const reified = "sparql11_embtp"
const term = "sparql11_tripleterm"

function canConnect(parentType: string, inputName: string, childType: string): boolean {
    const workspace = new Blockly.Workspace()
    const parent = workspace.newBlock(parentType)
    const child = workspace.newBlock(childType)
    const input = parent.getInput(inputName)
    assert.ok(input?.connection, `${parentType}.${inputName}`)
    assert.ok(child.outputConnection)

    return workspace.connectionChecker.canConnect(child.outputConnection, input.connection, false)
}

function load(state: object): void {
    Blockly.serialization.blocks.append(state as Blockly.serialization.blocks.State, new Blockly.Workspace())
}

describe("Connection checks", function () {
    const allowed: [string, string, string][] = [
        ["BIND value", "sparql11_expressionasvar:value", term],
        ["VALUES value", "sparql11_datablockvalueitem:value", term],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", reified],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", term],
        ["reified triple subject", `${reified}:subject`, reified],
        ["reified triple object", `${reified}:object`, reified],
        ["reified triple subject", `${reified}:subject`, term],
        ["reified triple object", `${reified}:object`, term],
        ["triple term subject", `${term}:subject`, term],
        ["triple term object", `${term}:object`, term],
    ]
    const refused: [string, string, string][] = [
        ["BIND value", "sparql11_expressionasvar:value", reified],
        ["VALUES value", "sparql11_datablockvalueitem:value", reified],
        ["triple term subject", `${term}:subject`, reified],
        ["triple term object", `${term}:object`, reified],
    ]

    for (const [name, target, child] of allowed) {
        const [parent, input] = target.split(":") as [string, string]
        it(`allows ${child} in ${name}`, function () {
            assert.equal(canConnect(parent, input, child), true)
        })
    }

    for (const [name, target, child] of refused) {
        const [parent, input] = target.split(":") as [string, string]
        it(`refuses ${child} in ${name}`, function () {
            assert.equal(canConnect(parent, input, child), false)
        })
    }

    it("allows a reified triple as an object and in a collection", function () {
        const workspace = new Blockly.Workspace()
        const child = workspace.newBlock(reified)
        for (const [type, name] of [["sparql11_objectlistitem", "value"], ["sparql11_graphnodeitem", "value"]] as const) {
            const input = workspace.newBlock(type).getInput(name)
            assert.ok(input?.connection, type)
            assert.ok(child.outputConnection)
            assert.equal(workspace.connectionChecker.canConnect(child.outputConnection, input.connection, false), true, type)
        }
    })

    it("refuses to load a reified triple into BIND", function () {
        const state = { type: "sparql11_expressionasvar", inputs: { value: { block: { type: reified } } } }
        assert.throws(() => load(state))
    })
})
