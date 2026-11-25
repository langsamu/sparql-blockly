import { describe, it } from "node:test"
import assert from "node:assert/strict"
import * as Blockly from "blockly"
import { sparqlToBlockly, blocklyToSparql } from "../src/index.ts"

describe("sparqlToBlockly", function () {
    it("returns a workspace state with one top block", function () {
        const state = sparqlToBlockly("SELECT * WHERE { ?s ?p ?o }")

        assert.ok(state)
        assert.equal(state.blocks.languageVersion, 0)
        assert.equal(state.blocks.blocks.length, 1)
        assert.equal(state.blocks.blocks[0]?.type, "sparql11_query")
    })

    it("returns a state that loads into a workspace", function () {
        const workspace = new Blockly.Workspace()
        const state = sparqlToBlockly("SELECT * WHERE { ?s ?p ?o }")
        assert.ok(state)

        Blockly.serialization.workspaces.load(state, workspace)

        const [block] = workspace.getTopBlocks()
        assert.ok(block)
        assert.equal(block.type, "sparql11_query")
        assert.match(String(blocklyToSparql(block)), /SELECT/)
    })

})
