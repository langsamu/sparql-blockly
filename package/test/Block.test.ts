import { describe, it, mock } from "node:test"
import assert from "node:assert/strict"
import { Block } from "../src/Block.ts"
import type BlockGenerator from "../src/BlockGenerator.ts"

describe("Block", function () {
    it("addItems builds each item once", function () {
        const processor = mock.fn((item: string) => new Block(item))

        new Block("parent").addItems("items", ["a", "b", "c"], processor, null as BlockGenerator)

        assert.equal(processor.mock.callCount(), 3)
    })
})
