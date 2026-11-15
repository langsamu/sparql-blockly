import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import type * as T12 from "@traqula/rules-sparql-1-2"
import { parseSparql } from "../src/parser.ts"

describe("Parser", function () {
    it("parses a query and marks repeated subjects as noMaterialize", function () {
        const query = parseSparql("PREFIX : <http://e/> SELECT * { :s :p :o ; :q :r }") as T12.QuerySelect
        const factory = new AstFactory()

        assert.equal(query.type, "query")
        assert.ok(query.context.some(definition => definition.type === "contextDef" && definition.subType === "prefix"))

        const bgp = query.where.patterns[0] as T12.PatternBgp
        const triples = bgp.triples as T12.TripleNesting[]
        assert.equal(triples.length, 2)
        assert.equal(factory.isSourceLocationNoMaterialize(triples[0].subject.loc), false)
        assert.equal(factory.isSourceLocationNoMaterialize(triples[1].subject.loc), true)
    })
})
