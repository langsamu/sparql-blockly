import "jest"
import { Block } from "../src/Block"
import type BlockGenerator from "../src/BlockGenerator"

describe("Block", function () {
    test("addItems builds each item once", function () {
        const processor = jest.fn((item: string) => new Block(item))

        new Block("parent").addItems("items", ["a", "b", "c"], processor, null as BlockGenerator)

        expect(processor).toHaveBeenCalledTimes(3)
    })
})
