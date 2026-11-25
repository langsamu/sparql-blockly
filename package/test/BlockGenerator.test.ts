import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import type { serialization } from "blockly"
import "../src/defineCustomBlocks.ts"
import BlockGenerator from "../src/BlockGenerator.ts"
import { parseSparql } from "../src/parser.ts"

interface Fixture {
    name: string
    sparql: string
    workspace: ReturnType<typeof serialization.workspaces.save>
}

describe("Block generation", function () {
    const suite: Fixture[] = JSON.parse(readFileSync(new URL("./BlockGeneratorTests.json", import.meta.url), "utf-8"))

    for (const { name, sparql, workspace } of suite) {
        const query = parseSparql(sparql)

        it(name, function () {
            const visitor = new BlockGenerator()
            const block = visitor.visit(query)
            const actual = { blocks: { languageVersion: 0, blocks: [block] } }
            assert.deepStrictEqual(actual, workspace)
        })
    }
})
