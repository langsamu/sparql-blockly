import { describe, it } from "node:test"
import assert from "node:assert/strict"
import "../src/defineCustomBlocks.ts"
import * as Blockly from "blockly"

const reified = "sparql11_embtp"
const term = "sparql11_tripleterm"
const data = "sparql11_tripletermdata"
const expr = "sparql11_exprtripleterm"

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
        ["BIND value", "sparql11_expressionasvar:value", expr],
        ["FILTER value", "sparql11_brackettedexpression:value", expr],
        ["function argument", "sparql11_builtincall1:arg1", expr],
        ["VALUES value", "sparql11_datablockvalueitem:value", data],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", reified],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", term],
        ["reified triple subject", `${reified}:subject`, reified],
        ["reified triple object", `${reified}:object`, reified],
        ["reified triple subject", `${reified}:subject`, term],
        ["reified triple object", `${reified}:object`, term],
        ["triple term subject", `${term}:subject`, term],
        ["triple term object", `${term}:object`, term],
        ["triple term subject", `${term}:subject`, "sparql11_var1"],
        ["triple term subject", `${term}:subject`, "sparql11_iriref"],
        ["triple term subject", `${term}:subject`, "sparql11_anon"],
        ["triple term subject", `${term}:subject`, "sparql11_blanknodelabel"],
        ["triple term subject", `${term}:subject`, "sparql11_string"],
        ["triple term predicate", `${term}:predicate`, "sparql11_a"],
        ["triple term predicate", `${term}:predicate`, "sparql11_var1"],
        ["triple term object", `${term}:object`, "sparql11_numericliteral"],
        ["triple term object", `${term}:object`, "sparql11_blanknodelabel"],
        ["triple term data subject", `${data}:subject`, "sparql11_iriref"],
        ["triple term data subject", `${data}:subject`, "sparql11_prefixedname"],
        ["triple term data predicate", `${data}:predicate`, "sparql11_iriref"],
        ["triple term data predicate", `${data}:predicate`, "sparql11_a"],
        ["triple term data object", `${data}:object`, "sparql11_iriref"],
        ["triple term data object", `${data}:object`, "sparql11_string"],
        ["triple term data object", `${data}:object`, "sparql11_numericliteral"],
        ["triple term data object", `${data}:object`, "sparql11_booleanliteral"],
        ["triple term data object", `${data}:object`, data],
        ["expression triple term subject", `${expr}:subject`, "sparql11_iriref"],
        ["expression triple term subject", `${expr}:subject`, "sparql11_var1"],
        ["expression triple term predicate", `${expr}:predicate`, "sparql11_a"],
        ["expression triple term predicate", `${expr}:predicate`, "sparql11_var2"],
        ["expression triple term object", `${expr}:object`, "sparql11_iriref"],
        ["expression triple term object", `${expr}:object`, "sparql11_langstring"],
        ["expression triple term object", `${expr}:object`, "sparql11_var1"],
        ["expression triple term object", `${expr}:object`, expr],
    ]
    const refused: [string, string, string][] = [
        ["BIND value", "sparql11_expressionasvar:value", reified],
        ["BIND value", "sparql11_expressionasvar:value", term],
        ["BIND value", "sparql11_expressionasvar:value", data],
        ["FILTER value", "sparql11_brackettedexpression:value", data],
        ["function argument", "sparql11_builtincall1:arg1", term],
        ["VALUES value", "sparql11_datablockvalueitem:value", reified],
        ["VALUES value", "sparql11_datablockvalueitem:value", term],
        ["VALUES value", "sparql11_datablockvalueitem:value", expr],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", data],
        ["triple pattern subject", "sparql11_triplessamesubject:subject", expr],
        ["triple term subject", `${term}:subject`, reified],
        ["triple term object", `${term}:object`, reified],
        ["triple term subject", `${term}:subject`, data],
        ["triple term object", `${term}:object`, expr],
        ["triple term subject", `${term}:subject`, "sparql11_nil"],
        ["triple term data subject", `${data}:subject`, "sparql11_var1"],
        ["triple term data subject", `${data}:subject`, "sparql11_anon"],
        ["triple term data subject", `${data}:subject`, "sparql11_blanknodelabel"],
        ["triple term data subject", `${data}:subject`, "sparql11_string"],
        ["triple term data subject", `${data}:subject`, data],
        ["triple term data predicate", `${data}:predicate`, "sparql11_var1"],
        ["triple term data object", `${data}:object`, "sparql11_var1"],
        ["triple term data object", `${data}:object`, "sparql11_blanknodelabel"],
        ["triple term data object", `${data}:object`, term],
        ["expression triple term subject", `${expr}:subject`, "sparql11_blanknodelabel"],
        ["expression triple term subject", `${expr}:subject`, "sparql11_anon"],
        ["expression triple term subject", `${expr}:subject`, "sparql11_string"],
        ["expression triple term subject", `${expr}:subject`, "sparql11_numericliteral"],
        ["expression triple term subject", `${expr}:subject`, expr],
        ["expression triple term object", `${expr}:object`, "sparql11_blanknodelabel"],
        ["expression triple term object", `${expr}:object`, data],
        ["expression triple term object", `${expr}:object`, term],
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
