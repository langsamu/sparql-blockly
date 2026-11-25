import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { block, chain, wrap } from "../src/blocks.ts"

describe("blocks", function () {
    describe("block", function () {
        it("passes the full type through", function () {
            assert.deepStrictEqual(block("sparql11_a"), { type: "sparql11_a" })
        })

        it("omits empty fields and inputs", function () {
            assert.deepStrictEqual(block("a", { fields: {}, inputs: {} }), { type: "a" })
        })

        it("emits fields and inputs", function () {
            assert.deepStrictEqual(
                block("a", { fields: { x: "y" }, inputs: { v: { block: block("b") } } }),
                { type: "a", fields: { x: "y" }, inputs: { v: { block: { type: "b" } } } })
        })

        it("drops empty and undefined fields and keeps false", function () {
            assert.deepStrictEqual(
                block("a", { fields: { empty: "", missing: undefined, off: false, on: true } }),
                { type: "a", fields: { off: false, on: true } })
        })

        it("omits fields when all are dropped", function () {
            assert.deepStrictEqual(block("a", { fields: { empty: "", missing: undefined } }), { type: "a" })
        })

        it("drops inputs without a block", function () {
            assert.deepStrictEqual(
                block("a", { inputs: { gone: { block: undefined }, none: {}, kept: { block: block("b") } } }),
                { type: "a", inputs: { kept: { block: { type: "b" } } } })
            assert.deepStrictEqual(block("a", { inputs: { gone: { block: undefined } } }), { type: "a" })
        })

        it("emits keys in the order type, fields, inputs", function () {
            const state = block("a", { inputs: { v: { block: block("b") } }, fields: { x: "y" } })

            assert.deepStrictEqual(Object.keys(state), ["type", "fields", "inputs"])
        })

        it("emits no keys with undefined values", function () {
            assert.deepStrictEqual(Object.keys(block("a", { fields: { x: undefined } })), ["type"])
        })
    })

    describe("wrap", function () {
        it("places the child in the value input", function () {
            assert.deepStrictEqual(wrap("a", block("b")), { type: "a", inputs: { value: { block: { type: "b" } } } })
        })

        it("omits the input for an undefined child", function () {
            assert.deepStrictEqual(wrap("a", undefined), { type: "a" })
        })
    })

    describe("chain", function () {
        it("returns undefined for no states", function () {
            assert.equal(chain([]), undefined)
        })

        it("returns a single state unchanged", function () {
            assert.deepStrictEqual(chain([block("a")]), { type: "a" })
        })

        it("links states in order through next", function () {
            assert.deepStrictEqual(
                chain([block("a"), block("b"), block("c")]),
                { type: "a", next: { block: { type: "b", next: { block: { type: "c" } } } } })
        })

        it("does not mutate its arguments", function () {
            const states = [block("a"), block("b")]
            chain(states)

            assert.deepStrictEqual(states, [{ type: "a" }, { type: "b" }])
        })

        it("emits next after the other keys", function () {
            const state = chain([block("a", { fields: { x: "y" }, inputs: { v: { block: block("c") } } }), block("b")])

            assert.deepStrictEqual(Object.keys(state), ["type", "fields", "inputs", "next"])
        })
    })
})
